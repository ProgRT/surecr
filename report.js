import {pepPlot, timePlot} from './plots.js';
import {sumaryTable} from './display.js';

export function report(recr, conf){
	// Éléments à configurer:
	// - Colones du tableau
	// - graphiques *temps*
	// - graphiques *PEP*
	
	var rDiv = document.createElement("article");
	rDiv.className = "surecrRepport";
	rDiv.append(datePar(recr.date));

	//console.log(conf.table);
	rDiv.append(sumaryTable(recr, conf.table));

	const grDiv = document.createElement("div");
	grDiv.id = "grDiv";


	//grDiv.append(timePlot(recr, "PEP"));
	if(conf.timeSeries){
		for(var param of conf.timeSeries){
			grDiv.append(timePlot(recr, param));
		}
	}

	if(conf.timeSeries){
		for(var param of conf.peepSeries){
			grDiv.append(pepPlot(recr, param));
		}
	}

	rDiv.append(grDiv);

	//rDiv.append(signBlock());
	return rDiv;
}

function signBlock(){
	var sDiv = document.createElement("div");
	sDiv.id = "sDiv";

	sDiv.append(spanSignature("Signature du proffessionnel"));
	sDiv.append(spanSignature("Date et heure"));
	return sDiv;
}

function spanSignature(label){
	var spanSignature = document.createElement("span");
	spanSignature.className = "spanSignature";
	spanSignature.textContent = label;
	return spanSignature;
}

function datePar(date){
	const param = {dateStyle: "short", timeStyle: "short"};
	var datePar = document.createElement("p");
	datePar.textContent = date.toLocaleString("fr-ca", param);
	return datePar;
}
