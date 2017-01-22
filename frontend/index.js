$('#display').mousedown(function(){
  console.log('mouseDown');
});

$('#display').mouseup(function(){
  console.log("mouseUp");
});
var t=setInterval(function(){
  var canvas=document.getElementById("display");
  var ctx=canvas.getContext('2d');
  ctx.fillStyle='#222222';
  ctx.fillRect(0,0,canvas.width,canvas.height);
},16);
