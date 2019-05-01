var colorMain = function(game){
	textsArray = [];
	metersArray = [];
	
	AMOUNT = 20;
	RADIUS = 600;
};

colorMain.prototype = {
    create: function(){ 	
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		balls = game.add.group();
		meters = game.add.group();
		
	    meters.enableBody = true;
		meters.physicsBodyType = Phaser.Physics.ARCADE;
		
		game.physics.enable(balls, Phaser.Physics.ARCADE);
		
		for (var i = 0; i < AMOUNT; i++ ) {
			meter = meters.create(0, 0, 'dino');
			meter.x = (WIDTH / 2) + Math.cos(i * (360 / AMOUNT)) * RADIUS;
			meter.y = (HEIGHT / 1.7) + Math.sin(i * (360 / AMOUNT)) * RADIUS;
			meter.scale.set(.7, .7);
			
			//meter.x = 200 + i * 130 / AMOUNT * 25;
			//meter.y = 1500;
			
			meter.anchor.set(0.50, 1);

			metersArray.push(meter);
		}

		setTimeout(function(){
			textPhysics = game.add.text(500, 1200, '', {font: '1px'});
			game.physics.arcade.enable(textPhysics);

			//capture();
			webaudio_tooling_obj();
		}, 500);
   },
   update: function(){
   	 /*if (game.physics.arcade.collide(meter, meters, collisionHandler, processHandler, this)){
        console.log('boom');
     }*/
   }
};

function capture(){
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
	var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
	var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
	
	var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
	var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';
	
	var recognition = new SpeechRecognition();
	var speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	recognition.continuous = true;
	recognition.lang = 'he';
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

  	recognition.start();

	recognition.onresult = function(event) {
	  	var textResult = event.results[event.results.length - 1][0].transcript;
	  	var time = event.timeStamp;
	  	var confidence = event.results[event.results.length - 1][0].confidence;
	  	var n_words = WordCount(textResult);

		
		
		textPhysics = game.add.text(500, 1200, chunk(textResult, 25).join('\n'), {font: '172px', fill: 'white'});
		textPhysics.x = WIDTH / 2 - textPhysics.width / 2;
		textPhysics.y = 0;
		
		textPhysics.bringToTop();

    	game.physics.arcade.enable(textPhysics);
	};
	
	recognition.onspeechend = function() {
		console.log('next');
	};
	
	recognition.onnomatch = function(event) {
	  	console.log("I didn't recognise that color");
	};
	
	recognition.onerror = function(event) {
	  	console.log(event.error);
	};
}

function WordCount(str) { 
	return str.split(" ").length;
}


function chunk(str, n) {
    var ret = [];
    var i;
    var len;

    for(i = 0, len = str.length; i < len; i += n) {
       ret.push(str.substr(i, n))
    }

    return ret
};

