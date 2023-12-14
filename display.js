export function sumaryTable(recr, conf){

	const defaults = {
		tblCaptText: "* Valeur ± écart type",
		params : [
			{param: 'PEP'},
			{param: 'Pmotrice', precision: 1, title: 'P<sub>motrice</sub> <sup>*</sup>'},
			{param: 'Cst', precision: 1, title: 'C<sub>st</sub> <sup>*</sup>'},
			{param: 'Cdyn', precision: 1, title: 'C<sub>dyn</sub> <sup>*</sup>'},
			{param: 'IS', precision: 2, title: 'Ind. de stress <sup>*</sup>'},
			{title: "Commentaire"}
		],
	};

	if (conf && conf.params) { var params = conf.params; }
	else {var params = defaults.params}

	if (conf && "tblCaptText" in conf) {
		var tblCaptText = conf.tblCaptText
		console.log("tblCaptText form conf");
	}
	else {var tblCaptText = defaults.tblCaptText}

	var table = document.createElement("table");
	var tblHead = document.createElement("thead");
	table.append(tblHead);

	for(var p of params){
		let th = document.createElement('th');
		th.innerHTML = p.title ? p.title : p.param;
		tblHead.append(th);
	}

	var tblBody = document.createElement("tbody");
	for(var row of recr.sumary){
		var tr = document.createElement('tr');

		for(var p of params){
			var td = document.createElement('td');
			if(p.param){
				td.textContent = p.precision ? fmtDat(row, p.param, p.precision) : row[p.param];
			}
			tr.append(td);
		}

		tblBody.append(tr);
	}
	table.append(tblBody);

	if(tblCaptText != ""){
		var cpt = document.createElement("caption");
		cpt.textContent = tblCaptText;
		table.append(cpt);
	}
	return table;
}

function fmtDat(row, param, precision){
		return row['mean' + param].toFixed(precision)
			+ ' ± '
			+ row['sd' + param].toFixed(precision);
}
