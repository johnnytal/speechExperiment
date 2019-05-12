var colorMain = function(game){
	AMOUNT = 20;
	TIME = 60;
	
	metersArray = [];
	score = 0;	
	bestScore = 0;
	gameEnded = false;
};

colorMain.prototype = {
    create: function(){ 
		metersArray = [];
		score = 0;	
		gameEnded = false;
		
		try{
			cordova.plugins.permissions.requestPermission(permission.RECORD_AUDIO, success, error);
		}catch(e){error();}
		
		bg = game.add.image(0, 0, 'bg');
		bg.alpha = 0.4;
			
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		balls = game.add.group();
		meters = game.add.group();
		
	    balls.enableBody = true;
		balls.physicsBodyType = Phaser.Physics.ARCADE;
	   
	    meters.enableBody = true;
		meters.physicsBodyType = Phaser.Physics.ARCADE;
		
		biteSfx = game.add.audio('bite', 1);
		
		scoreText = game.add.text(40, 20, 'Score: ' + score, {font: '128px', fill: 'yellow', align:'center', fontWeight:'bold'});		
		plusText = game.add.text(20, 20, '', {font: '128px', fill: 'white', align:'center', fontWeight:'bold'});		
		
		timeLabel = game.add.text(20, 20, 'Time: ' + TIME, {font: '128px', fill: 'white', align:'center', fontWeight:'bold'});		
		timeLabel.x = WIDTH - 40 - timeLabel.width;
		
        bestScore = localStorage.getItem("analyzer-bestScore");
        if (bestScore == null) bestScore = 0;
        
        bestScoreLebal = this.add.text(scoreText.x, scoreText.y + scoreText.height + 20, 'Best Score: ' + bestScore, {
            font: '64px', fill: 'lightgreen', fontWeight: 'normal', align: 'center',
            stroke:'lightgrey', strokeThickness: 2
        });
			
		for (var i = 0; i < AMOUNT; i++ ) {
			meter = meters.create(0, 1750, 'girrafe');

			meter.x = meter.width / 8 + i * meter.width / 2;
			
			meter.body.immovable = true;
			meter.anchor.set(0.50, 1);

			metersArray.push(meter);
		}

		setTimeout(function(){
			webaudio_tooling_obj();
			createFruits();
			initPlugIns();
		}, 500);	
		
		timerStuff();
   },
   update: function(){
	   	if (!gameEnded){
	       game.physics.arcade.collide(meters, balls, collisionHandler, null, this);
	       
	       meters.forEach(function(_meter) {	
	   	       balls.forEach(function(_ball) {
			       if (checkOverlap(_meter, _ball) && _ball.alive){
			        	collisionHandler(_meter, _ball);
				   }
		       });
		   });
	   }
	   else{
	   	 if (game.input.activePointer.isDown){
	   	 	game.state.start("Preloader"); 
	   	 	
	   	 	if(AdMob) AdMob.showInterstitial();
	   	 }
	   }
   }
};

function collisionHandler(_meter, _ball){
	scoreToAdd = Math.round(50 * _ball.scale.x);
	
	score += scoreToAdd;
	scoreText.text = 'Score: ' + score;
	
	plusText.alpha = 1;
	plusText.x = _ball.x;
	plusText.y = _ball.y - 20;
	plusText.text = scoreToAdd;
	
	game.add.tween(plusText).to( { alpha: 0}, 1500, "Linear", true);
	
	_ball.kill();
	biteSfx.play();
}

function createFruits(){
	if (!gameEnded){
		drawX = game.rnd.integerInRange(0, 3200);
		drawY = game.rnd.integerInRange(0, 50);
		
		velY = game.rnd.integerInRange(40, 120);
		grvY = game.rnd.integerInRange(40, 120);
		
		frame = game.rnd.integerInRange(0, 25);
	
	    sprite = balls.create(drawX, drawY, 'fruit');
	    sprite.frame = frame;
	
	    sprite.scale.set(5, 5);
	    sprite.anchor.set(.5, .5);
	    
	    game.add.tween(sprite.scale).to( { x: 0, y: 0}, 5250, "Linear", true);
	    if (sprite.scale.x < 0.1){
	    	sprite.destroy();
	    }
	
	    sprite.body.gravity.y = grvY;
	    sprite.body.velocity.y = velY;
	    
	    setTimeout(function(){
			createFruits();
	    }, 2000);
    }
}

function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function initPlugIns(){
    try{window.plugins.insomnia.keepAwake();} catch(e){} // keep device awake
    try{StatusBar.hide();} catch(e){} // hide status bar
    
    try{
	    admobid = {
	        interstitial: 'ca-app-pub-9795366520625065/7944209795',
	    };
	  	
	  	if(AdMob) AdMob.prepareInterstitial({
	  		adId: admobid.interstitial, 
	  		autoShow: false
	  	}); 
  	}catch(e){}
}

function timerStuff(){
	startTime = new Date();
	totalTime = TIME;
	timeElapsed = 0;

	gameTimer = game.time.events.loop(100, function(){
		if (!gameEnded){
			updateTimer();
		}
	});
}

function updateTimer(){
    var currentTime = new Date();
    var timeDifference = startTime.getTime() - currentTime.getTime();

    timeElapsed = Math.abs(timeDifference / 1000);
    var timeRemaining = totalTime - timeElapsed; 

	if (timeRemaining > 0){
	    var minutes = Math.floor(timeRemaining / 60);
	    var seconds = Math.floor(timeRemaining) - (60 * minutes);

	    var result = (minutes < 10) ? "0" + minutes : minutes; 
	    result += (seconds < 10) ? ":0" + seconds : ":" + seconds; 
	
	    timeLabel.text = result;
    } 
    
    else{
    	endGame();
    }
}

function endGame(){
	endLabel = game.add.text(0, 0, 'Game Over!\nYour score: ' + score + '\n\nTap anywhere\nto try again', {font: '256px', fill: 'lightblue', align:'center', fontWeight:'bold'});		
	
    if (score > bestScore){
        localStorage.setItem("analyzer-bestScore", score);
    }
	
	endLabel.x = WIDTH / 2 - endLabel.width / 2;
    endLabel.y =  HEIGHT / 2 - endLabel.height / 2;
    
    gameEnded = true;
}


function error() {
  alert('Mic permission is not turned on');
}

function success( status ) {

}
