var canvas, ctx;

var CONST = {
	NEAREST_NEIGHBOR_SCALING: false,
	PIXEL_SIZE: 1,
}

function spin_tween() {
	return (this.endVal - this.startVal) * (1.5 * this.percentage * (this.percentage - 0.3) / 1.05) + this.startVal;
}

function linear_tween() { return (this.endVal - this.startVal) * this.percentage + this.startVal; }
function cubic_tween() {
	return (this.endVal - this.startVal)
		* this.percentage * this.percentage * this.percentage + this.startVal;
}
function wave_tween() {
	return (this.endVal - this.startVal) * (Math.sin(this.percentage * 2 * Math.PI)) / 2.0 + this.startVal;
}

function linear_post_half() {
	var a = 0.5;
	return (this.percentage >= a ? (this.endVal - this.startVal) * (this.percentage - a) / (1 - a) + this.startVal : this.startVal);
}

function cos_fadeout_tween() {
	return (this.endVal - this.startVal) * (1 - Math.cos(this.percentage * Math.PI / 2)) + this.startVal;
}

function vec_linear_tween() {
	var dx = this.endVal.x - this.startVal.x;
	var dy = this.endVal.y - this.startVal.y;

	return {
		x: dx * this.percentage + this.startVal.x,
		y: dy * this.percentage + this.startVal.y
	}
}

// Use the tween functions above
function Tween(func, startVal, endVal, time) {
	this.parent = parent;
	this.func = func;
	this.val = startVal;
	this.startVal = startVal;
	this.endVal = endVal;
	this.time = time;
	this.started = false;
	this.curTime = 0;
	this.percentage = 0;
	this.reversed = false;

	this.finishedFunc = null;
}

Tween.prototype.isFinished = function() { return !!(this.curtime == this.time); }
Tween.prototype.isAtStart = function() { return !!(this.curtime == 0); }

Tween.prototype.reverse = function(func) { this.reversed = true; this._start(func); }
Tween.prototype.start = function(func) { this.reversed = false; this._start(func); }

Tween.prototype._start = function(func) {
	this.finishedFunc = func;
	this.started = true;
	this.val = (this.reversed ? this.endVal : this.startVal);
	this.curTime = (this.reversed ? this.time : 0);
}

Tween.prototype.tick = function(delta) {
	if (this.started) {
		this.curTime += (this.reversed ? -delta : delta);

		if ((this.reversed ? this.curTime <= 0 : this.curTime >= this.time)) {
			this.curTime = (this.reversed ? 0 : this.time);
			if (this.finishedFunc) this.finishedFunc();
			this.started = false;
		}

		this.percentage = (this.curTime / this.time);

		this.val = this.func();
	}
}

function onResize(event) {	
	var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
	
	if (CONST.NEAREST_NEIGHBOR_SCALING) {
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
	}
	
	ctx.scale(CONST.PIXEL_SIZE, CONST.PIXEL_SIZE);
}

function initCanvas() {
	canvas = document.getElementById('display');
	ctx = canvas.getContext('2d');
	
	onResize(null);

	window.addEventListener("resize", onResize);
}

var imagesToLoad = 0;

function Texture(path) {
	var self = this;
	this.w = 1;
	this.h = 1;
	this.image = new Image();
	this.image.ready = false;
	this.image.onload = function() {
		self.ready = true;
		self.w = self.image.naturalWidth;
		self.h = self.image.naturalHeight;
		imagesToLoad--;
	};
	imagesToLoad++;
	this.image.onerror = function() {
		console.log('Could not load image: ' + path);
		imagesToLoad--;
	}
	this.image.src = path;
}

var textures = {};

function loadImages() {
	textures['blink'] = new Texture('mascot-images/mascot-blink.png');
	textures['happy'] = new Texture('mascot-images/mascot-happy.png');
	textures['embarrassed'] = new Texture('mascot-images/mascot-embarrassed.png');
	textures['normal'] = new Texture('mascot-images/mascot-normal.png');

	// Wait until all the images load
	// while (imagesToLoad > 0);

	curFrame = textures.normal;
}


var queryGlowTween, idleTween, spinTween;
var catchRot;

function startQuery() {
	idle = false;
	waiting = true;

	glowFunc = function () { queryGlowTween = new Tween(wave_tween, 0.5, 1, 5); queryGlowTween.start(glowFunc); }
	spinFunc = function () { spinTween = new Tween(spin_tween, 0, 2 * Math.PI, 6); spinTween.start(spinFunc); }

	glowFunc();
	catchRot = new Tween(linear_tween, curRot, 0, 0.2);
	catchRot.start(function() { catchRot = null; spinFunc(); })
}

function endQuery() {
	waiting = false;
	catchRot = new Tween(linear_tween, curRot - 2 * Math.PI, idleTween.val, 0.7);
	catchRot.start(function () {
		catchRot = null;
		idle = true;
		glowOpacity = 1;
	});
}

function startDictation() {
	var index = ~~(Math.random() * 2);
	var arr = [textures.happy, textures.embarrassed];
	curFrame = arr[index];
}

function endDictation() {
	curFrame = textures.normal;
}


var curFrame, idle = true, curRot = 0, speaking = false, waiting = false;
var openTime = Math.random() * 2000 + 2000, closedTime = 0;
var glowOpacity = 1;

var lastTime;


function runComp(avs) {

	loadImages();
	initCanvas();

	lastTime = Date.now();

	var recording = false;

	canvas.addEventListener('mousedown', function() {
		if (!recording && idle) {
			recording = true;
			avs.startRecording();
		}
	});

	canvas.addEventListener('mouseup', function() {
		if (recording && idle) {
			recording = false;
			avs.stopRecording();
		}
	});

	document.body.addEventListener('keydown', function(evt) {
		if (evt.keyCode == 32) {
			if (!recording && idle) {
				recording = true;
				avs.startRecording();
			}
		}
	});

	document.body.addEventListener('keyup', function(evt) {
		if (evt.keyCode == 32) {
			if (recording && idle) {
				recording = false;
				avs.stopRecording();
			}
		}
	});

	var startRecurse;
	startRecurse = function() { idleTween = new Tween(wave_tween, 0, Math.PI / 6, 6); idleTween.start(startRecurse); };

	startRecurse();


	setInterval(function() {
		var now = Date.now();
		var deltaMS = now - lastTime;

		if (deltaMS > 100) deltaMS = 100;

		lastTime = now;

		var delta = deltaMS / 1000.0;

	  ctx.fillStyle = '#222';
	  ctx.fillRect(0, 0, canvas.width, canvas.height);


	  if (recording || waiting) {
		  ctx.save();
		  ctx.shadowBlur = 75;
		  ctx.shadowOffsetX = 2 * canvas.width;
		  ctx.shadowColor = '#8FF';
		  ctx.strokeStyle = 'rgba(0,0,0,' + (glowOpacity * 0.7) + ')';
		  ctx.lineWidth = 50;
		  ctx.strokeRect(-2*canvas.width, 0, canvas.width, canvas.height);
		  ctx.restore();
		}

		ctx.save();
		ctx.shadowBlur = 100;
		ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(curRot);
		ctx.drawImage(curFrame.image, - curFrame.w, - curFrame.h, 2*curFrame.w, 2*curFrame.h);
		ctx.restore();

		if (idle) {
			if (curFrame == textures.blink || curFrame == textures.normal) {
				if (openTime > 0) {
					openTime -= deltaMS;
					curFrame = textures.normal;

					if (openTime <= 0)
						closedTime = Math.random() * 100 + 75;	
				} else {
					closedTime -= deltaMS;
					curFrame = textures.blink;

					if (closedTime <= 0) {
						var rand = Math.random();
						openTime = (1 - rand * rand) * 2000 + 2000;
					}
				}
			}

			idleTween.tick(delta);
			curRot = idleTween.val;
		}

		if (catchRot) {
			curRot = catchRot.val;
			catchRot.tick(delta);
		}

		if (waiting) {
			queryGlowTween.tick(delta);
	
			if (!catchRot) {
				curRot = spinTween.val;
				spinTween.tick(delta);
			}
			glowOpacity = queryGlowTween.val;
		}

	}, 16);
}