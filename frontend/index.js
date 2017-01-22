


var audio_context;
var recorder;


window.onload = function init() {
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;
      
      audio_context = new AudioContext;
      __log('Audio context set up.');
      __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      alert('No web audio support in this browser!');
    }
    
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
      __log('No live audio input: ' + e);
    });
};

var input = audio_context.createMediaStreamSource(stream);
recorder = new Recorder(input);

$('#display').mousedown(function(){
  recorder && recorder.record();
});

$('#display').mouseup(function(){
  recorder && recorder.stop();
});


var wavesurfer = Object.create(WaveSurfer);


var t=setInterval(function(){
  var canvas=document.getElementById("display");
  var ctx=canvas.getContext('2d');
  ctx.fillStyle='#222222';
  ctx.fillRect(0,0,canvas.width,canvas.height);
},16);

recording = recorder.exportWAV()

