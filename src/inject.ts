var alivename = null;
var deadname = null;
var loadingInterval = null;
var loaded = false;
var loadingIntervalFrequency = null;
var loadedIntervalFrequency = null;
var ignoreInputs = null;

chrome.runtime.sendMessage({}, function() {
	if (name === null || deadname === null) {
		loadNames();
	} else {
		changeContent();
	}

	if (!loaded && document.readyState === "complete") {
		loaded = true;
		clearInterval(loadingInterval);
		setInterval(changeContent, loadedIntervalFrequency);
	}
});

function loadNames() {
	chrome.storage.sync.get({
		name: {
			first: '',
			middle: '',
			last: ''
		},
		deadname: {
			first: '',
			middle: '',
			last: ''
		},
		loadingInterval: 50,
		loadedInterval: 1000
	}, function(items) {
		loadingIntervalFrequency = items.loadingInterval;
		loadedIntervalFrequency = items.loadedInterval;

		alivename = items.name;
		deadname = items.deadname;
		changeContent();
		loadingInterval = setInterval(changeContent, loadingIntervalFrequency);
	});
}

function changeContent() {
	if (alivename.first.length !== 0 && deadname.first.length !== 0 &&
		alivename.middle.length !== 0 && deadname.middle.length !== 0 &&
		alivename.last.length !== 0 && deadname.last.length !== 0) {
			const fullAlive = alivename.first + ' ' + alivename.middle + ' ' + alivename.last;
			const fullDead = deadname.first + ' ' + deadname.middle + ' ' + deadname.last;
			replaceName(fullDead, fullAlive);
	}

	if (alivename.first.length !== 0 && deadname.first.length !== 0) {
		replaceName(deadname.first, alivename.first);
	}

	if (alivename.last.length !== 0 && deadname.last.length !== 0) {
		replaceName(deadname.last, alivename.last);
	}
};

function replaceName(old: string, replacement: string) {
	const dead = new RegExp("\\b" + old + "\\b", "gi");
	document.title = document.title.replace(dead, replacement);

	var elements = document.body.getElementsByTagName("*");
	for (let i: number = 0; i < elements.length; i++) {
		let element = elements[i];
		let children = element.childNodes;
		for (let n = 0; n < children.length; n++) {
			let child = children[n];
			if (child.nodeType === 3) {
				const text = child.nodeValue;
				const newText = text.replace(dead, replacement);
				if (ignoreInputs && child.tagName == 'INPUT'){
					continue
				}
				
				if (newText !== text) {
					element.replaceChild(document.createTextNode(newText), child);
				}
			}
		}
	};
}
