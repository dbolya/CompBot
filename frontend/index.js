


var audio_context;
var recorder;

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    console.log('Media stream created.');
    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');
    
    recorder = new Recorder(input);
    console.log('Recorder initialised.');
}

window.onload = function init() {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      window.URL = window.URL || window.webkitURL;
      
      audio_context = new AudioContext;
      console.log('Audio context set up.');
      console.log('navigator.getUserMedia ' + (navigator.mediaDevices.getUserMedia ? 'available.' : 'not present!'));
    
    navigator.mediaDevices.getUserMedia({audio: true}).then(startUserMedia).catch(function(e) {
      __log('No live audio input: ' + e);
    });
};

function finishRecording(blob) {
      var url = URL.createObjectURL(blob);
      var li = document.createElement('li');
      var au = document.createElement('audio');
      var hf = document.createElement('a');
      
      au.controls = true;
      au.src = url;
      hf.href = url;
      hf.download = new Date().toISOString() + '.wav';
      hf.innerHTML = hf.download;
      li.appendChild(au);
      li.appendChild(hf);
      document.body.appendChild(li);
}

$('#bigdiv').css("position","fixed");

$('#display').mousedown(function(){
	$('#bigdiv').css("box-shadow", "inset 0 0 30px #8ff");
	
	recorder && recorder.record();
	
});

$('#display').mouseup(function(){
	$('#bigdiv').css("box-shadow", "inset 0 0 30px #fff");
	
	recorder && recorder.stop();
	recorder.exportWAV(finishRecording);
});


var wavesurfer = Object.create(WaveSurfer);


var t=setInterval(function(){
  var canvas=document.getElementById("display");
  var ctx=canvas.getContext('2d');
  ctx.fillStyle='#222';
  ctx.fillRect(0,0,canvas.width,canvas.height);
},16);


