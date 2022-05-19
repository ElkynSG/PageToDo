var btDecodeTEF = document.getElementById("btDecodeTef");
var tef = document.getElementById("textTEF");


//  varia
function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
////////////////

function genera_tabla(idBody,headers, matrizData) 
{
    // Obtener la referencia del elemento body
    var body = document.getElementById(idBody);

    const tablaTemp = document.getElementById("tableta");
    //var tablaTemp = document.getElementsByTagName("table");
    if(tablaTemp != null)
    {
        tablaTemp.parentNode.removeChild(tablaTemp);
        //tablaTemp.remove();
    }

    var tabla   = document.createElement("table");
    tabla.setAttribute("id","tableta");


    // Crea un elemento <table> y un elemento <thead>
    var tbthead = document.createElement("thead");

    // Crea los header de la tabla
    var hilera = document.createElement("tr");
    for (var i = 0; i < headers.length; i++) 
    {
        var celda = document.createElement("th");
        var textoCelda = document.createTextNode(headers[i]);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);
    }
    // agrega la hilera al final de la tabla (al final del elemento tbthead)
    tbthead.appendChild(hilera);

    // Crea un elemento <table> y un elemento <tbody>
    var tblBody = document.createElement("tbody");
  
    // Crea las celdas
    for (var i = 0; i < matrizData.length; i++) {
      // Crea las hileras de la tabla
      if(matrizData[i][0]==null)
        break;

      var hilera = document.createElement("tr");
      for (var j = 0; j < matrizData[0].length; j++) {
        // Crea un elemento <td> y un nodo de texto, haz que el nodo de
        // texto sea el contenido de <td>, ubica el elemento <td> al final
        // de la hilera de la tabla
        var celda = document.createElement("td");
        var textoCelda = document.createTextNode(matrizData[i][j]);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);
      }
      // agrega la hilera al final de la tabla (al final del elemento tblbody)
      tblBody.appendChild(hilera);
    }
  
    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tbthead);
    tabla.appendChild(tblBody);
    body.appendChild(tabla);
}

function decoderTEF(dataIn)
{
    var mData = new Array(100);
    for(var i =0; i < dataIn.length; i++)
    {
        mData[i]=new Array(4);
    }
    if(dataIn.length%2 != 0 || dataIn.length < 8)
    {
        alert('DATOS INCORRECTOS');
        console.log("else "+dataIn.length%2);
        return null;
    } 
    var pos = 0;
    var i = 0;
    for(pos;pos<dataIn.length;pos++)
    {
        console.log("--------- ");
        var stag;
        var len;
        var sHexa;
        var sAscii;

        console.log("pos+8 "+pos+" len "+dataIn.length);
        if(pos+8 > dataIn.length)
        {
            console.log("retornamos ");
           break;
        }

        stag = dataIn.substring(pos, pos+4);
        console.log("tag "+stag); 
        mData[i][0]=stag;

        len = parseInt(dataIn.substring(pos+4, pos+8),16)*2;
        console.log("len "+len);
        mData[i][1]=len;

        pos = pos+8;
        sHexa = dataIn.substring(pos, pos+len);
        console.log("hexa "+sHexa);
        mData[i][2]=sHexa;

        sAscii = hex2a(sHexa);
        console.log("ascii "+sAscii);
        mData[i][3]=sAscii;

        pos = pos+len;
        
        pos++;

        console.log("--------- ");
        i++;
    }
    return mData;
}

//  EVENTOS


function decorderTEFEvent()
{
    var header = new Array(4);
    header[0] = "TAG";
    header[1] = "LONGITUD";
    header[2] = "DATA HEXA";
    header[3] = "DATA ASCII";
    var tabla = decoderTEF(tef.value);
    console.log(tabla);
    if(tabla != null)
    {
        genera_tabla("tablaTEF",header, tabla)
    }
    
}
btDecodeTEF.addEventListener("click",decorderTEFEvent,true);
    
// 1234000a303031323435363738391Casdf0000