var colorMain = function(game){
	synth = null;
	utterThis = null;
};

colorMain.prototype = {
    create: function(){
		synth = window.speechSynthesis;

		inputForm = document.querySelector('form');
		inputTxt = document.querySelector('.txt');
		voiceSelect = document.querySelector('select');
		
		pitch = document.querySelector('#pitch');
		pitchValue = document.querySelector('.pitch-value');
		rate = document.querySelector('#rate');
		rateValue = document.querySelector('.rate-value');
		
		voices = [];
		
		populateVoiceList();
		
		inputForm.onsubmit = function(event) {
		  	event.preventDefault();
		
		  	utterThis = new SpeechSynthesisUtterance(inputTxt.value);
		  	var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
			for(i = 0; i < voices.length ; i++) {
			  	if(voices[i].name === selectedOption) {
			  		utterThis.voice = voices[i];
			  	}
			};
			
		  	utterThis.pitch = pitch.value;
		  	utterThis.rate = rate.value;
		  	synth.speak(utterThis);
		  
			utterThis.onpause = function(event) {
			    var char = event.utterance.text.charAt(event.charIndex);
			    console.log('Speech paused at character ' + event.charIndex + ' of "' +
			    event.utterance.text + '", which is "' + char + '".');
			};
		  
			inputTxt.blur();
		};

		pitch.onchange = function() {
			pitchValue.textContent = pitch.value;
			utterThis.pitch = pitch.value;
		};
		
		rate.onchange = function() {
			rateValue.textContent = rate.value;
			utterThis.rate = rate.value;
		};

		if (speechSynthesis.onvoiceschanged !== undefined) {
			speechSynthesis.onvoiceschanged = populateVoiceList;
		}
    },
    update: function(){
    	
    }
};

function populateVoiceList() {
	voices = synth.getVoices();

  	for(i = 0; i < voices.length ; i++) {
    	var option = document.createElement('option');
    	option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    	if(voices[i].default) {
      		option.textContent += ' -- DEFAULT';
    	}

    	option.setAttribute('data-lang', voices[i].lang);
    	option.setAttribute('data-name', voices[i].name);
    	voiceSelect.appendChild(option);
  	}
}
