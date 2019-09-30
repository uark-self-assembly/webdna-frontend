
var current_time;
var computed_time;
var nuc_conf;
var str_conf;
var center_flag = false;
var canvas_type = 'all';
var check_point = null;
var highlighted;

var colors = [ null, "yellow", "red", "blue", "green" ];

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width  = document.getElementById("canvas-container").clientWidth ;
canvas.height = document.getElementById("canvas-container").clientHeight;

var width  = canvas.offsetWidth ;
var height = canvas.offsetHeight;

ctx.font = "30px Courier";
ctx.textAlign = "center";

var PAN_STEP = 50;
var translation_x = 0;
var translation_y = 0;

function select_all() {
	
	for( var i = 0; i < highlighted.length; i++ ) {
		highlighted[i] = 1; }
	toggle_strands_htmol();
	updateCanvas();
	
}

function deselect_all() {
	
	for( var i = 0; i < highlighted.length; i++ ) {
		highlighted[i] = 0; }
	toggle_strands_htmol();
	updateCanvas();

}

function toggle_strands_htmol() {
	
	var atoms = [];
	var red = [];
	var blue = [];
	var green = [];
	
	for( var i = 0; i < highlighted.length; i++ ){
		if( highlighted[i] > 0 ) {
			system["str_nuc"][i].forEach( nucleotide => {
				atoms.push( (nucleotide*2+1), (nucleotide*2+2) );
			});}
		if( highlighted[i] == 2 ) {
			system["str_nuc"][i].forEach( nucleotide => {
				red.push( (nucleotide*2+1), (nucleotide*2+2) );
			});}
		if( highlighted[i] == 3 ) {
			system["str_nuc"][i].forEach( nucleotide => {
				blue.push( (nucleotide*2+1), (nucleotide*2+2) );
			});}
		if( highlighted[i] == 4 ) {
			system["str_nuc"][i].forEach( nucleotide => {
				green.push( (nucleotide*2+1), (nucleotide*2+2) );
			});}
	}
	
	var message = [ atoms, red, blue, green ];
	
	// post message to htmol application to only display certain strands
	document.getElementById('iframe').contentWindow.postMessage( 'Atoms\n' + JSON.stringify(message), '*');
}

function translate(pos) {
	
	var translation_speed = 1;
	
	//console.log(pos.x + " " + pos.y + " " + width + " " + height);
	
	if( pos.x >= 0 && pos.x <= width / 8 ) {
		//console.log("Translated Left");
		if( pos.x <= width / 16 ) {
			translation_speed = 5;}
		ctx.translate( translation_speed*PAN_STEP, 0 );
		translation_x += translation_speed*PAN_STEP;}
	if( pos.x >= 7 * width / 8 && pos.x < width ) {
		//console.log("Translated Right");
		if( pos.x >= 15 * width / 16 ) {
			translation_speed = 5;}
		ctx.translate( -1*translation_speed*PAN_STEP, 0 );
		translation_x -= translation_speed*PAN_STEP;}
	if( pos.y >= 0 && pos.y <= height / 8 ) {
		//console.log("Translated Up");
		if( pos.y <= height / 16 ) {
			translation_speed = 5;}
		ctx.translate( 0, translation_speed*PAN_STEP );
		translation_y += translation_speed*PAN_STEP;}
	if( pos.y >= 7 * height / 8 && pos.y < height ) {
		//console.log("Translated Down");
		if( pos.y >= 15 * height / 16 ) {
			translation_speed = 5;}
		ctx.translate( 0, -1*translation_speed*PAN_STEP );
		translation_y -= translation_speed*PAN_STEP;}

	updateCanvas();
}

function hightlight(pos) {
	
	// check that click wasn't to translate first
	if( pos.x > width/8 && pos.x < 7*width/8 && pos.y > height/8 && pos.y < 7*height/8 ) {
		
		check_point = {};
		check_point['x'] = pos.x - translation_x;
		check_point['y'] = pos.y - translation_y;
		
		updateCanvas();
		
		//if check_point comes back null, re-update to highlight any duplicates
		if( check_point == null ) {
			updateCanvas();
			toggle_strands_htmol();}
		else {
			check_point = null;}
		
	}
	
}

canvas.addEventListener('click', (e) => {
	//window.alert( "Displaying frame number " + time_to_frame[current_time] + " (starting at zero)" )
	const pos = {
		x: e.clientX-canvas.getBoundingClientRect().left,
		y: e.clientY-canvas.getBoundingClientRect().top
	};
	translate(pos);
	hightlight(pos);
});

function initConfVariables() {
	
	nuc_conf = new Array( parseInt( system["num_nuc"] ) );
	for( var i = 0; i < nuc_conf.length; i++ )
		nuc_conf[i] = new Array( parseInt( system["num_nuc"] ) );
	
	str_conf = new Array( parseInt( system["num_str"] ) );
	for( var i = 0; i < str_conf.length; i++ )
		str_conf[i] = new Array( parseInt( system["num_str"] ) );
	
	highlighted = new Array( parseInt( system["num_str"] ) );
	for( var i = 0; i < highlighted.length; i++ )
		highlighted[i] = 0;
	
	//document.getElementById("time_slider").innerHTML =	'Select a frame to display :<input onchange="updateALL(this.value);" type="range" min="' + system["min_time"] + '" max="' + system["max_time"] + '" step="' + system["time_step"] + '">&nbsp;<input onchange="updateALL(this.value);" type="text" id="textInput" value="">';
	
}

function check_mutltiple( i, x, str1, str2 ) {
	
	moved = true;
	temp1 = i;
	temp2 = x;
	
	// only need to check in one direction, since dna only ever bonds in one direction
	while( temp1 < system["str_nuc"][str1].length && temp2 >= 0 && nuc_conf[ system["str_nuc"][str1][temp1] ][ system["str_nuc"][str2][temp2] ] === 1 ) {
		temp1 ++ ;
		temp2 -- ;
	}
	
	temp1 -- ;
	temp2 ++ ;
	
	if( i == temp1 && x == temp2 ) {
		moved = false;
	}
	
	return [ moved, temp1, temp2 ];
}

function one_str( str, height ) {
	
	// highlight strands if need be and check if "check_point" indicates a new strand to be highlighted
	if( check_point != null && check_point.x > width/2-(9*system["str_seq"][str].length) && check_point.x < width/2+(9*system["str_seq"][str].length) && check_point.y > height-25 && check_point.y < height ) { 
		highlighted[str] = (highlighted[str]+1) % 5;
		check_point = null;}
	
	if( highlighted[str] > 0 ) {
		ctx.fillStyle = colors[ highlighted[str] ];
		ctx.fillRect( width/2-(9*system["str_seq"][str].length), height-25, 18*system["str_seq"][str].length, 25 );}
		
	ctx.fillStyle = "black";
	
	ctx.fillText( system["str_seq"][str], canvas.width/2, height );
	
	var mid = (system["str_seq"][str].length+1)/2-1;
	
	var bar = 30;
	
	var previous = 0;
	
	for( var i = 0; i < system["str_nuc"][str].length-1; i++ ){
		for( var x = i+1; x < system["str_nuc"][str].length; x++ ){
			
			if( nuc_conf[ system["str_nuc"][str][i] ][ system["str_nuc"][str][x] ] === 1){
			
				// resets the bar length if it won't intersect other bars (if it is past the previously furthest bonded subsequence)
				if( x > previous && i > previous ) {
					bar = 30;
					previous = x;}
			
				retval = check_mutltiple( i, x, str, str );
				
				if( retval[0] ) {
					
					in_mid1 = (system["nuc_str"][system["str_nuc"][str][i]][1]+system["nuc_str"][system["str_nuc"][str][retval[1]]][1])/2-mid;
					in_mid2 = (system["nuc_str"][system["str_nuc"][str][x]][1]+system["nuc_str"][system["str_nuc"][str][retval[2]]][1])/2-mid;
					
					
					ctx.beginPath();
					ctx.moveTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][i]][1] - mid ) - 9, height-25 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][i]][1] - mid ) - 9, height+05 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][retval[1]]][1] - mid ) + 9, height+05 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][retval[1]]][1] - mid ) + 9, height-25 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][i]][1] - mid ) - 9, height-25 );
					ctx.stroke();
					
					ctx.beginPath();
					ctx.moveTo( canvas.width/2 + 18*( in_mid1 ), height-25 );
					ctx.lineTo( canvas.width/2 + 18*( in_mid1 ), height-bar );
					ctx.lineTo( canvas.width/2 + 18*( in_mid2 ), height-bar );
					ctx.lineTo( canvas.width/2 + 18*( in_mid2 ), height-25 );
					ctx.stroke();
					
					ctx.beginPath();
					ctx.moveTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][retval[2]]][1] - mid ) - 9, height-25 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][retval[2]]][1] - mid ) - 9, height+05 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][x]][1] - mid ) + 9, height+05 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][x]][1] - mid ) + 9, height-25 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][retval[2]]][1] - mid ) - 9, height-25 );
					ctx.stroke();
					
					// This breaks the inner loop and fast forwards the outer loop past the sequence
					i = retval[1]+1;
					bar += 3
					break;
					// -----------------------------------------------------------------------------
					
				}
				else {
					
					ctx.beginPath();
					ctx.moveTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][i]][1] - mid ) , height-25 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][i]][1] - mid ) , height-bar );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][x]][1] - mid ) , height-bar );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str][x]][1] - mid ) , height-25 );
					ctx.stroke();
					
				}
	
				bar += 3
				
			}
		}
	}
}

function two_str( str1, str2, height, first, taken_space, bond_color='#000000', extra_room=[0,0] ){

	var bonds = [];
	var total = 0;
	var count = 0;
	
	var mid1 = (system["str_seq"][str1].length+1)/2-1;
	var mid2 = (system["str_seq"][str2].length+1)/2-1;
	
	var votes = {};
	
	for( var i = 0; i < system["str_nuc"][str1].length; i++ ){
		for( var x = 0; x < system["str_nuc"][str2].length; x++ ){
		
			if( nuc_conf[ system["str_nuc"][str1][i] ][ system["str_nuc"][str2][x] ] === 1){
			
				bonds.push( [i,x] );
				
				if( votes[ (system["nuc_str"][system["str_nuc"][str1][i]][1]-mid1) - (mid2-system["nuc_str"][system["str_nuc"][str2][x]][1]) ] == undefined ) {
					votes[ (system["nuc_str"][system["str_nuc"][str1][i]][1]-mid1) - (mid2-system["nuc_str"][system["str_nuc"][str2][x]][1]) ] = 0;}
				votes[ (system["nuc_str"][system["str_nuc"][str1][i]][1]-mid1) - (mid2-system["nuc_str"][system["str_nuc"][str2][x]][1]) ] ++ ;
				
			}
		}
	}
	
	var maxIndex;
	var maxValue = 0;
	for(var key in votes) {
		if( votes[key] > maxValue ) {
			maxIndex = parseFloat(key);
			maxValue = votes[key];
		}
	}
	
	var offset1 = 0;
	var offset2 = 18 * maxIndex;
	
	var lbound = canvas.width/2 + offset2 - 9*(system["str_seq"][str2].length+1)
	var rbound = canvas.width/2 + offset2 + 9*(system["str_seq"][str2].length+1)
	
	var collision = true;
	var level = -1;

	// find the first level in which the new strand could fit without overlapping other strands
	while( collision ) {
		level ++ ;
		if( level == taken_space.length) {break;}
		var index = 0;
		collision = false;
		while( index < taken_space[level].length ) {
			if( lbound < taken_space[level][index+1] && rbound > taken_space[level][index] ) {
				collision = true;
				break;}
			index += 2 ;
		}
	}
	
	// if on already established level, add data; otherwise create new level and add current instance
	if( level < taken_space.length ) {taken_space[level].push( lbound, rbound );}
	else {taken_space[level] = [ lbound, rbound ];}
	
	var ALH = (50+extra_room[0]) * (level+extra_room[1]); //Additional Level Height
	
	// check if "check_point" was on string and see which to highlight
	// only highlight / check first string if it hasn't been evaluated before (otherwise, it will highlight over previously drawn bonds)
	if( first ) {
		if( check_point != null && check_point.x > width/2+offset1-(9*system["str_seq"][str1].length) && check_point.x < width/2+offset1+(9*system["str_seq"][str1].length) && check_point.y > height-25     && check_point.y < height        ) { 
			highlighted[str1] = (highlighted[str1]+1) % 5;
			check_point = null;}
		if( highlighted[str1] > 0 ) {
			ctx.fillStyle = colors[ highlighted[str1] ];
			ctx.fillRect( width/2+offset1-(9*system["str_seq"][str1].length), height-25    , 18*system["str_seq"][str1].length, 25 ); }
	}
		
	if( check_point != null && check_point.x > width/2+offset2-(9*system["str_seq"][str2].length) && check_point.x < width/2+offset2+(9*system["str_seq"][str2].length) && check_point.y > height+25+ALH && check_point.y < height+50+ALH ) { 		
		highlighted[str2] = (highlighted[str2]+1) % 5;
		check_point = null;}
	if( highlighted[str2] > 0 ) {
		ctx.fillStyle = colors[ highlighted[str2] ];
		ctx.fillRect( width/2+offset2-(9*system["str_seq"][str2].length), height+25+ALH, 18*system["str_seq"][str2].length, 25 );}
	
	ctx.fillStyle = "black";
	//---------------------------------------------------------------------
	
	if( first ) {ctx.fillText( system["str_seq"][str1], canvas.width/2 + offset1, height );}
	ctx.fillText( reverseSequence( system["str_seq"][str2] ), canvas.width/2 + offset2, height + 50 + ALH );
	
	ctx.strokeStyle = bond_color;
	
	for( var i = 0; i < system["str_nuc"][str1].length; i++ ){
		for( var x = 0; x < system["str_nuc"][str2].length; x++ ){
			
			if( nuc_conf[ system["str_nuc"][str1][i] ][ system["str_nuc"][str2][x] ] === 1){
				
				retval = check_mutltiple( i, x, str1, str2 );
				
				if( retval[0] ) { // Got a problem with the offsets, boxes aren't on correct subsequences
					
					in_mid1 = (system["nuc_str"][system["str_nuc"][str1][i]][1]+system["nuc_str"][system["str_nuc"][str1][retval[1]]][1])/2-mid1;
					in_mid2 = mid2-(system["nuc_str"][system["str_nuc"][str2][x]][1]+system["nuc_str"][system["str_nuc"][str2][retval[2]]][1])/2;
					
					
					ctx.beginPath();
					ctx.moveTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str1][i]][1] - mid1 ) - 9 + offset1, height-25 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str1][i]][1] - mid1 ) - 9 + offset1, height+05 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str1][retval[1]]][1] - mid1 ) + 9 + offset1, height+05 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str1][retval[1]]][1] - mid1 ) + 9 + offset1, height-25 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str1][i]][1] - mid1 ) - 9 + offset1, height-25 );
					ctx.stroke();
					
					ctx.beginPath();
					ctx.moveTo( canvas.width/2 + 18*( in_mid1 ) + offset1, height+05 );
					ctx.lineTo( canvas.width/2 + 18*( in_mid1 ) + offset1, height+10 );
					ctx.lineTo( canvas.width/2 + 18*( in_mid2 ) + offset2, height+20+ALH );
					ctx.lineTo( canvas.width/2 + 18*( in_mid2 ) + offset2, height+25+ALH );
					ctx.stroke();
					
					ctx.beginPath();
					ctx.moveTo( canvas.width/2 + 18*( mid2 - system["nuc_str"][system["str_nuc"][str2][retval[2]]][1] ) + 9 + offset2, height+25+ALH );
					ctx.lineTo( canvas.width/2 + 18*( mid2 - system["nuc_str"][system["str_nuc"][str2][retval[2]]][1] ) + 9 + offset2, height+55+ALH );
					ctx.lineTo( canvas.width/2 + 18*( mid2 - system["nuc_str"][system["str_nuc"][str2][x]][1] ) - 9 + offset2, height+55+ALH );
					ctx.lineTo( canvas.width/2 + 18*( mid2 - system["nuc_str"][system["str_nuc"][str2][x]][1] ) - 9 + offset2, height+25+ALH );
					ctx.lineTo( canvas.width/2 + 18*( mid2 - system["nuc_str"][system["str_nuc"][str2][retval[2]]][1] ) + 9 + offset2, height+25+ALH );
					ctx.stroke();
					
					// This breaks the inner loop and fast forwards the outer loop past the sequence
					i = retval[1]+1;
					break;
					// -----------------------------------------------------------------------------
				}
				else {
					
					ctx.beginPath();
					ctx.moveTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str1][i]][1] - mid1 ) + offset1, height+05 );
					ctx.lineTo( canvas.width/2 + 18*( system["nuc_str"][system["str_nuc"][str1][i]][1] - mid1 ) + offset1, height+10 );
					ctx.lineTo( canvas.width/2 + 18*( mid2 - system["nuc_str"][system["str_nuc"][str2][x]][1] ) + offset2, height+20+ALH );
					ctx.lineTo( canvas.width/2 + 18*( mid2 - system["nuc_str"][system["str_nuc"][str2][x]][1] ) + offset2, height+25+ALH );
					ctx.stroke();
					
				}
				
			}
		
		}
	}
	
	ctx.strokeStyle = "black";
	
	return taken_space;
	
}

function reverseSequence( str ) { return str.split("").reverse().join(""); }

function compute_time(){
	
	// computed time is after the queried time, need to start over
	if( computed_time == null || computed_time < 0 || computed_time > current_time ) {
		
		var frame = 0;
		var index = 0;
	
		for( var i = 0; i < nuc_conf.length; i++ ) {
			for( var x = 0; x < nuc_conf.length; x++ )
				nuc_conf[i][x] = 0; }
		
		for( var i = 0; i < str_conf.length; i++ ) {
			for( var x = 0; x < str_conf.length; x++ )
				str_conf[i][x] = 0; }
	
	// queried time is after the computed time, can continue computation
	} else {
		
		var frame = time_to_frame[computed_time]+1;
		var index = 0;
		
		while( index < system["data"].length && frame_to_time[frame] > system["data"][index][0] ) {index++;}
		
		//console.log( 'LOOK HERE : frame = ' + frame + '\tindex = ' + index );
		
	}
	
	while(frame_to_time[frame] <= current_time){
		
		while( index < system["data"].length && frame_to_time[frame] === system["data"][index][0] ) {
			if( system["data"][index][3] === 'BREAK' ){
				if( nuc_conf[ system["data"][index][1] ][ system["data"][index][4] ] === 1 ) {
					nuc_conf[ system["data"][index][1] ][ system["data"][index][4] ] = 0;
					str_conf[ system["nuc_str"][system["data"][index][1]][0] ][ system["nuc_str"][system["data"][index][4]][0] ] --; }
				else
					console.log( "ERROR : Invalid data, bonds that don't exist can't break" );
			}
			else if( system["data"][index][3] === 'BINDS' ){
				if( nuc_conf[ system["data"][index][1] ][ system["data"][index][4] ] === 0 ) {
					nuc_conf[ system["data"][index][1] ][ system["data"][index][4] ] = 1;
					str_conf[ system["nuc_str"][system["data"][index][1]][0] ][ system["nuc_str"][system["data"][index][4]][0] ] ++; }
				else
					console.log( "ERROR : Invalid data, already-bound nucleotides can't bind again" );
			}
			else
				console.log( "ERROR : Invalid data, entry must be BREAK or BINDS" );
			
			index ++;
		}
		
		frame ++;
	}
	
	//console.log( 'frame = ' + frame + '\tindex = ' + index );
	computed_time = current_time;
	
}

function log(x){ console.log( x ); for(var i = 0; i < str_conf.length; i++){for(var x = 0; x < str_conf.length; x++){if( str_conf[i][x] != 0 )console.log( "i = " + i + "\tx = " + x + "\tbonds = " + str_conf[i][x] );}} }

function updateALL( frame_num, update = true ) {

	current_time = frame_num;
	//updateTextInput();
	updateCanvas();

	// post message to htmol application to jump to specific frame
	if( update ) {document.getElementById('iframe').contentWindow.postMessage( 'Frame\n' + time_to_frame[frame_num] , '*');}
}

function center_canvas() {
	center_flag = true;
	updateCanvas();
}

function show_strands() {
	canvas_type = 'all';
	updateCanvas();
}

function show_domains() {
	canvas_type = 'domains';
	updateCanvas();
}

function show_bonds() {
	console.log( "Showing bonds at frame " + current_time );
	canvas_type = 'bonds';
	updateCanvas();
}

function updateCanvas() {
	
	ctx.clearRect(0-translation_x, 0-translation_y, canvas.width, canvas.height);
	
	// if switch frames in the simulation, center the canvas and clear the highlights
	if( (canvas_type == 'bonds' && computed_time != current_time) || center_flag ) {
		center_flag = false;
		ctx.translate( -1*translation_x, -1*translation_y );
		translation_x = 0;
		translation_y = 0;}
	
	var height = 170;
	
	if( canvas_type == 'all' ) {
		
		document.getElementById('canvas-header').innerHTML = "Currently displaying all strands";
		
		for( var i = 1; i < str_conf.length; i++ ) {
			one_str( i , height );
			height += 120;}
		
	} else if( canvas_type == 'bonds' ) {
		
		document.getElementById('canvas-header').innerHTML = "Currently displaying all bonds at time = " + current_time + " (frame = " + time_to_frame[current_time] + ')';

		if( computed_time != current_time ) {compute_time();}
		
		for(var i = 1; i < str_conf.length; i++){
			
			var drawn = false;
			var taken_space = [];

			for(var x = i; x < str_conf.length; x++){
				
				if( str_conf[i][x] > 0 ) {
				
					if( i === x ){
						one_str( i, height );}
					else{
						two_str( i, x, height, !drawn, taken_space );}
						
					drawn = true;
					
				}
				
			}
			
			if( drawn ) {height += (120 + 70*taken_space.length);}
			
		}
		
	} else if( canvas_type == 'domains' ) {
		
		document.getElementById('canvas-header').innerHTML = "Currently displaying the computed domain matching"
		
		print_domain_matching();
		
	} else { console.log('ERROR : canvas_type must be set to either "all", "bonds", or "domains"'); }
	
	// make border and highlight areas to click to pan around canvas
	
	ctx.beginPath();
	ctx.rect(0-translation_x, 0-translation_y, canvas.width, canvas.height);
	ctx.stroke();
	
	ctx.globalAlpha = 0.03;
    ctx.fillRect(0-translation_x, 0-translation_y, canvas.width/8, canvas.height);
	ctx.fillRect(0-translation_x, 0-translation_y, canvas.width, canvas.height/8);
	ctx.fillRect(0-translation_x+(7*canvas.width/8), 0-translation_y, canvas.width/8, canvas.height);
	ctx.fillRect(0-translation_x, 0-translation_y+(7*canvas.height/8), canvas.width, canvas.height/8);
    
	ctx.globalAlpha = 0.03;
	ctx.fillRect(0-translation_x, 0-translation_y, canvas.width/16, canvas.height);
	ctx.fillRect(0-translation_x, 0-translation_y, canvas.width, canvas.height/16);
	ctx.fillRect(0-translation_x+(15*canvas.width/16), 0-translation_y, canvas.width/16, canvas.height);
	ctx.fillRect(0-translation_x, 0-translation_y+(15*canvas.height/16), canvas.width, canvas.height/16);
	ctx.globalAlpha = 1.00;
	
}

function updateTextInput(val) {document.getElementById('textInput').value=current_time;}	
