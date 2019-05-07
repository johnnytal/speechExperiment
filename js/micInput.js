function webaudio_tooling_obj () {
    var audioContext = new AudioContext();

	sprite = null;

    var BUFF_SIZE = 16384;
    
    largestValue = 0;
    largestFreq = 0;
    averageValue = 0;

     var microphone_stream = null,
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
            alert(e);
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
	
	      gain_node.gain.value = 0;
	
	      script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
	      script_processor_fft_node.connect(gain_node);
	
	      analyserNode = audioContext.createAnalyser();
	
	      analyserNode.smoothingTimeConstant = 0;
	      analyserNode.fftSize = 2048;
	
	      microphone_stream.connect(analyserNode);
	
	      analyserNode.connect(script_processor_fft_node);
	
	      script_processor_fft_node.onaudioprocess = function() {
	         if (!gameEnded){
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
	             	 
	             	 if (i != largestFreq - 3){
	             	 	game.add.tween(meter.scale).to( { x: .7, y: .7}, 1000, "Linear", true);
	             	 	game.add.tween(meter).to( { alpha: 0.1}, 800, "Linear", true);
	             	 }  
	            	 
	            	 else{
		 				 try{
						 	meter.tint = value * -150;
			 	      		game.add.tween(meter).to( { alpha: 1}, 50, "Linear", true);
			      		 	game.add.tween(meter.scale).to( { x: 1, y: Math.pow(value, 0.25)}, 300, "Linear", true);
			      		 } catch(e){}
	            	 }
	             };
	
	      	 	 blue = Math.round(averageValue * dominance);
	      	 	 if (blue > 200) blue = 215;
		  	 	 else if (blue < 0) blue = 0;
	
	      	 	 game.stage.backgroundColor = 'rgba(' + 10 + ', ' + 60 + ',' + blue + ',' + 0.9 + ')';
      	 	 }
         };
     }
}