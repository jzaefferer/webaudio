if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
        	window.setTimeout( callback, 1000 / 60 );
        };
    })();
}

function loadSample(url, callback) {
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function() {
		callback(request.response);
	}
	request.send();
}

function draw() {
	var freqByteData = new Float32Array(analyser.frequencyBinCount);
	analyser.getFloatFrequencyData(freqByteData);
	for (var i = 0; i < freqByteData.length; i++ ) {
		if (freqByteData[i] > -25) {
			if (new Date().getTime() - avis.time.getTime() > avis.timer) {
				avis.visualize();
			}
		}
	}
	requestAnimationFrame(draw);
}


$().ready(function() {
	context = new webkitAudioContext();
	var source = context.createBufferSource();

	var lowpass = context.createLowPass2Filter();
	source.connect(lowpass);

	analyser = context.createAnalyser();
	analyser.fftSize = 2048;
	lowpass.connect(analyser);

	// TODO we really want to connect just the source to output it unfiltered
	// for some reason the analyzer doesn't get any data when not connected to the destination
	analyser.connect(context.destination);

	// TODO stream the bigger file, once supported
	loadSample("../samples/Vidian_-_Making_Me_Nervous_cropped.mp3",function(arrayBuffer){
		source.buffer = context.createBuffer(arrayBuffer, false);
		//source.looping = true;
		source.noteOn(0);

		draw();
	});
});
