var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
		game.load.image("logo", "assets/images/logo3.png");
		game.load.spritesheet("fruit", "assets/images/fruit.png", 512 / 8, 320 / 5);
		game.load.spritesheet("dino", "assets/images/dino.png", 3464 / 4, 2001 / 3);
    },
    
    create: function(){
        this.game.state.start("Color"); 
    }
};