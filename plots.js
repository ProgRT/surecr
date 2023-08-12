import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";

export function timePlot(recr, param){
		return Plot.plot({
			grid:true,
			width: 8*96,
			height: 1.7*96,
			x: {label: "Temps", type: "utc", tickFormat: x=>x.toLocaleTimeString("fr-ca", {timeStyle: "short"})},
			marks: [
				Plot.line(recr, {x: d=>d.Durée, y: param}),
			]
		});
}

export function pepPlot(recr, param){
		return Plot.plot({
			grid:true,
			width: 3.5*96,
			height: 3.2*96,
			y: {label: param},
			marks: [
				Plot.line(recr.sumary, {x: "PEP", y: "mean" + param}),
				Plot.dot(recr.sumary, {x: "PEP", y: "mean" + param, fill: "white", r: 20}),
				Plot.dot(recr, {x: "PEP", y: param}),
			]
		});
}
