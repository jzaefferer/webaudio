if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = (function() {
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
      window.setTimeout( callback, 1000 / 60 );
    };
  })();
}

(function() {
  var context = new webkitAudioContext();

  function loadSample(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
      if (context.decodeAudioData) {
        // Async decoding
        context.decodeAudioData(request.response, function(buffer) {
          if (callback) {
            callback(buffer);
          }
        });
      } else {
        if (callback) {
          callback(context.createBuffer(request.response, true));
        }
      }
    };
    request.send();
  }

  // need to wait for window.load, see http://crbug.com/112368
  $(window).load(function() {
    if (context.createMediaElementSource) {
      createNodes(context.createMediaElementSource(document.getElementById('asciidanceraudiocontrol')));
    } else {
      loadSample("../samples/Vidian_-_Making_Me_Nervous_cropped.mp3", function(arrayBuffer) {
        var source = context.createBufferSource();
          source.buffer = arrayBuffer;
          createNodes(source);
      });
    }
    // TODO stream the bigger file, once the Audio DOM interface has `audioSource`
    function createNodes(source) {
      var nodes = {};
      nodes.source = source;

      if (context.createBiquadFilter) {
        nodes.filter = context.createBiquadFilter();
        nodes.filter.type = 0; // 0 == LOWPASS
      }
      else {
        nodes.filter = context.createLowPass2Filter();
      }
      nodes.analyser = context.createAnalyser();
      nodes.analyser.fftSize = 2048;
      nodes.volume = context.createGainNode();
      // Set anaylyser channel to volume 0
      nodes.volume.gain.value = 0;
      nodes.source.connect(nodes.filter);
      nodes.filter.connect(nodes.analyser);
      nodes.analyser.connect(nodes.volume);
      nodes.volume.connect(context.destination);
      // Connect source directly to destination
      nodes.source.connect(context.destination);
      if (nodes.source.noteOn) {
        nodes.source.noteOn(0);
      }

      (function draw() {
        var freqByteData = new Float32Array(nodes.analyser.frequencyBinCount);
        nodes.analyser.getFloatFrequencyData(freqByteData);

        for (var i = 0; i < freqByteData.length; i++ ) {
          if (freqByteData[i] > -25) {
            if (new Date().getTime() - avis.time.getTime() > avis.timer) {
              avis.visualize();
            }
          }
        }
        requestAnimationFrame(draw);
      })();
    }
  });
})();
