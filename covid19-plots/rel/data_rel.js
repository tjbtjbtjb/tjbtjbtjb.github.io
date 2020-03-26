
$(document).ready(function() {
 // AJAX in the data file
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
        dataType: "text",
        success: function(data) {processData(data);}
        });

    // Let's process the data from the data file
    function processData(data) {
        var lines = data.split(/\r\n|\n/);

        //Set up the data arrays
        var time = [];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        var data4 = [];
        var data5 = [];

        var headings = lines[0].split(','); // Splice up the first row to get the headings

        for (var j=1; j<lines.length; j++) {
        var values = lines[j].split(','); // Split up the comma seperated values

        	if(values[0]=='' && values[1]=='France') {
        	
        		for(t=24;t<values.length;t++) {
        			time.push(headings[t]);
        			data1.push((values[t]-values[t-1])/values[t])
        		}
        	}
        	if(values[0]=='' && values[1]=='United Kingdom') {
        	
        		for(t=24;t<values.length;t++) {
        			//time.push(headings[t]);
        			data2.push((values[t]-values[t-1])/values[t]);
        		}
        	}

        	if(values[1]=='Italy') {
        	
        		for(t=24;t<values.length;t++) {
        			//time.push(headings[t]);
        			data3.push((values[t]-values[t-1])/values[t]);
        		}
        	}
        	if(values[1]=='Spain') {
        	
        		for(t=24;t<values.length;t++) {
        			//time.push(headings[t]);
        			data4.push((values[t]-values[t-1])/values[t]);
        		}
        	}

        	if(values[1]=='Germany') {
        	
        		for(t=24;t<values.length;t++) {
        			//time.push(headings[t]);
        			data5.push((values[t]-values[t-1])/values[t]);
        		}
        	}
        }

        var trace1 = { 
        	x: time,
        	y:data1,
        	mode:'lines+markers',
        	type: 'scatter',
        	name: 'France'
        };
		var trace2 = { 
        	x: time,
        	y:data2,
        	mode:'lines+markers',
        	type:'scatter',
        	name: 'UK'
        };		
        var trace3 = { 
        	x: time,
        	y:data3,
        	mode:'lines+markers',
        	type: 'scatter',
        	name: 'Italie'
        };

	var trace4 = { 
        	x: time,
        	y:data4,
        	mode:'lines+markers',
        	type: 'scatter',
        	name: 'Espagne'
        };
	var trace5 = { 
        	x: time,
        	y:data5,
        	mode:'lines+markers',
        	type: 'scatter',
        	name: 'Allemagne'
        };

var layout = {
  xaxis: {
    type: 'lin',
    autorange: true
  },
  yaxis: {
    type: 'lin',
    autorange: true
  },
	title:'Confirmed daily rate increase'
};
        var data = [trace1,trace2,trace3,trace4,trace5];

		Plotly.newPlot('myDiv', data, layout);
    }
})

