var btDecodeTEF = document.getElementById("btDecodeTef");
var tef = document.getElementById("textTEF");

//  varia
function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
////////////////

function genera_tabla(idBody, headers, matrizData) {
  // Obtener la referencia del elemento body
  var body = document.getElementById(idBody);

  const tablaTemp = document.getElementById("tableta");
  //var tablaTemp = document.getElementsByTagName("table");
  if (tablaTemp != null) {
    tablaTemp.parentNode.removeChild(tablaTemp);
  }

  var tabla = document.createElement("table");
  tabla.setAttribute("id", "tableta");

  // ***************  crear header     ************************
  var tbthead = document.createElement("thead");
  var hilera = document.createElement("tr");
  for (var i = 0; i < headers.length; i++) {
    var celda = document.createElement("th");
    var textoCelda = document.createTextNode(headers[i]);
    celda.appendChild(textoCelda);
    hilera.appendChild(celda);
  }
  tbthead.appendChild(hilera);
  //***********************************************************

  //*********   se crea la lineas  ****************************
  var tblBody = document.createElement("tbody");
  for (var i = 0; i < matrizData.length; i++) {
    if (matrizData[i][0] == null) break;
    var textoCelda;
    var hilera = document.createElement("tr");
    for (var j = 0; j < matrizData[0].length; j++) {
      var celda = document.createElement("td");
      var textFinal = "";
      if (j == 2) {
        // DATA HEXA
        celda.style.wordBreak = "break-all";
      }
      if (j == 3) {
        // DATA ASCII
        celda.style.whiteSpace = "normal";
        celda.style.wordBreak = "break-word";
      }
      celda.textContent = matrizData[i][j];

      hilera.appendChild(celda);
    }

    tblBody.appendChild(hilera);
  }
  //***********************************************************
  tabla.appendChild(tbthead);
  tabla.appendChild(tblBody);
  body.appendChild(tabla);
}

function decoderTEF(dataIn) {
  var mData = new Array(100);
  for (var i = 0; i < dataIn.length; i++) {
    mData[i] = new Array(4);
  }
  if (dataIn.length % 2 != 0 || dataIn.length < 8) {
    alert("DATOS INCORRECTOS");
    console.log("else " + (dataIn.length % 2));
    return null;
  }
  var pos = 0;
  var i = 0;
  for (pos; pos < dataIn.length; pos++) {
    console.log("--------- ");
    var stag;
    var len;
    var sHexa;
    var sAscii;

    console.log("pos+8 " + pos + " len " + dataIn.length);
    if (pos + 8 > dataIn.length) {
      console.log("retornamos ");
      break;
    }

    stag = hex2a(dataIn.substring(pos, pos + 4));
    console.log("tag " + stag);
    mData[i][0] = stag;

    len = parseInt(dataIn.substring(pos + 4, pos + 8), 16) * 2;
    console.log("len " + len);
    mData[i][1] = len / 2;

    pos = pos + 8;
    sHexa = dataIn.substring(pos, pos + len);
    console.log("hexa " + sHexa);
    mData[i][2] = sHexa;

    sAscii = hex2a(sHexa);
    console.log("ascii " + sAscii);
    mData[i][3] = sAscii;

    pos = pos + len;

    pos++;

    console.log("--------- ");
    i++;
  }
  return mData;
}

//  EVENTOS

function decorderTEFEvent() {
  var header = new Array(4);
  header[0] = "TAG";
  header[1] = "SIZE";
  header[2] = "DATA HEXA";
  header[3] = "DATA ASCII";
  var tabla = decoderTEF(tef.value);
  console.log(tabla);
  if (tabla != null) {
    genera_tabla("tablaTEF", header, tabla);
  }
}
btDecodeTEF.addEventListener("click", decorderTEFEvent, true);

function mostrarSeccion(tipo) {
  var secciones = document.getElementsByClassName("seccion");

  for (var i = 0; i < secciones.length; i++) {
    secciones[i].style.display = "none";
  }

  document.getElementById("seccion-" + tipo).style.display = "block";
}

function validarPAN(pan) {
  if (!pan) return false;

  // Eliminar espacios y guiones
  pan = pan.replace(/[\s-]/g, "");

  // Verificar que solo contenga números
  if (!/^\d+$/.test(pan)) return false;

  let suma = 0;
  let duplicar = false;

  // Recorrer desde la derecha
  for (let i = pan.length - 1; i >= 0; i--) {
    let digito = parseInt(pan.charAt(i), 10);

    if (duplicar) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }

    suma += digito;
    duplicar = !duplicar;
  }

  return suma % 10 === 0;
}

function generarPinBlockISO0(pan, pin) {
  // --- 1. Construir PIN FIELD ---
  // Formato: 0 + longitud PIN (hex) + PIN + F padding
  let pinLengthHex = pin.length.toString(16).toUpperCase();
  let pinField = "0" + pinLengthHex + pin;
  pinField = pinField.padEnd(16, "F");

  // --- 2. Construir PAN FIELD ---
  // Tomar 12 dígitos desde la derecha excluyendo el último (checksum)
  let pan12 = pan.slice(-13, -1);
  let panField = "0000" + pan12;

  // --- 3. XOR nibble por nibble ---
  let pinBlock = "";

  for (let i = 0; i < 16; i++) {
    let xor = parseInt(pinField[i], 16) ^ parseInt(panField[i], 16);
    pinBlock += xor.toString(16).toUpperCase();
  }

  return pinBlock;
}

function calcularPinblock() {
  const labePan = document.getElementById("la_pan");
  var pan = labePan.value;
  var pin = document.getElementById("la_pin").value;

  const error = document.getElementById("errorPan");

  console.log(pan);
  if (pan === "" || pin === "") {
    alert("Debe ingresar ambos valores");
    return;
  }

  if (pan.length < 13) {
    alert("PAN inválido");
  }

  var isCheckPan = validarPAN(pan);
  console.log(isCheckPan);
  if (isCheckPan == false) {
    error.style.display = "inline";
    labePan.style.border = "2px solid red";
  }

  var result = generarPinBlockISO0(pan, pin);

  document.getElementById("resultadoPinblock").innerText = result;
}

function hexStringToBytes(hexString) {
  // Eliminar espacios si vienen
  hexString = hexString.replace(/\s/g, "");

  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string inválido");
  }

  let bytes = [];

  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }

  return bytes;
}

function calcLRC(bytes) {
  let suma = 0;

  for (let i = 0; i < bytes.length; i++) {
    suma += bytes[i];
  }

  let lrc = (256 - (suma % 256)) % 256;

  return lrc;
}

function esHexadecimal(valor) {
  if (typeof valor !== "string") return false;

  return /^[0-9A-Fa-f]+$/.test(valor);
}

function calcularLRC() {
  var trama = document.getElementById("tramaLRC").value;

  console.log(trama);
  if (trama === "") {
    alert("Debe ingresar una trama");
    return;
  }

  if (trama.length % 2 != 0) {
    alert("Longitud Incorrecta");
    return;
  }

  if (esHexadecimal(trama) == false) {
    alert("Formato invalido");
    return;
  }

  var tramaBytes = hexStringToBytes(trama);
  var lrc = calcLRC(tramaBytes);

  document.getElementById("resultadoLRC").innerText = lrc.toString(16).toUpperCase();
}

function calcularXOR()
{
    var valor1 = document.getElementById("xor1").value.trim();
    var valor2 = document.getElementById("xor2").value.trim();

    if(valor1 === "" || valor2 === "")
    {
        alert("Debe ingresar ambos valores");
        return;
    }

    if(valor1.length !== valor2.length)
    {
        alert("Los valores deben tener la misma longitud");
        return;
    }

    var resultado = "";

    for(var i = 0; i < valor1.length; i += 2)
    {
        var byte1 = parseInt(valor1.substr(i, 2), 16);
        var byte2 = parseInt(valor2.substr(i, 2), 16);

        var xorByte = byte1 ^ byte2;

        var hex = xorByte.toString(16).toUpperCase();
        if(hex.length === 1)
            hex = "0" + hex;

        resultado += hex;
    }

    document.getElementById("resultadoXOR").innerText = resultado;
}
// 1234000a303031323435363738391Casdf0000
