musicien.controller('listadopublicaciones', function ($scope, Llamada, $location) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("PublicacionesLeerAdmin?IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        console.log(respuesta.data);
        $scope.publis = respuesta.data;
      })
  }
  $scope.claseFijada = function(val) {
    if (val > 0) {
      return "fa fa-lock";
    } else {
      return "fa fa-unlock";
    }
  }
  $scope.transformarFecha = function(fecha) {
    return TransformarFecha(fecha);
  }
  $scope.estaFijado = function(publicacion) {
    if (publicacion.Fijado > 0) {
      return true;
    } else {
      return false;
    }
  }
  $scope.publicacionesFijar = function() {
    var newpublis = []
    console.log($scope.publis);
    for (i = 0; i < $scope.publis.Publicaciones.length; i++) {
      console.log($scope.publis.Publicaciones[i]);
      if ($scope.publis.Publicaciones[i].Cambiada === true) {
        newpublis.push($scope.publis.Publicaciones[i]);
      }
    }
    console.log(newpublis);
    var object = { Publicaciones: newpublis }
    Llamada.http.post("PublicacionesFijar?IDIdioma=" + getIdioma(), object)
      .then(function(respuesta) {
        console.log(respuesta);
        Llamada.http.get("PublicacionesLeerAdmin?IDIdioma=" + getIdioma())
          .then(function(respuesta) {
            console.log(respuesta.data);
            $scope.publis = respuesta.data;
            mensajeExito("Se han guardado los cambios.");
          })
      })
  }
  $scope.cambiarFijacion = function(publicacion) {
    publicacion.Cambiada = true;
    $scope.fijando = true;
    if (publicacion.Fijado > 0) {
      publicacion.Fijado = 0;
    } else {
      publicacion.Fijado = 1;
    }
  }
  $scope.eliminarPublicacion = function(publicacion, index) {
    result = DevExpress.ui.dialog.confirm("¿Seguro que deseas eliminar esta publicación?");
    result.then(function(val) {
      if (val) {
        Llamada.http.get("PublicacionesEliminar?IDPublicacion=" + publicacion.IDPublicacion)
          .then(function(respuesta) {
            $scope.publis.Publicaciones.splice(index,1);
          })
      }
    });

    }
  $scope.modificarPublicacion = function(publicacion) {
    $location.path("publicar/" + publicacion.IDPublicacion);
    $scope.tareasAdicionalesCambioPag();
  }
});
musicien.controller('previsualizar', function($scope, $http, $location, $q, configuracionGlobal, $uibModalInstance,Publicacion, Llamada) {
  $scope.publicacion = Publicacion.Modal.get()
  console.log($scope.publicacion)
  console.log("ESTOY AQUI COÑOOO")
  $scope.publicacion.Usuario = { DataContenidoMM: '../img/defaultprofile.png' }

  $scope.ok = function() {
    $uibModalInstance.close("hola");
  }
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
  $scope.tipoPublicacion = function(tipo,publicacion) {
      return publicacion.Tipo==tipo;
  }
  $scope.condicionesSeguir = function(usuario) {
    return true;
  }
  $scope.esTipoPropiedad = function(tipo1, tipo2) {
    return tipo1==tipo2;
  }
  $scope.asdf = function() {
    return "holi";
  }
  $scope.NotNull = function() {
    return true;
  }
  $scope.cargarAltDe = function(propiedad) {
    if (propiedad.AltCargado !== false) {
      propiedad.AltCargado = true;
      if (NotNullNotUndefinedNotEmpty(propiedad.Valor)) {
        switch (propiedad.TipoValor) {
          case "V":
            propiedad.DataValor = configuracionGlobal.api_url + "/VerVideo?filename=" + propiedad.Valor;
            break;
            case "S":
              propiedad.DataValor = configuracionGlobal.api_url + "/ObtenerSonido?filename=" + propiedad.Valor;
              break;
          default:
            propiedad.DataValor = "Error";
        }
      }

      //propiedad.DataValor = configuracionGlobal.api_url + "/DownloadFile?fileName=" + propiedad.Valor + "&Tipo=" + propiedad.TipoValor;
      /*Llamada.http.getArrayByte(publicacion.ContenidoMMAlt, publicacion.Tipo)
        .then(function(respuesta) {

          publicacion.DataContenidoMMAlt = "http://nsd2012/Desarrollo/dsWASMusic/DownloadFile?fileName=" + publicacion.ContenidoMMAlt + "&Tipo=" + publicacion.Tipo;
        /*})*/
    }
  }
  $scope.cargarPlaylist = function(propiedad, publicacion) {
      propiedad.PlaylistCargado = true;
      if (NotNullNotUndefinedNotEmpty(propiedad.Valor)) {
        var tipo = "";
        var url = "";
        try {
          var a = propiedad.Valor.split("%%%");
          tipo = a[0];
          url = a[1];
        } catch (ex) {
          alert("Excepción!");
        }
        propiedad.TipoPlaylist = tipo;
        propiedad.URLPlaylist = url;
        if (propiedad.TipoPlaylist == "SP") {
          playlistspotify = document.createElement("iframe");
          playlistspotify.src = "https://open.spotify.com/embed?uri=" + url;
          playlistspotify.width = "100%";
          playlistspotify.height = "300";
          playlistspotify.frameborder = "0";
          playlistspotify.allowtransparency = "true";
          document.getElementById("playlist" + publicacion.IDPublicacion + "propi" + propiedad.IDPropiedad + "re" + publicacion.IDRePublicacion).appendChild(playlistspotify);
          //playlistspotify = "<iframe src='https://open.spotify.com/embed?uri=spotify:album:" + url + " width='100%' height='300' frameborder='0' allotransparency='true'></iframe>"
          //propiedad.ElementoHTML = $sce.trustAsHtml(playlistspotify);


        }

        if (propiedad.TipoPlaylist == "SC") {
          soundcloud = document.createElement("iframe");
          soundcloud.width = "100%";
          soundcloud.height = "166";
          soundcloud.scrolling="no";
          soundcloud.frameborder="no";
          soundcloud.src = url;
          document.getElementById("playlist" + publicacion.IDPublicacion + "propi" + propiedad.IDPropiedad + "re" + publicacion.IDRePublicacion).appendChild(soundcloud);
        }
      }
    }
    $scope.cargarImagenPropiedad = function(propiedad) {
      if (!NotNullNotUndefinedNotEmpty(propiedad.newFile)) {
        propiedad.Cargada = true;
        Llamada.http.getArrayByte(propiedad.Valor, "I")
          .then(function(respuesta) {
            propiedad.DataValor = respuesta.data;
          });
      } else {
        propiedad.DataValor = propiedad.Valor;
        propiedad.Cargada = true;
      }

    }
});

musicien.controller('listadopublicacionesusuarios', function ($scope, Llamada, $location) {
  $scope.pagina = 0;
  $scope.publis = [];
  if ($scope.protectedRoute()) {
    Llamada.http.get("PublicacionesLeer?IDUsuarioLector=&IDInicio=&tamPag=10&IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        if (respuesta.data.length < 1) {
          anadirErrores("No hay más resultados que mostrar");
        } else {
          $scope.publis.push(respuesta.data);
        }
      })
  }
  $scope.paginaSiguiente = function() {
    var a = parseInt(JSON.parse(JSON.stringify("" + $scope.pagina)));
    b = +(a)+1;
    if (NotNullNotUndefinedNotEmpty($scope.publis[b])) {
      $scope.pagina++;
    } else {
      var idInicio = $scope.publis[a][$scope.publis[a].length-1].IDPublicacion;
      Llamada.http.get("PublicacionesLeer?IDUsuarioLector=&IDInicio=" + idInicio +"&tamPag=10&IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          if (respuesta.data.length < 1) {
            anadirErrores("No hay más resultados que mostrar");
          } else {
            $scope.publis.push(respuesta.data);
            $scope.pagina++;
          }
        })
    }
  }
  $scope.paginaAnterior = function() {
    if ($scope.pagina > 0) {
      $scope.pagina--;
    } else {
      anadirErrores($scope.lang.atras_error);
    }
  }
  $scope.claseFijada = function(val) {
    if (val > 0) {
      return "fa fa-lock";
    } else {
      return "fa fa-unlock";
    }
  }
  $scope.transformarFecha = function(fecha) {
    return TransformarFecha(fecha);
  }
  $scope.estaFijado = function(publicacion) {
    if (publicacion.Fijado > 0) {
      return true;
    } else {
      return false;
    }
  }
  $scope.publicacionesFijar = function() {
    var newpublis = []
    console.log($scope.publis);
    for (i = 0; i < $scope.publis.Publicaciones.length; i++) {
      console.log($scope.publis.Publicaciones[i]);
      if ($scope.publis.Publicaciones[i].Cambiada === true) {
        newpublis.push($scope.publis.Publicaciones[i]);
      }
    }
    console.log(newpublis);
    var object = { Publicaciones: newpublis }
    Llamada.http.post("PublicacionesFijar?IDIdioma=" + getIdioma(), object)
      .then(function(respuesta) {
        console.log(respuesta);
        Llamada.http.get("PublicacionesLeerAdmin?IDIdioma=" + getIdioma())
          .then(function(respuesta) {
            console.log(respuesta.data);
            $scope.publis = respuesta.data;
            mensajeExito("Se han guardado los cambios.");
          })
      })
  }
  $scope.cambiarFijacion = function(publicacion) {
    publicacion.Cambiada = true;
    $scope.fijando = true;
    if (publicacion.Fijado > 0) {
      publicacion.Fijado = 0;
    } else {
      publicacion.Fijado = 1;
    }
  }
  $scope.eliminarPublicacion = function(publicacion, index) {
    result = DevExpress.ui.dialog.confirm("¿Seguro que deseas eliminar esta publicación?");
    result.then(function(val) {
      if (val) {
        Llamada.http.get("PublicacionesEliminar?IDPublicacion=" + publicacion.IDPublicacion)
          .then(function(respuesta) {
            $scope.publis[$scope.pagina].splice(index,1);
          })
      }
    });

    }
  $scope.modificarPublicacion = function(publicacion) {
    $location.path("publicar/" + publicacion.IDPublicacion);
    $scope.tareasAdicionalesCambioPag();
  }
});
