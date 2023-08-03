export function sumaryTable(recr){
	var table = document.createElement("table");
	var tblHead = document.createElement("thead");
	table.append(tblHead);

	for(var header of ['PEP', 'P<sub>motrice</sub>', 'C<sub>st</sub>', 'Ind. de stress']){
		let th = document.createElement('th');
		th.innerHTML = header;
		tblHead.append(th);
	}

	var tblBody = document.createElement("tbody");
	for(var row of recr.sumary){
		var tr = document.createElement('tr');
		let td = document.createElement('td');
		td.textContent = row.PEP;
		tr.append(td);

		for(var header of [
			{param: 'Pmotrice', precision: 1},
			{param: 'Cst', precision: 1},
			{param: 'IS', precision: 2}
		]){
			let td = document.createElement('td');
			td.textContent = fmtDat(row, header.param, header.precision);
			tr.append(td);
		}

		tblBody.append(tr);
	}
	table.append(tblBody);
	return table;
}

function fmtDat(row, param, precision){
	return row['mean' + param].toFixed(precision)
		+ ' ± '
		+ row['sd' + param].toFixed(precision);
}
