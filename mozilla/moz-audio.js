$().ready(function() {
	var fft, frameBufferLength;
	$("#asciidanceraudiocontrol")
	.bind('loadedmetadata', function() {
		frameBufferLength = this.mozFrameBufferLength;
		avis.signal = new Float32Array(frameBufferLength / this.mozChannels),
		fft = new FFT(frameBufferLength / this.mozChannels, this.mozSampleRate);
		avis.initialize();
	})
	.bind('MozAudioAvailable', function(event){
		var frameBuffer = event.originalEvent.frameBuffer;
		// Merging audi channels
		for (var i = 0, fbl = frameBufferLength / 2; i < fbl; i++ ) {
			// Assuming interlaced stereo channels, need to split and merge into a stereo-mix mono signal
			avis.signal[i] = (frameBuffer[2*i] + frameBuffer[2*i+1]) / 2;
		}
		fft.forward(avis.signal);

		for (var i = 0; i < fft.spectrum.length; i++ ) {
			// multiply spectrum by a zoom value
			var magnitude = fft.spectrum[i];

			if (magnitude > avis.magnitude / 4000 && new Date().getTime() - avis.time.getTime() > avis.timer) {
				avis.visualize();
			}
		}
	});
});
