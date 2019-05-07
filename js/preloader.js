var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
		game.load.audio("bite", "assets/audio/celery.ogg");
		game.load.spritesheet("fruit", "assets/images/fruit.png", 512/8, 320/5);
		game.load.spritesheet("girrafe", "assets/images/girrafe.png");
		game.load.image("bg", "assets/images/bg.png");
    },
    
    create: function(){
        this.game.state.start("Color"); 
    }
};