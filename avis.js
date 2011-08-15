window.avis = {
	magnitude: 650.0,
	timer: 400,
	asciiDancer: ["\\o/","\\\\o","o//","~o~","\\o~","~o/","\\/o","o\\/"],
	colors: ["rgb(255, 165, 0)","rgb(255, 255, 0)","rgb(0, 0, 255)","rgb(255, 0, 0)","rgb(255, 165, 0)"],
	time: new Date()
};


avis.initialize = function(){
};

avis.visualize = function(){
	avis.time = new Date();
	currentDance = avis.asciiDancer[Math.floor((Math.random()*avis.asciiDancer.length))];
	currentColor = avis.colors[Math.floor((Math.random()*avis.colors.length))];
	while($("#asciidancer").html() == currentDance){
		currentDance = avis.asciiDancer[Math.floor((Math.random()*avis.asciiDancer.length))];
	}
	while($("body").css("backgroundColor") == currentColor){
		currentColor = avis.colors[Math.floor((Math.random()*avis.colors.length))];
	}
	$("#asciidancer").html(currentDance);
	$("body").css("backgroundColor",currentColor);
};
