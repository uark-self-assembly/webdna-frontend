
var STAPLE_CUTOFF = 8;				// this determines the number of matching nucleotides that determine a "correct" domain match
var BOUND_CUTOFF = 2;				// this determines the number of bound nucleotides that determine a domain has bounded

var pairings = new Set([ "AT", "CG", "GC", "TA" ]);

var backbone;
var domains = [];
var longest_staples = [];

function designate_backbone(strand) {
	backbone = strand;
}

function compute_matching_domains() {
	
	if( backbone == null ) {console.log('Backbone has not yet been designated'); return;}
	
	var count = 0;
	for( var staple = 1; staple < str_conf.length; staple++ ) {
		if( backbone != staple ) {
		
			for( var staple_index = system["str_seq"][staple].length-1; staple_index >= 0; staple_index-- ) {
				for( var backbone_index = 0; backbone_index < system["str_seq"][backbone].length; backbone_index++ ) {
					
					//console.log( 'Evaluating staple index : ' + staple_index + " and backbone index : " + backbone_index );
					
					stap_temp = staple_index;
					back_temp = backbone_index;
					
					count = 0;
					while( pairings.has( system["str_seq"][staple].charAt(stap_temp) + system["str_seq"][backbone].charAt(back_temp) ) ) {
						count++;
						stap_temp--;
						back_temp++;
					}
					
					if( count >= STAPLE_CUTOFF ) {
						
						if( domains[staple] == null ) {domains[staple] = [];}
						domains[staple].push( [staple_index, backbone_index, count] );
						
						staple_index = stap_temp-1;
						break;
					}
					
				}
			}
			
		}
	}
	
}

// this function assumes domains to match staples must include nucleotides on both ends
function compute_with_assumptions() {
	
	if( backbone == null ) {console.log('Backbone has not yet been designated'); return;}
	
	var count = 0;
	for( var staple = 1; staple < str_conf.length; staple++ ) {
		if( backbone != staple ) {
			
			var start_index;
			var end_index;
			var start_count = 0;
			var end_count = 0;
			
			for( var backbone_index = 0; backbone_index < system["str_seq"][backbone].length; backbone_index++ ) {
				
				//console.log( 'Evaluating staple index : ' + staple_index + " and backbone index : " + backbone_index );
				
				stap_temp = 0;
				back_temp = backbone_index;
				
				count = 0;
				while( stap_temp < system["str_seq"][staple].length && back_temp >= 0 && pairings.has( system["str_seq"][staple].charAt(stap_temp) + system["str_seq"][backbone].charAt(back_temp) ) ) {
					count++;
					stap_temp++;
					back_temp--;
				}
				
				if( count > start_count ) {
					start_index = backbone_index;
					start_count = count;
				}
				
				stap_temp = system["str_seq"][staple].length-1;
				back_temp = backbone_index;
				
				count = 0;
				while( stap_temp >= 0 && back_temp < system["str_seq"][backbone].length && pairings.has( system["str_seq"][staple].charAt(stap_temp) + system["str_seq"][backbone].charAt(back_temp) ) ) {
					count++;
					stap_temp--;
					back_temp++;
				}
				
				if( count > end_count ) {
					end_index = backbone_index;
					end_count = count;
				}
				
			}
			
			domains[staple] = [];
			domains[staple].push( [ (start_count-1), (start_index-start_count+1), start_count ] );
			domains[staple].push( [ (system["str_seq"][staple].length-1), end_index, end_count ] );
			
		}
	}
	
}

// not yet implemented, should check every possible pair of matching domains and pick the ones that maximize staple efficiency
function compute_all_possibilities() {
	
	if( backbone == null ) {console.log('Backbone has not yet been designated'); return;}
	
	var count = 0;
	for( var staple = 1; staple < str_conf.length; staple++ ) {
		if( backbone != staple ) {
		
			for( var staple_index = system["str_seq"][staple].length-1; staple_index >= 0; staple_index-- ) {
				for( var backbone_index = 0; backbone_index < system["str_seq"][backbone].length; backbone_index++ ) {
					
					//console.log( 'Evaluating staple index : ' + staple_index + " and backbone index : " + backbone_index );
					
					stap_temp = staple_index;
					back_temp = backbone_index;
					
					count = 0;
					while( pairings.has( system["str_seq"][staple].charAt(stap_temp) + system["str_seq"][backbone].charAt(back_temp) ) ) {
						count++;
						stap_temp--;
						back_temp++;
					}
					
					if( count >= STAPLE_CUTOFF ) {
						
						if( domains[staple] == null ) {domains[staple] = [];}
						domains[staple].push( [staple_index, backbone_index, count] );
						
						staple_index = stap_temp-1;
						break;
					}
					
				}
			}
			
		}
	}
	
}

// this function just checks to make sure that two staples don't have corresponding domains on the backbone that overlap
function validate_domain_matching() {
	
	var backbone_nucleotides = [];
	for( var i = 0; i < system['str_nuc'][backbone].length; i++ ) {backbone_nucleotides.push(false);}
	
	for( var staple = 0; staple < domains.length; staple++ ) {
		if( domains[staple] != null ) {
			
			var index = 0;
			while( domains[staple][index] != null ) {
				
				var x1 = domains[staple][index][1];
				var x2 = x1 + domains[staple][index][2];
				for( var x = x1; x < x2; x++ ) {
					if( backbone_nucleotides[x] ) {console.log('ERROR : Invalid domain matching, try increasing STAPLE_CUTOFF threshold, could also be improperly designed origami staples'); return false;}
					backbone_nucleotides[x] = true;
				}
				
				index++;
			}
			
		}
	}
	
	console.log('Domain matching is valid!');
	return true;
}

function print_domain_matching() {
	
	if( domains.length == 0 ) {	compute_matching_domains(); }
	
	if( computed_time != -1 ) {
		
		for( var i = 0; i < str_conf.length; i++ ) {
			for( var x = 0; x < str_conf.length; x++ ) {
				if( i != x ) { str_conf[i][x] = 1; }
				else { str_conf[i][x] = 0; }}}
		
		for( var i = 0; i < nuc_conf.length; i++ ) {
			for( var x = 0; x < nuc_conf.length; x++ ) {
				nuc_conf[i][x] = 0; }}
		
		for( var staple = 1; staple < domains.length; staple++ ) {
			
			var index = 0;
			while( domains[staple] != null && domains[staple][index] != null ) {
				
				var count = 0;
				var stap = system["str_nuc"][staple][domains[staple][index][0]];
				var back = system["str_nuc"][backbone][domains[staple][index][1]];
				var leng = domains[staple][index][2];
				
				while( count < leng ) {
					
					nuc_conf[back][stap] = 1;
					
					stap--;
					back++;
					count++;
					
				}
				
				index++;
				
			}
			
		}
		
		computed_time = -1;
		
	}
	
	console.log( 'Computed time = ' + computed_time );
	domain_mapping_canvas();
	
}

function domain_mapping_canvas() {
	
	var height = 170;
		
	var drawn = false;
	var taken_space = [];
	var original = []
	
	for( var i = 0; i < str_conf.length; i++ ) {original.push(true);}

	color_cycle = ['#000000','#FF00FF','#00FFFF','#FFFF00','#FF0000','#00FF00','#0000FF'];

	for(var staple = 1; staple < str_conf.length; staple++) {
		if( backbone != staple && original[staple] ) {
			
			two_str( backbone, staple, height, !drawn, taken_space, color_cycle[staple%color_cycle.length], [50,1] );
			drawn = true;
			
			for( var x = staple+1; x < str_conf.length; x++ ) {if( system["str_seq"][x] == system["str_seq"][staple] ){original[x] = false;}}
			
		}
		
	}
	
}

function compute_staple_distances() {
	
	var circular = false;
	
	var staple_distances = [];
	
	if( !circular ) {
		
		for( var staple = 1; staple < str_conf.length; staple++ ) {
			if( backbone != staple ) {
				
				var max_distance
				
				for( var i1 = 0; i1 < domains[staple].length-1; i1++ ) {
					for( var i2 = i1+1; i2 < domains[staple].length; i2++ ) {
						
						// check the distance between the two, may not be necessary anymore, however
						
					}
				}
				
			}
		}
		
	}
	
}

function check_bound( staple ) {
	
	if( backbone == null )   {console.log('Backbone has not yet been designated');      return;}
	if( backbone == staple ) {console.log('Strand cannot be both backbone and staple'); return;}
	
	var index = 0;
	var num_bound_domains = 0;
	while( domains[staple] != null && domains[staple][index] != null ) {
		
		var count = 0;
		var stap_index = domains[staple][index][0];
		var back_index = domains[staple][index][1];
		
		var num_bonds = 0
		
		while( count < domains[staple][index][2] && num_bonds < BOUND_CUTOFF ) {
			
			if( nuc_conf[ system["str_nuc"][backbone][back_index] ][ system["str_nuc"][staple][stap_index] ] === 1 ) {
				num_bonds++;
			}
			
			stap_index--;
			back_index++;
			count++;
			
		}
		
		if( num_bonds >= BOUND_CUTOFF ) { num_bound_domains++; }
		index++;
		
	}
	
	return num_bound_domains;
	
}

function count_bound_staples( num_domains ) {
	
	var count = 0;
	for( var staple = 1; staple < str_conf.length; staple++ ) {if( backbone != staple ) {if( check_bound(staple) >= num_domains ) {count++;}}}
	return count;
	
}

function check_backbone_nucleotide_vs_staple( index, staple ) {
	for( var i = system["str_nuc"][staple][0]; i <= system["str_nuc"][staple][system["str_nuc"][staple].length-1]; i++ ) {
		if( nuc_conf[index][i] === 1 ) {return true;}}
	return false;
}

// this function finds the greatest distance between any two nucleotides in the backbone bound by the given staple
function staple_length( staple ) {
	
	var circular = false;
	
	// this should be able to be optimized, just using brute force, seemes like a really fun and interesting problem
	if( circular ) {
		
		var backbone_indicies = [];
		var distances = [];
		
		for( var i1 = system["str_nuc"][backbone][0]; i1 <= system["str_nuc"][backbone][system["str_nuc"][backbone].length-1]; i1++ ) {
			for( var i2 = system["str_nuc"][staple][0]; i2 <= system["str_nuc"][staple][system["str_nuc"][staple].length-1]; i2++ ) {
				if( nuc_conf[i1][i2] === 1 ) {backbone_indicies.push( i1 ); break;}}}
		
		for( var i1 = 0; i1 < backbone_indicies.length; i1++ ) {
			for( var i2 = i1+1; i2 < backbone_indicies.length; i2++ ) {
				distances.push( Math.min( (backbone_indicies[i2]-backbone_indicies[i1]), (system["str_nuc"][backbone].length-(backbone_indicies[i2]-backbone_indicies[i1])) ) );}}
		
		if( distances.length > 0 ) {return Math.max.apply(Math, distances);}
		return 0;
		
	} else {
		
		var front = 0;
		var back = system["str_nuc"][backbone].length-1;
		
		while( front < system["str_nuc"][backbone].length && !check_backbone_nucleotide_vs_staple( front, staple ) ) {front++;}
		while( back >= 0 && !check_backbone_nucleotide_vs_staple( back, staple ) ) {back--;}
		
		if( back > front ) {return (back-front);}
		return 0;
		
	}
	
}

function compute_origami_statistics(){
	
	single_staple_counts = [];
	double_staple_counts = [];
	
	var max;
	var temp;
	
	longest_staples = [];
	
	for( var frame = 0; frame < frame_to_time.length; frame++ ) {
		
		current_time = frame_to_time[frame];
		compute_time();
		
		single_staple_counts.push( count_bound_staples(1) );
		double_staple_counts.push( count_bound_staples(2) );
		
		//console.log( "Computing longest staples for frame : " + frame_to_time[frame] );
		
		max = 0;
		for( var staple = 1; staple < str_conf.length; staple++ ) {
			if( backbone != staple ) {
				
				temp = staple_length( staple );
				if( temp > max ) {max = temp;}
				
				//console.log( "Staple #" + staple + " has distance " + temp );
				
			}
		}
		
		longest_staples.push( max );
		
	}
	
}