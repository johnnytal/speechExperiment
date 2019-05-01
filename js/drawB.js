//window.onload = start;

var radius = 0;
var input;
var oldDrawX, oldDrawY, oldTime;
var ctx;
var timeRadius;
var name_to_color = {
	'A' : '#2FCD30',
	'A#' : '#8D8B8D',
	'B' : '#0000FE',
	'C' : '#ff0000',
	'C#' : '#cf9bff',
	'D' : '#ffff00',
	'D#' : '#65659A',
	'E' : '#E4FBFF',
	'F' : '#AE1600',
	'F#' : '#00CDFF',
	'G' : '#FF6500',
	'G#' : '#FF00FF'
};

var notes = [ 
    'C0','C#0','D0','D#0','E0','F0','F#0','G0','G#0','A0','A#0','B0', 'C1','C#1','D1','D#1','E1','F1','F#1','G1','G#1','A1','A#1','B1',
    'C2','C#2','D2','D#2','E2','F2','F#2','G2','G#2','A2','A#2','B2', 'C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3',
    'C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4', 'C5','C#5','D5','D#5','E5','F5','F#5','G5','G#5','A5','A#5','B5',
    'C6','C#6','D6','D#6','E6','F6','F#6','G6','G#6','A6','A#6','B6', 'C7','C#7','D7','D#7','E7','F7','F#7','G7','G#7','A7','A#7','B7',
    'C8','C#8','D8','D#8','E8','F8','F#8','G8','G#8','A8','A#8','B8', 'C9','C#9','D9','D#9','E9','F9','F#9','G9','G#9','A9','A#9','B9',
    'C10','C#10','D10','D#10','E10','F10','F#10','G10','G#10','A10','A#10','B10'
];


var caps = ["butt", "round", "square"];

function start(){
	Sketch.create({
	    container: document.getElementById( 'container' ),
	    autoclear: false,
	    retina: 'auto',
	
	    setup: function() {
		    ctx = this;
	    }
	});
}

function handleMidi(note_n, note_o, note_name, note_velocity, timeOn){
	document.getElementById('container').textContent += note_n;

/*
    note_n = e.note.number;
    note_o = e.note.octave + 3;
    note_name = e.note.name;
    note_velocity = e.velocity;
    timeOn = e.timestamp / 150;
    
    drawY = note_n * note_o + 50;
    color = name_to_color[note_name];
    
    ctx.font = (note_velocity * 250) + "px Arial";
    ctx.fillStyle = color;
	ctx.fillText(note_name, timeOn, drawY); 


    */
   /*
    drawY = Math.pow(note_velocity * 340, 1.2);
    color = name_to_color[note_name];
    timeRadius = (timeOn - oldTime) / 20;
    
    drawX = note_n * 3 * note_o;
	ctx.lineCap = caps[Math.floor(Math.random() * Math.floor(3))];
    ctx.lineJoin = caps[Math.floor(Math.random() * Math.floor(3))];
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.lineWidth = timeRadius;

    ctx.beginPath();
    ctx.moveTo(drawX, drawY);
    ctx.lineTo(oldDrawX, oldDrawY);
    ctx.stroke();
    
    oldDrawX = drawX;
    oldDrawY = drawY;
    oldTime = timeOn;*/
}