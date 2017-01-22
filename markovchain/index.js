var list = null;
var wordNum = 3;

var sentenceEnders = ['.', '?', '!'];

function output(text) {
	var out = document.getElementById('out');
	out.innerHTML = text;
}

function loadMarkov() {
	jQuery.get('data.txt?1', function(data) {
		list = data.split(/\n/);
		run();
	});
}

function getSentenceEnder(word) {
	for (var i = 0; i < sentenceEnders.length; i++)
		if (word.includes(sentenceEnders[i]))
			return sentenceEnders[i];
	return null;
}

function trimPunctuation(word) {
	return word.replace(/^\W+|\W+$/gm,'');
}

function genChain(sentenceList) {
	var splitSentences = [];

	for (var i = 0; i < sentenceList.length; i++) {
		var splitList = sentenceList[i].split(' ');

		var sentence = [];

		for (var j = 0; j < splitList.length; j++) {
			var sentenceEnder = getSentenceEnder(splitList[j]);
			var filteredWord = trimPunctuation(splitList[j]).toLowerCase();
			if (filteredWord)
				sentence.push(filteredWord);
			if (sentenceEnder) {
				if (sentence.length != 0) {
					sentence.push(sentenceEnder)
					splitSentences.push(sentence);
					sentence = [];
				}
			}
		}
	}

	var markov = {};

	for (var i = 0; i < splitSentences.length; i++) {
		if (splitSentences[i].length > 0) {
			var lastString = [];
			for (var k = 0; k < wordNum; k++)
				lastString.push('@');

			for (var j = 0; j < splitSentences[i].length; j++) {
				var newString = lastString.slice(1, lastString.length);
				newString.push(splitSentences[i][j]);
				if (!markov[lastString]) markov[lastString] = {'total': 0};
				if (!markov[lastString][newString]) markov[lastString][newString] = 0;
				markov[lastString][newString] += 1;
				markov[lastString]['total'] += 1;

				lastString = newString;
			}
		}
	}

	return markov;
}

function isSentenceEnder(str) {
	for (var i = 0; i < sentenceEnders.length; i++)
		if (str == sentenceEnders[i])
			return true;
	return false;
}

function genSentence(markov) {
	var lastString = [];
	for (var k = 0; k < wordNum; k++)
		lastString.push('@');

	var sentence = '';
	var isEnd = false;

	while (!isEnd) {

		if (!markov[lastString]) break;

		var rand = Math.random() * markov[lastString]['total'];
		for (var testString in markov[lastString])
			if (testString != 'total') {
				if (rand <= markov[lastString][testString]) {
					lastString = testString.split(',');
					break;
				} else rand -= markov[lastString][testString];
			}

		isEnd = isSentenceEnder(lastString[lastString.length - 1])
		if (sentence && !isEnd)
			sentence += ' ';
		sentence += lastString[lastString.length - 1];
	}

	return sentence;
}


function run() {
	if (!list) loadMarkov();
	else {
		var m = genChain(list);
		console.log(genSentence(m));
	}
}