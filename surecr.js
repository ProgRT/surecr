import {mean, deviation} from "https://cdn.jsdelivr.net/npm/d3-array/+esm";
export function parseRecr(text) {
  var headerText, headerLines, dataText, dataLines;
  [headerText, dataText] = text.split("[DATA]");
  var dataLines = dataText.split("\n");

  // ================================================
  // Parsing the informations relative to the dataset
  // ================================================

  var infos = headerText
    .trim()
    .split("\n")
    .slice(1)
    .filter((d) => /===/.test(d) == false)
    .map((l) => l.split("\t"))
    .map((t) => {
      return { Param: t[0], Value: t[1] };
    });

  var dataDate = parseSuDate(infos.filter((d) => d.Param == "Date")[0].Value);

  // ====================
  // Creating fields list
  // ====================

  var fields = dataLines[1]
    .split("\t")
    .map((d) => d.replace(/(.*)\(.*\)/, "$1").trim());

  // ==================
  // Parsing data lines
  // ==================

  const parseDataLine = (str) => {
    const isNumRE = /^[\d,\.]+$/;
    var o = {};
    var h, m, s;
    const t = str
      .trim()
      .split("\t")
      .map((s) => s.replace(",", "."));

    for (let i in t) {
      o[fields[i]] = isNumRE.test(t[i]) ? parseFloat(t[i]) : t[i];
    }
    o.PEProunded = Math.round(o.PEP);
    o.Cst = isNaN(o.Pmotrice) ? '"***"' : o.Vci/o.Pmotrice;
    return o;
  };

  var data = dataLines.slice(2, dataLines.length - 1).map(parseDataLine);
  const startTime = parseSuTime(data[0].Durée);
  data = data.map((d) => {
    d.Durée = parseSuTime(d.Durée, dataDate);
    return d;
  });

  // ===============================================
  // Removing data points with one single value
  // ===============================================
		
	data = data.filter(d=>{
		return data.filter(a=>a.PEProunded == d.PEProunded).length > 1;
	});

  // ===============================================
  // Creating the data sumary grouped by PEEP levels
  // ===============================================

	
  var sumary = sumarize(data);
  Object.defineProperty(data, "sumary", { value: sumary });
  Object.defineProperty(data, "infos", { value: infos });
  Object.defineProperty(data, "date", { value: dataDate });


  // =====================================
  // And then returning the parsed dataset
  // =====================================

  return data;
}

function parseSuTime(str, d){
  var h, m, s, time;
  [h, m, s] = str.split(":");

	time = new Date(d);
	time.setHours(h);
	time.setMinutes(m);
	time.setSeconds(s);
  return time;
}

function parseSuDate(string) {
  var dString, tString;
  var j, M, a, h, m, s;
  [dString, tString] = string.split(" ");
  [j, M, a] = dString.split("/");
  [h, m, s] = tString.split(":");
  return new Date(`20${a}/${M}/${j} ${h}:${m}:${s}`);
}

function sumarize(dataset) {
	const sumaryVariables = [
			"Fin PI", "Pmotrice",
			"Vci", "Vce",
			"Cst", "Cdyn",
			"FR", "IS",
	];

  var peps = getUnique(dataset, "PEProunded");
  var sumary = peps.map(p => {
    var subset = dataset.filter((d) => d.PEProunded == p);
		var row = {PEP: p, n: subset.length};

		for (let c of sumaryVariables) {
			row["mean"+c] = mean(subset, d => d[c]);
			row["sd"+c] = deviation(subset, d => d[c]);
		}

		return row;
  });

  return sumary.filter(d=>d.n>1);
}

function getUnique(dataset, column){
  return [...new Set(dataset.map(d=>d[column]))];
}
