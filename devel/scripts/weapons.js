$(document).on('ready',function(){
	
	var weaponsData = undefined;
	var weaponsDiv = d3.select("#weapons .content");
	var weaponsDomain = {
		min: {
			tons: 0,
			slots: 0,
			price : {
				id: 0,
				mc: 0,
				cb: 0
			},
			min_range: 0,
			long_range: 0,
			max_range: 0,
			cooldown: 0,
			speed: 0,
			impulse: 0,
			duration: 0,
			heat: 0,
			num_shots: 0,
			calc_stats : {
				damageMultiplier: 0,
				baseDmg: 0,
				dmg: 0,
				dps: 0,
				hps: 0,
				ehs: 0,
				critDmgs: 0
			},
			min_heat_penality : 0,
			heat_penality: 0
		}
	}
	weaponsDomain.max = jQuery.extend(true, {}, weaponsDomain.min);

	var weaponsFilter = [
		{ name: "tons", value: true},
		{ name: "slots", value: false},
		{ name: "price_mc", value: false},
		{ name: "price_cb", value: false},
		{ name: "min_range", value: false},
		{ name: "long_range", value: false},
		{ name: "max_range", value: false},
		{ name: "cooldown", value: false},
		{ name: "duration", value: false},
		{ name: "heat", value: false}
	]
	

	var typeWeight = function(type){
		if (type === "BEAM") {return 5000};
		if (type === "BALLISTIC") {return 4000};
		if (type === "MISSLE") {return 3000};
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
		return totalValue;
 	}

	function getInt(object){
		if (typeof object === 'string'){
			return parseFloat(object);
		} else if (typeof object == "number"){
			return object;
		} else {
			return 0;
		}
	}

	d3.json("./data/weapons.json", function(data) {
		weaponsData = jsonToArray(data);
		preprocessData(weaponsData);
		calculateWeaponsMinMax(weaponsData);
		drawFilters();
		drawWeapons("tonnage");
	});

	function preprocessData(data){
		for (var a = 0; a < data.length; a++){
			var element = data[a];
			for (property in element){
				if (element.hasOwnProperty(property) && weaponsDomain.min.hasOwnProperty(property)){
					if (getNumberOfProperities(element[property]) > 0){
						for (subproperty in element[property]){
							if (element[property].hasOwnProperty(subproperty)){
								element[property+"_"+subproperty] = getInt((element[property])[subproperty]);
							}
						}
					delete element[property];
					} else {
						element[property] = getInt(element[property]);
					}
				}
			}
		}
		console.log(data);
	}

	function jsonToArray(data){
		var outArray = [];
		for (key in data){
			var entry = data[key]; 
			outArray.push(entry);
		}
		return outArray;
	}

	function drawFilters(){
		d3.selectAll("#weaponsfilter .content .filterDiv").selectAll(".filter")
			.data(weaponsFilter)
			.enter()
			.append("div")
				.attr("class", "filter")
				.attr("data-selected", function(d){
					return d.value;
				})
				.attr("data-type", function(d){
					return d.name;
				})
				.text(function(d){
					return d.name;
				});
	}

	function getNumberOfProperities(object){
		var count = 0;
		var property = null;
		if (typeof object === "object"){
			for (property in object){
				if (object.hasOwnProperty(property)){
					count++;
				}
			}
			return count;
		} else {
			return 0;
		}
	}

	function calculateWeaponsMinMax(data){
		data.forEach(function (element, index){
			for (property in element){
				if (element.hasOwnProperty(property) && weaponsDomain.min.hasOwnProperty(property)){
					weaponsDomain.min[property] = Math.min(weaponsDomain.min[property], element[property]);
					weaponsDomain.max[property] = Math.max(weaponsDomain.max[property], element[property]);
				}
			}
		});
	} 

	/*
		showData: range, heat, weight, cooldown, duration, speed, impulse, heat_penalty, price (cb), duration, dps, hps
		sortBy: ascending, descending, byName, 
	*/
	function drawWeapons(showData){
		
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
			var weaponsLinesRange = weaponsLines.append("div")
				.attr("class","data range");

			weaponsLinesRange.append("div")
				.attr("class","range-min")
				.style("width", function(d,i){
						return (d.min_range/weaponsDomain.max.max_range)*100 + "%";

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
					return ((d.long_range - d.min_range)/weaponsDomain.max.max_range)*100 + "%";

				})
				.text(function(d){
					return d.long_range;
				});
			weaponsLinesRange.append("div")
				.attr("class","range-max")
				.style("width", function(d,i){
					return ((d.max_range - d.long_range)/weaponsDomain.max.max_range)*100 + "%";

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
			var weaponsLinesTonage = weaponsLines.append("div")
				.attr("class","data");
			weaponsLinesTonage.append("div")
				.attr("class","tonnage")
				.style("width", function(d){
					return (d.tons/weaponsDomain.max.tons)*100 + "%";
				})
				.text(function(d){
					return (d.tons);
				});
		}
	}


	function hasAnyParentClass(element, classname) {
		if (element.className && element.className.split(' ').indexOf(classname)>=0) return true;
	    if (element.parentNode){
	    	return hasAnyParentClass(element.parentNode, classname);
	    } else {
	    	return false;
	    }
	}

	$(document).on("click", ".filter", function(){
		var selected = false;
		toggleFilter($(this).attr("data-type"));
		drawWeapons("range");
	});

	function toggleFilter(type){
		for (var a = 0; a < weaponsFilter.length; a++){
			if (weaponsFilter[a].hasOwnProperty(type)){
				console.log(type, (weaponsFilter[a])[type]);
				(weaponsFilter[a])[type] = !(weaponsFilter[a])[type];
			} 
		}
		console.log(weaponsFilter);
		drawFilters();
	}
});