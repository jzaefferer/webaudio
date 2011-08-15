window.avis = {};

avis.magnitude=650.0;
avis.timer=400;
avis.zoomvalue=4000;

avis.initialize = function(){
	avis.asciiDancer= ["\\o/","\\\\o","o//","~o~","\\o~","~o/","\\/o","o\\/"];
	avis.colors = ["rgb(255, 165, 0)","rgb(255, 255, 0)","rgb(0, 0, 255)","rgb(255, 0, 0)","rgb(255, 165, 0)"];
};

avis.visualize = function(){
	zeit = new Date();
	currentDance = avis.asciiDancer[Math.floor((Math.random()*avis.asciiDancer.length))];
	currentColor = avis.colors[Math.floor((Math.random()*avis.colors.length))];
	while($("#asciidancer").html() == currentDance){
		currentDance = avis.asciiDancer[Math.floor((Math.random()*avis.asciiDancer.length))];
	}
	while($("body").css("backgroundColor") == currentColor){
		currentColor = avis.colors[Math.floor((Math.random()*avis.colors.length))];
	}
	$("#asciidancer").html(currentDance);
	$("body").css("backgroundColor",currentColor);
};

function loadSample(url,callback) {
    // Load asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() { 
        callback(request.response);
    }
    request.send();
}

$().ready(function() {
	var context = new webkitAudioContext();
	var source = context.createBufferSource();
	
	var analyser = context.createAnalyser();
	analyser.fftSize = 2048;
	
    // This AudioNode will do the amplitude modulation effect directly in JavaScript
    var jsProcessor = context.createJavaScriptNode(4096);
    jsProcessor.onaudioprocess = function() {
    	//console.log(this, arguments);
    	//source.noteOff();
        analyser.smoothingTimeConstant = 0.75;
        analyser.getByteFrequencyData(freqByteData);
    };

    
    // Connect the processing graph: source -> jsProcessor -> analyser -> destination
    source.connect(jsProcessor);
    //jsProcessor.connect(context.destination);
    jsProcessor.connect(analyser);
    analyser.connect(context.destination);

	loadSample("../samples/Vidian_-_Making_Me_Nervous_cropped.mp3",function(arrayBuffer){
		source.buffer = context.createBuffer(arrayBuffer, false);
		//source.looping = true;
		source.noteOn(0);
	});
	
	return;
	
	avis.audio = $("#asciidanceraudiocontrol").get(0);
	avis.audio.addEventListener('loadedmetadata', function(){
		avis.channels = avis.audio.mozChannels;
		avis.rate = avis.audio.mozSampleRate;
		avis.frameBufferLength = avis.audio.mozFrameBufferLength;
		console.log(avis)
		avis.signal = new Float32Array(avis.frameBufferLength / avis.channels),
		avis.fft = new FFT(avis.frameBufferLength / avis.channels, avis.rate);
		avis.initialize();
	}, false);

	avis.audio.addEventListener('MozAudioAvailable', function(event){
		var frameBuffer = event.frameBuffer;
		// Merging audi channels
		for (var i = 0, fbl = avis.frameBufferLength / 2; i < fbl; i++ ) {
			// Assuming interlaced stereo channels, need to split and merge into a stereo-mix mono signal
			avis.signal[i] = (frameBuffer[2*i] + frameBuffer[2*i+1]) / 2;
		}
		avis.fft.forward(avis.signal);

		for (var i = 0; i < avis.fft.spectrum.length; i++ ) {
			// multiply spectrum by a zoom value
			var magnitude = avis.fft.spectrum[i] * avis.zoomvalue;

			if(magnitude > avis.magnitude){
				if(window.zeit === undefined || new Date().getTime() - zeit.getTime() > avis.timer){
					avis.visualize();
				}
			}
		}
	}, false);
});
