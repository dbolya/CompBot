var list = null;


function output(text) {
	var out = document.getElementById('out');
	out.innerHTML = text;
}

function loadMarkov() {
	jQuery.get('data.txt', function(data) {
		list = data.split(/\n/);
		run();
	});
}

function genChain(wordList) {
	
}


function run() {
	if (!list) loadMarkov();
	else {
		var m = genChain(list);
	}
}