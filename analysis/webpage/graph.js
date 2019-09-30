
var chart;
var labels;
var bond_counts;
var time_to_frame = {};
var frame_to_time = [];

var single_staple_counts;
var double_staple_counts;

function make_chart( type='bonds' ) {

	var ctx = document.getElementById("chart").getContext('2d');
	
	if( chart != null ) {chart.destroy();}
	
	var scales = {
		xAxes: [{
			barPercentage : 1.25,
			ticks: {
				min : system["min_time"],
				max : system["max_time"],
				stepSize : system["time_step"]
			}
		}]
	}
	
	var tooltips = {
		mode : 'index',
		axis : 'x',
		intersect : false
	}
	
	var options = {
		maintainAspectRatio : false,
		title : {display: true, text: 'Michael\'s Thesis Work'},
		scales : scales,
		tooltips : tooltips,
		onClick : function(evt,item){update_frame(evt,item);}
	}
	
	var datasets;
	if( type == 'bonds' ) {datasets = [{label:'Bond Count at Frame', data:bond_counts}];}
	else if( type == 'single_staples' ) {datasets = [{label:'Single Bound Staples at Frame', data:single_staple_counts}];}
	else if( type == 'double_staples' ) {datasets = [{label:'Double Bound Staples at Frame', data:double_staple_counts}];}
	else if( type == 'longest_staple' ) {datasets = [{label:'Max Distance of a Staple at Frame', data:longest_staples}];}
	else {console.log('ERROR : The only graph options are "bonds", "single_staples", "double_staples", and "longest_staple"');}

	chart = new Chart(ctx, {
		type : 'bar',
		data : {labels:labels, datasets:datasets},
		options : options
	});
	
}

function update_frame( evt, item ) {
	
	if( item !== undefined && item.length !== 0 && item[0] !== undefined ) {
		updateALL( item[0]["_model"]["label"] ); }

}

function make_bond_data() {

	labels = [];
	bond_counts = [];
	var index = 0;
	var count = 0;
	
	for(var time = system["min_time"]; time <= system["max_time"]; time += system["time_step"]){
		
		while( typeof(system["data"][index]) != 'undefined' && system["data"][index][0] === time ) {
			if( system["data"][index][3] === "BREAK" )
				count -- ;
			else if( system["data"][index][3] === "BINDS" )
				count ++ ;
			else
				console.log("ERROR : Invalid data, bonds can only break or bind");
			index ++ ;
		}
		
		if( typeof(system["data"][index]) != 'undefined' && system["data"][index][0] < time )
			console.log("ERROR : Time variable not stepping with data increments correctly");
		if( count < 0 )
			console.log("ERROR : Number of bonds cannot be negative");
		
		labels.push( time );
		bond_counts.push( count );
		
	}
	
	var counter = 0;
	for(var time = system["min_time"]; time <= system["max_time"]; time += system["time_step"]){
		time_to_frame[ time ] = counter;
		frame_to_time.push(time);
		counter ++ ;
	}
	
}
