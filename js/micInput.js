function webaudio_tooling_obj () {
    var audioContext = new AudioContext();
    
	timeRadius = 0;
	oldDrawX = 0;
	oldDrawY = 0;
	input = null;
	radius = 0;
	sprite = null;
	oldTime = 0;
	oldNote = 0;

	name_to_color = {
		'A' : 0x2FCD30,
		'A#' : 0x8D8B8D,
		'B' : 0x0000FE,
		'C' : 0xff0000,
		'C#' : 0xcf9bff,
		'D' : 0xffff00,
		'D#' : 0x65659A,
		'E' : 0xE4FBFF,
		'F' : 0xAE1600,
		'F#' : 0x00CDFF,
		'G' : 0xFF6500,
		'G#' : 0xFF00FF
	};
	
	notes = [ 
	    'C0','C#0','D0','D#0','E0','F0','F#0','G0','G#0','A0','A#0','B0', 'C1','C#1','D1','D#1','E1','F1','F#1','G1','G#1','A1','A#1','B1',
	    'C2','C#2','D2','D#2','E2','F2','F#2','G2','G#2','A2','A#2','B2', 'C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3',
	    'C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4', 'C5','C#5','D5','D#5','E5','F5','F#5','G5','G#5','A5','A#5','B5',
	    'C6','C#6','D6','D#6','E6','F6','F#6','G6','G#6','A6','A#6','B6', 'C7','C#7','D7','D#7','E7','F7','F#7','G7','G#7','A7','A#7','B7',
	    'C8','C#8','D8','D#8','E8','F8','F#8','G8','G#8','A8','A#8','B8', 'C9','C#9','D9','D#9','E9','F9','F#9','G9','G#9','A9','A#9','B9',
	    'C10','C#10','D10','D#10','E10','F10','F#10','G10','G#10','A10','A#10','B10'
	];

    var BUFF_SIZE = 16384;
    
    largestValue = 0;
    largestFreq = 0;
    averageValue = 0;

    /*WebMidi.enable(function (err){}); 

    setTimeout(function(){
    	
    	
    	input = WebMidi.getInputByName('Scarlett 6i6 USB');
		output = WebMidi.getOutputByName('Scarlett 6i6 USB');
		
		handleMidi();
	}, 1000);*/

    var colors = [
		'#ff0000', '#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#bfff00', '#80ff00', '#40ff00', '#00ff00', '#00ff40',
		'#00ff80', '#00ffbf', '#00ffff', '#00bfff', '#0080ff', '#0040ff', '#0000ff', '#4000ff', '#800ff0', '#bf00ff',
		'#ff00ff', '#ff00bf', '#ff0080', '#ff0040', '#ff0000'
	];

    var audioInput = null,
        microphone_stream = null,
        gain_node = null,
        script_processor_node = null,
        script_processor_fft_node = null,
        analyserNode = null;

    if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia){
        navigator.getUserMedia({audio:true}, 
          function(stream) {
              start_microphone(stream);
          },
          function(e) {
            alert('Error capturing audio.');
          }
        );

    } else { alert('getUserMedia not supported in this browser.'); }

     function start_microphone(stream){  	 

	      gain_node = audioContext.createGain();
	      gain_node.connect( audioContext.destination );
	
	      microphone_stream = audioContext.createMediaStreamSource(stream);
	      microphone_stream.connect(gain_node); 
	
	      script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);

	      microphone_stream.connect(script_processor_node);
	
	      gain_node.gain.value = 1;
	
	      script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
	      script_processor_fft_node.connect(gain_node);
	
	      analyserNode = audioContext.createAnalyser();
	
	      analyserNode.smoothingTimeConstant = 0;
	      analyserNode.fftSize = 2048;
	
	      microphone_stream.connect(analyserNode);
	
	      analyserNode.connect(script_processor_fft_node);
	
	      script_processor_fft_node.onaudioprocess = function() {
	      	 var array = new Uint8Array(analyserNode.frequencyBinCount);
	      	 analyserNode.getByteFrequencyData(array);

             for (var i = 0; i < AMOUNT; i++) {
            	 averageValue += array[i];
             }
             averageValue = averageValue / AMOUNT;
             
             largestValue = Math.max.apply(null, array);
            
             largestFreq = array.indexOf(largestValue);

			 dominance = largestValue / averageValue;

             var value = array[i];

             value = value < 1 ? 1 : value;
             
             for (var i = 0; i < AMOUNT; i++) {
             	 var meter = metersArray[i];
             	 
             	 if (i != largestFreq){
             	 	game.add.tween(meter.scale).to( { x: .7, y: .7}, 1000, "Linear", true);
             	 	game.add.tween(meter).to( { alpha: 0.3}, 1000, "Linear", true);
             	 	if (meter.frame != 0) meter.frame--;
             	 }  
            	 
            	 else{
	 				 try{
					 	meter.tint = value * (largestFreq + 1) * -100;
		 	      		game.add.tween(meter).to( { alpha: 1}, 50, "Linear", true);
		      		 	game.add.tween(meter.scale).to( { x: Math.pow(value, 0.2), y: Math.pow(value, 0.2)}, 200, "Linear", true);
		      		 	meter.frame++;
		      		 	if (meter.frame == 11) frame = 0;
		      		 } catch(e){}
            	 }
             };

      	 	 red = Math.round(255 - dominance * 20);
      	 	 if (red > 254) red = 254;
      	 	 else if (red < 1) red = 1;

      	 	 green = Math.round(largestValue / dominance);
      	 	 if (green > 200) green = 200;
      	 	 else if (green < 1) green = 1;

      	 	 blue = Math.round(averageValue * dominance);
      	 	 if (blue > 200) blue = 200;
	  	 	 else if (blue < 1) blue = 1;

      	 	 game.stage.backgroundColor = 'rgb(' + 0 + ', ' + 40 + ',' + blue + ')';

			 textPhysics.body.gravity.setTo(0, averageValue * 2);
			 game.add.tween(textPhysics).to( { alpha: 0 }, 25000, "Linear", true);
         };
     }
}

function handleMidi(){
    input.addListener('noteon', "all",
        function(e) {
	        note_n = e.note.number;
	        note_o = e.note.octave + 3;
	        
	        note_name = e.note.name;
	        note_velocity = e.velocity;
	        timeOn = e.timestamp / 150;
	        
            drawX = note_n * 3 * note_o;
            drawY = Math.pow(note_velocity * 340, 1.35);
            color = name_to_color[note_name];
            timeRadius = timeOn - oldTime;
            alpha = Math.abs(oldDrawX - drawX) / 3;

	        sprite = balls.create(drawX, drawY, 'fruit');
	        sprite.frame = note_n % 37;
			sprite.tint = color;
		    sprite.anchor.set(0.5);
		    sprite.alpha = alpha;

		    sprite.scale.set(timeRadius, timeRadius);
		    
		   
		    //sprite.body.collideWorldBounds = true;

		    sprite.body.gravity.y = 10 * (note_velocity * 3);

			oldTime = timeOn;
			oldNote = note_n;
			oldDrawX = drawX;
	    }     
    );
}