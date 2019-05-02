var colorMain = function(game){
	AMOUNT = 20;
	
	metersArray = [];
	score = 0;
};

colorMain.prototype = {
    create: function(){ 		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		balls = game.add.group();
		meters = game.add.group();
		
	    balls.enableBody = true;
		balls.physicsBodyType = Phaser.Physics.ARCADE;
	   
	    meters.enableBody = true;
		meters.physicsBodyType = Phaser.Physics.ARCADE;
		
		biteSfx = game.add.audio('bite', 1);
		
		scoreText = game.add.text(20, 20, 'Score: ' + score, {font: '128px', fill: 'yellow', align:'center', fontWeight:'bold'});		
		plusText = game.add.text(20, 20, '', {font: '128px', fill: 'white', align:'center', fontWeight:'bold'});		

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
   },
   update: function(){
       game.physics.arcade.collide(meters, balls, collisionHandler, null, this);
       
       meters.forEach(function(_meter) {	
   	       balls.forEach(function(_ball) {
		       if (checkOverlap(_meter, _ball) && _ball.alive){
		        	collisionHandler(_meter, _ball);
			   }
	       });
	   });
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

    sprite.body.gravity.y = grvY;
    sprite.body.velocity.y = velY;
    
    setTimeout(function(){
    	createFruits();
    }, 2000);
}

function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function initPlugIns(){
    try{window.plugins.insomnia.keepAwake();} catch(e){} // keep device awake
    try{StatusBar.hide();} catch(e){} // hide status bar
    try{window.androidVolume.setMusic(100, false);} catch(e){} // change device media volume to maximum
}