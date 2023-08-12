export function sumaryTable(recr){
	const headers = [
		'PEP',
		'P<sub>motrice</sub> <sup>*</sup>',
		'C<sub>st</sub> <sup>*</sup>',
		'Ind. de stress <sup>*</sup>',
		"Commentaire"
	];

	const params = [
			{param: 'Pmotrice', precision: 1},
			{param: 'Cst', precision: 1},
			{param: 'IS', precision: 2}
		];

	var table = document.createElement("table");
	var tblHead = document.createElement("thead");
	table.append(tblHead);

	for(var header of headers){
		let th = document.createElement('th');
		th.innerHTML = header;
		tblHead.append(th);
	}

	var tblBody = document.createElement("tbody");
	for(var row of recr.sumary){
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.textContent = row.PEP;
		tr.append(td);

		for(var header of params){
			var td = document.createElement('td');
			td.textContent = fmtDat(row, header.param, header.precision);
			tr.append(td);
		}
		var td = document.createElement('td');
		tr.append(td);

		tblBody.append(tr);
	}
	table.append(tblBody);

	var cpt = document.createElement("caption");
	cpt.textContent = "* Valeur ± écart type";
	table.append(cpt);
	return table;
}

function fmtDat(row, param, precision){
	return row['mean' + param].toFixed(precision)
		+ ' ± '
		+ row['sd' + param].toFixed(precision);
}
