$(document).on('ready',function(){
	console.log("Weapons");

	var weaponsData = undefined;

	var typeWeight = function(type){
		if (type === "BEAM") {return 5000};
		if (type === "BALLISTIC") {return 4000};
		if (type === "MISSILE") {return 3000};
		return 1000;
	}

	var factionWeight = function(name){
		if (name.startsWith('Clan')) {
			return 10000;
		} else {
			return 0;
		};
	}

	var sortItems = function (a, b) {
		var typeValue = typeWeight(a.type) - typeWeight(b.type);
		var factionValue = factionWeight(a.name) - factionWeight(b.name);
		var nameValue = a.translated_name.localeCompare(b.translated_name);
		var totalValue = typeValue + nameValue + factionValue;
		console.log(typeValue + nameValue + factionValue, typeValue, nameValue, factionValue);	
		return totalValue;
 	}

	function getInt(object){
		if (typeof object === 'string'){
			return parseInt(object);
		} else if (typeof object == "int"){
			return object;
		} else {
			return 0;
		}
	}

	d3.json("./data/weapons.json", function(data) {
		weaponsData = jsonToArray(data);
		preprocessData(weaponsData);
		drawWeapons(null, "tonnage");
	});

	function preprocessData(data){
		console.log(data);
		for (var a = 0; a < data.length; a++){
			data[a].min_range = getInt(data[a].min_range);
			data[a].long_range = getInt(data[a].long_range);
			data[a].max_range = getInt(data[a].max_range);
		}
	}

	function jsonToArray(data){
		var outArray = [];
		for (key in data){
			var entry = data[key]; 
			outArray.push(entry);
		}
		return outArray
	}

	var weaponsDiv = d3.select("#weapons .content");
	console.log(weaponsDiv);

	maxRange = 0;
	function computeMaxRange(data){
		maxRange = d3.max(data,function(d){
			return d.max_range;
		}); 
	}

	maxTonnage = 0;
	function computeMaxTonnage(data){
		maxTonnage = d3.max(data,function(d){
			return d.tons;
		});
	}

	/*
		showData: range, heat, weight, cooldown, duration, speed, impulse, heat_penalty, price (cb), duration, dps, hps
		sortBy: ascending, descending, byName, 
	*/
	function drawWeapons(sortBy, showData){
		
		var weaponsLines = weaponsDiv.selectAll(".line")
			.data(weaponsData.sort(sortItems))
			.enter()
			.append("div")
				.attr("class",function(d){
					return "line " + d.type.toLowerCase();
				});

		weaponsLines.append("div")
			.attr("class","head")
			.text(function(d){
				return d.translated_name;
			});

		if (showData === "range"){
			computeMaxRange(weaponsData);
			var weaponsLinesRange = weaponsLines.append("div")
				.attr("class","data range");

			weaponsLinesRange.append("div")
				.attr("class","range-min")
				.style("width", function(d,i){
					console.log((d.min_range/maxRange)*100, d.min_range	);
					return (d.min_range/maxRange)*100 + "%";

				})
				.text(function(d){
					if (d.min_range != 0){
						return d.min_range;
					} else {
						return null;
					}
				});
			weaponsLinesRange.append("div")
				.attr("class","range-long")
				.style("width", function(d,i){
					console.log((d.long_range/maxRange)*100, d.long_range	);
					return ((d.long_range - d.min_range)/maxRange)*100 + "%";

				})
				.text(function(d){
					return d.long_range;
				});
			weaponsLinesRange.append("div")
				.attr("class","range-max")
				.style("width", function(d,i){
					console.log((d.max_range/maxRange)*100, d.max_range	);
					return ((d.max_range - d.long_range)/maxRange)*100 + "%";

				})
				.text(function(d){
					if ((d.max_range - d.long_range) > 100 ){
						return d.max_range;
					} else {
						return null;
					}
				});
		} 

		if (showData === "tonnage"){
			computeMaxTonnage(weaponsData);
			var weaponsLinesTonage = weaponsLines.append("div")
				.attr("class","data");
			weaponsLinesTonage.append("div")
				.attr("class","tonnage")
				.style("width", function(d){
					return (d.tons/maxTonnage)*100 + "%";
				})
				.text(function(d){
					return (d.tons);
				});
		}
	}
});