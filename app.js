import {parseRecr} from './surecr.js';
import {pepPlot, timePlot} from './plots.js';
import {sumaryTable} from './display.js';

document.body.innerHTML = "<h1>Titration de la PEP</h1>";
var filesSelector = document.createElement('input');
filesSelector.type = 'file';
filesSelector.id = 'suvedFilesSelect';
filesSelector.multiple = true;

filesSelector.addEventListener("change", fileInputHandler);
document.body.appendChild(filesSelector);

function fileInputHandler(e){ 
	//this.filesList.innerHTML = null;
	//var nfiles = e.target.files.length;	
	console.log(e.target);
	let reader = new FileReader();

	reader.onload = e=>{
		var ds = parseRecr(e.target.result);
		document.body.append(report(ds));
	};

	reader.readAsText(e.target.files[0]);
}

/*
fetch('recr1.txt')
	.then(responce=>responce.text())
	.then(text=>{
		const recr = parseRecr(text);
		document.body.append(report(recr));
	});
*/

function report(recr){
	var rDiv = document.createElement("article");
	rDiv.className = "surecrRepport";
	rDiv.append(datePar(recr.date));

	rDiv.append(sumaryTable(recr));

	const grDiv = document.createElement("div");
	grDiv.id = "grDiv";
	grDiv.append(timePlot(recr, "PEP"));
	grDiv.append(pepPlot(recr, "Cst"));
	grDiv.append(pepPlot(recr, "IS"));
	rDiv.append(grDiv);

	rDiv.append(signBlock());
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
