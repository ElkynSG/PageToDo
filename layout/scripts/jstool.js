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
    }

    var tabla   = document.createElement("table");
    tabla.setAttribute("id","tableta");

    // ***************  crear header     ************************
    var tbthead = document.createElement("thead");
    var hilera = document.createElement("tr");
    for (var i = 0; i < headers.length; i++) 
    {
        var celda = document.createElement("th");
        var textoCelda = document.createTextNode(headers[i]);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);
    }
    tbthead.appendChild(hilera);
    //***********************************************************

    //*********   se crea la lineas  ****************************
    var tblBody = document.createElement("tbody");
    for (var i = 0; i < matrizData.length; i++) 
    {
      if(matrizData[i][0]==null)
        break;
      var textoCelda;
      var hilera = document.createElement("tr");
      for (var j = 0; j < matrizData[0].length; j++)
      {
        var celda = document.createElement("td");
        var textFinal = "";
        if(matrizData[i][j].length > 50)
        {
            console.log("length "+matrizData[i][j].length);

            var divText = Math.floor(matrizData[i][j].length/50) ;
            if(matrizData[i][j].length%50 != 0)
            {
                divText++;
            }
            console.log("divText "+divText);

            for(var h=0; h<divText; h++)
            {
                textFinal = textFinal + matrizData[i][j].substring(h*50,h*50+50) + " ";
                console.log("text "+h+" "+textFinal);
            }

            //textoCelda = document.createTextNode(textFinal);
            //celda.appendChild(textoCelda);
            var txtSplit =  textFinal.split(' ');
            console.log("longitud "+txtSplit.length);
            for(var f=0;f< txtSplit.length;f++)
            {
                var textoCelda = document.createTextNode(txtSplit[f]);
                celda.appendChild(textoCelda);
                var salto = document.createElement("br");
                celda.appendChild(salto);
            }
            


        }else{
            textoCelda = document.createTextNode(matrizData[i][j]);
            celda.appendChild(textoCelda);
        }
       
        hilera.appendChild(celda);
      }
 
      tblBody.appendChild(hilera);
    }
  //***********************************************************
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

        stag = hex2a(dataIn.substring(pos, pos+4));
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