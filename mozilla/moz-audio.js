$(function() {
	var context = new (window.AudioContext || window.webkitAudioContext)();
	var isPlaying = false;
	
	var audiojQElement = $("#asciidanceraudiocontrol");
	var audioElement = audiojQElement[0];
	audioElement.addEventListener("canplay", function() {
		var analyser = context.createAnalyser();
		var source = context.createMediaElementSource(audioElement);
		avis.signal = new Float32Array(analyser.frequencyBinCount / context.destination.channelCount);
		var fft = new FFT(analyser.frequencyBinCount / context.destination.channelCount, context.sampleRate);
		var jsProcessor = context.createScriptProcessor(analyser.frequencyBinCount);
		
		jsProcessor.onaudioprocess = function(e){
			if(isPlaying){			
				var array =  new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				
				// Merging audi channels
				for (var i = 0, fbl = analyser.frequencyBinCount / 2; i < fbl; i++ ) {
					// Assuming interlaced stereo channels, need to split and merge into a stereo-mix mono signal
					avis.signal[i] = (array[2*i] + array[2*i+1]) / 2;
				}
				fft.forward(avis.signal);
		
				for (var i = 0; i < fft.spectrum.length; i++ ) {
					// multiply spectrum by a zoom value
					var magnitude = fft.spectrum[i];
		
					if (magnitude > avis.magnitude && new Date().getTime() - avis.time.getTime() > avis.timer) {
						console.log(magnitude);
						avis.visualize();
					}
				}
			}
		};
		
		
		jsProcessor.connect(context.destination);
		source.connect(analyser);
		analyser.connect(jsProcessor);
		source.connect(context.destination);
	});
	
	audiojQElement.bind("click",function(){
		isPlaying=!isPlaying;
	});
});
