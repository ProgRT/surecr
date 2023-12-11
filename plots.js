import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";

export function timePlot(recr, param){
		return Plot.plot({
			grid:true,
			width: 7.2*96,
			height: 1.3*96,
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
			height: 3.1*96,
			y: {label: param},
			x: {label: "PEP (cmH₂O)"},
			marks: [
				Plot.boxY(recr, {
					x: "PEProunded",
					y: param,
					insetLeft:  10,
					insetRight: 10
				})
			]
		});
}
