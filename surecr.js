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
    o.Cst = isNaN(o.Pmotrice) ? '"***"' : o.Cdyn;
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
	/*
  time = 3600 * h + 60 * m + 1 * s;
  time -= isNaN(starttime) ? 0 : starttime;
	*/
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
  //return new Date(`20${a}/${M}/${j}`);
}

function sumarize(dataset) {
  var peps = getUnique(dataset, "PEProunded");
  var sumary = peps.map(p => {
    var subset = dataset.filter((d) => d.PEProunded == p);
    return {
      PEP: p,
      meanIS: mean(subset, d => d.IS),
      sdIS: deviation(subset, (d) => d.IS),
      meanCst: mean(subset, (d) => d.Cst),
      sdCst: deviation(subset, (d) => d.Cst),
      meanPmotrice: mean(subset, (d) => d.Pmotrice),
      sdPmotrice: deviation(subset, (d) => d.Pmotrice),
			n: subset.length
    };
  });

  return sumary.filter(d=>d.n>1);
}

function getUnique(dataset, column){
  return [...new Set(dataset.map(d=>d[column]))];
}
