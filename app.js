import {parseRecr} from './surecr.js';
import {report} from "./report.js";

const urlparams = new URLSearchParams(window.location.search);

	const	allTimeSeries =  [
			"PEP",
			"Fin PI",
			"Pmotrice",
			"Vci",
			"Vce",
			"Cst",
			"Cdyn",
			"FR",
			"IS",
			"I:E"
		];

	const	allPeepSeries = [
			"Fin PI",
			"Pmotrice",
			"Vci",
			"Vce",
			"Cst",
			"Cdyn",
			"FR",
			"IS",
		];

var reportConf = {
	timeSeries: [
		"PEP",
	],
	peepSeries: ["Cst", "IS" ],
	table: {
		params : [
			{param: 'PEP'},
			{param: 'Pmotrice', precision: 1, title: 'P<sub>motrice</sub> <sup>*</sup>'},
			{param: 'Cst', precision: 1, title: 'C<sub>st</sub> <sup>*</sup>'},
			{param: 'Cdyn', precision: 1, title: 'C<sub>dyn</sub> <sup>*</sup>'},
			{param: 'IS', precision: 2, title: 'Ind. de stress <sup>*</sup>'},
			{title: "Commentaire"}
		],
		tblCaptText: "* Valeur ± écart type",
	}
}

if(urlparams.has('su')){
	var reportConf = {
		timeSeries: allTimeSeries,
		peepSeries: allPeepSeries,
		table: {
			params : [
				{param: 'PEP'},
				{param: 'Pmotrice', precision: 1, title: 'P<sub>motrice</sub> <sup>*</sup>'},
				{param: 'Cst', precision: 1, title: 'C<sub>st</sub> <sup>*</sup>'},
				{param: 'Cdyn', precision: 1, title: 'C<sub>dyn</sub> <sup>*</sup>'},
				{param: 'IS', precision: 2, title: 'Ind. de stress <sup>*</sup>'},
				{title: "Commentaire"}
			],
			tblCaptText: "* Valeur ± écart type",
		}
	}
}

function display(dataset){
	document.querySelectorAll(".surecrRepport").forEach(d=>d.remove());
	document.querySelector("#content").append(report(dataset, reportConf));
	document.querySelector("#page").classList.remove("hidden");

	if(urlparams.has('logKeys')){
		console.log(Object.keys(dataset[0]));
		console.log(Object.keys(dataset.sumary[0]));
		console.table(dataset.sumary);
	}
}

// **********************************
// Handlers for primary form controls
// **********************************

function fileInputHandler(e){ 
	let reader = new FileReader();
	reader.onload = evt => display(parseRecr(evt.target.result));
	reader.readAsText(e.target.files[0]);
}

function headInputHandler(evt) {
	var url = URL.createObjectURL(evt.target.files[0]);
	var img = document.createElement("img");
	img.src = url;
	img.id = "repportHead";
	document.querySelectorAll("#repportHead").forEach(d=>d.remove());
	document.querySelector("#repport").prepend(img);
	document.querySelector("#page").classList.remove("hidden");
}

function footInputHandler(evt) {
	var url = URL.createObjectURL(evt.target.files[0]);
	var img = document.createElement("img");
	img.src = url;
	img.id = "repportFoot";
	document.querySelectorAll("#repportFoot").forEach(d=>d.remove());
	document.querySelector("#repport").append(img);
	document.querySelector("#page").classList.remove("hidden");
}

document.querySelector("#suvedFilesSelect")
	.addEventListener("change", fileInputHandler);

document.querySelector("#headSelect")
	.addEventListener("change", headInputHandler); 

document.querySelector("#footSelect")
	.addEventListener("change", footInputHandler); 

// ***************************
// Demo mode to speed up tests
// ***************************

if(urlparams.has('demo')){
	fetch('recr1.txt').then(responce=>responce.text())
		.then(text => display(parseRecr(text)) );
}
