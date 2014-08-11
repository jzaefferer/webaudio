window.avis = {
	magnitude: 140.0,
	timer: 300,
	asciiDancer: ["\\o/","\\\\o","o//","~o~","\\o~","~o/","\\/o","o\\/"],
	colors: ["rgb(255, 165, 0)","rgb(255, 255, 0)","rgb(0, 0, 255)","rgb(255, 0, 0)","rgb(255, 165, 0)"],
	time: new Date()
};

avis.visualize = function() {
	avis.time = new Date();
	var dancer = $("#asciidancer"),
		currentDance = dancer.html(),
		newDance = currentDance,
		body = $(document.body),
		currentColor = body.css("backgroundColor"),
		newColor = currentColor;

	while (newDance === currentDance) {
		currentDance = avis.asciiDancer[Math.floor((Math.random() * avis.asciiDancer.length))];
	}
	dancer.html(currentDance);

	while (newColor === currentColor) {
		currentColor = avis.colors[Math.floor((Math.random() * avis.colors.length))];
	}
	body.css("backgroundColor", currentColor);
};
