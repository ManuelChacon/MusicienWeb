function NotNullNotUndefinedNotEmpty(val) {
  if (val !== null && val !== undefined && val !== "") {
      return true;
    } else {
      return false;
    }
}
function VacioSiUndefined(val) {
  if (NotNullNotUndefinedNotEmpty(val)) {
    return val;
  } else {
    return "";
  }
}
function Publicacion() {
  this.IDPublicacion = 0;
  this.Titulo = "";
  this.Subtitulo = "";
  this.Descripcion = "";
  this.ContenidoMM = "";
  this.ContenidoMMAlt = "";
  this.Tipo = "";
  this.ContenidoMMAlt = "";
  this.IDUsuario = 0;
  this.IDUsuarioCategoria = 0;
}
function FiltrosBusqueda() {
  this.Cadena = "";
  this.FechaDesde = "";
  this.FechaHasta = "";
  this.Orden = "F";
  this.Asc = false;
  this.CampoInutil = "";
  this.IDUsuario = 0;
  this.Categorias = [];
  this.TipoPubli = [];
}
function Categoria() {
  this.IDCategoria = 0;
  this.Descripcion = "";
  this.Propiedades = [];
}
function TipoObjeto() {
  this.IDTipoObjeto = 0;
  this.NombreTipoObjeto = "";
  this.DescripcionAyuda = "";
  this.DescripcionEnPerfil = "";
  this.DescripcionPregunta = "";
  this.DescripcionTipoObjeto = "";
}
reemplazos = [
  { ori: "á", dest: "a" },
  { ori: "é", dest: "e" },
  { ori: "í", dest: "i" },
  { ori: "ó", dest: "o" },
  { ori: "ú", dest: "u" },
  { ori: "ñ", dest: "n" },
  { ori: " ", dest: "_" },
]
function transformarEnRuta(titular) {
  titular = titular.toLowerCase();
  for (i = 0; i < reemplazos.length; i++) {
    titular = titular.replace(reemplazos[i].ori,reemplazos[i].dest);
  }
  titular = titular.replace(/[^a-zA-Z0-9]/g,'_');
  return titular;
}
function TransformarFechaParaServicio(fecha, hora) {
  if (NotNullNotUndefinedNotEmpty(fecha)) {
    try {
      mes = +(fecha.getMonth())+1;
      if (fecha.getUTCDate() > 30) {
        dia = 1;
      } else {
        dia = +(fecha.getUTCDate())+1;
      }

      FechaConstruida = fecha.getFullYear() + "-" + mes + "-" + dia + "T" + hora;
    } catch(ex) {
      console.log(ex);
      FechaConstruida = fecha;
    }
    finally {
        return FechaConstruida;
    }
  } else {
    return "";
  }

}
function TransformarFecha(fechafea) {
  if (NotNullNotUndefinedNotEmpty(fechafea)) {
    fecha = fechafea.split("T")[0];
    hora = fechafea.split("T")[1];
    fechan = fecha.split("-");
    newfecha = fechan[2] + "/" + fechan[1] + "/" + fechan[0];
    var res = { Fecha: newfecha, Hora: hora }
    return res;
  } else {
    return {Fecha: "", Hora: "" }
  }

}
function Aleatorio(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}