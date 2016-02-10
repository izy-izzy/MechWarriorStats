$(document).on('ready',function(){
  	console.log('Project Loaded');

	/*function getInt(object){
		if (typeof object === 'string'){
			return parseInt(object);
		} else if (typeof object == "int"){
			return object;
		} else {
			return 0;
		}
	}

	var factionWeight = function(faction){
		switch (faction){
			case "InnerSphere" : 
				return 20000;
			case "Clan":
			    return 10000;
			default: 
				return 0;
		}
	}

	var sortItems = function (a, b) {
		var factionValue = factionWeight(a.faction) - factionWeight(b.faction);
		var tonsValue = (a.details.tons - b.details.tons)*10;
		var nameValue = a.name.localeCompare(b.name);
		var totalValue = factionValue + tonsValue + nameValue;
		return totalValue;
 	}

 	var mechSVG = d3.select(".mechs").append("svg")
 					.attr("width","100%")
 					.attr("height", "600");

 	
 	var color = d3.scale.linear()
           	.domain([20,50,100])
          	.range(["#A9FF32", "#E5822B", "#FF0000"]);
 	var weight = d3.scale.linear()
 			.domain([0,100])
 			.range(["0","100"]);

	function drawMechs(){
		console.log(mechsData);
		var mechs = mechSVG.selectAll("rect")
			.data(mechsData.sort(sortItems))
			.enter()
			.append("rect")
				.attr("x", function(d,i){
	  				return ((100/mechsData.length)*i) + "%";
	  			})
	  			.attr("y", function(d,i){
	  				return (100 - weight(d.details.tons)) + "%";
	  			})
	  			.attr("width", function(d){
	  				return 5;
	  			})
	  			.attr("height", function(d){
	  				return weight(d.details.tons) + "%";
	  			})
	  			.attr("class","mech")
	  			.attr("fill",function(d){
	  				return color(d.details.tons);
	  			})
				.attr("data-tonnage", function(d){
					return getInt(d.details.tons);
				});
	}*/

	/*function jsonToArray(data){
		var outArray = [];
		for (key in data){
			var entry = data[key]; 
			outArray.push(entry);
		}
		return outArray
	}

	d3.json("./data/mechs.json", function(data) {
		mechsData = jsonToArray(data);
		preprocessData(mechsData);
		drawMechs();
	});

	function preprocessData(data){
		console.log(data);
		for (var a = 0; a < data.length; a++){
			data[a].details.tons = getInt(data[a].details.tons);
		}
		console.log(data);
	}*/


	$(window).on('resize',function(){
		// solve responsive graphs.
	});

});