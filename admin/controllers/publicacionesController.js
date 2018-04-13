musicien.controller('publicaciones', function ($scope, Llamada, $location) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("TiposPublicacionesLeer?IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        $scope.publicaciones = respuesta.data;
      })
  }
  $scope.crearTipoPublicacion = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/crearPublicacion");
  }
  $scope.eliminarPublicacion = function(publi, index) {
    result = DevExpress.ui.dialog.confirm("¿Seguro que deseas eliminar esta publicación?");
    result.then(function(val) {
      if (val) {
        Llamada.http.get("TiposPublicacionEliminar?IDTipoPublicacion=" + publi.IDTipoPublicacion)
          .then(function(respuesta) {
            $scope.publicaciones.splice(index,1);
          })
      }
    });
  }
});
musicien.controller('modificarPublicaciones', function ($scope, Llamada, $routeParams, $location, TipoPublicacion) {
  if ($scope.protectedRoute()) {
    if (NotNullNotUndefinedNotEmpty(TipoPublicacion.Modificar.get())) {
      $scope.publicacion = JSON.parse("" + JSON.stringify(TipoPublicacion.Modificar.get()));
      TipoPublicacion.Modificar.set(null);
      Llamada.http.get("PropiedadesLeer")
        .then(function(respuesta) {
          $scope.propiedades = respuesta.data;
        })
    } else {
      Llamada.http.get("PropiedadesLeer")
        .then(function(respuesta) {
          $scope.propiedades = respuesta.data;
          $scope.publicacion = { NombreTipo:"", Propiedades:[] }
        })
    }
  };
  $scope.AnadirPropiedad = function() {
    if (NotNullNotUndefinedNotEmpty($scope.selectedProperty)) {
      if (!NotNullNotUndefinedNotEmpty($scope.publicacion.Propiedades)) {
        $scope.publicacion.Propiedades = [];
      }
      $scope.publicacion.Propiedades.push(JSON.parse($scope.selectedProperty))
    }
  }
  $scope.noenlista = function(propiedad) {
    var res = true;
    if (NotNullNotUndefinedNotEmpty($scope.publicacion.Propiedades)) {
      for (n = 0; n < $scope.publicacion.Propiedades.length; n++) {
        if (NotNullNotUndefinedNotEmpty($scope.publicacion.Propiedades[n])) {
          if ($scope.publicacion.Propiedades[n].IDPropiedad == propiedad.IDPropiedad) {
            res = false;
          }
        }
      }
    }
    return res;
  }
  $scope.crearPropiedad = function() {
    Llamada.http.post("PropiedadesCrear", $scope.newPropiedad)
      .then(function(respuesta) {
        $scope.propiedades = respuesta;
        $scope.publicacion.Propiedades.push($scope.propiedades[$scope.propiedades.length-1])
      })

  }
  $scope.eliminarPropiedad = function(index) {
    var b = parseInt("" + $scope.publicacion.Propiedades.length);
    if (!NotNullNotUndefinedNotEmpty($scope.publicacion.PropiedadesElim)) {
      $scope.publicacion.PropiedadesElim = [];
    }
    var a = $scope.publicacion.Propiedades.splice(index,1);
    $scope.publicacion.PropiedadesElim.push(a[0]);
  }
  window.cambioImgPubli = function(esto) {
    $scope.$apply(function () {
      $scope.publicacion.newContenidoMM = $scope.obtenerImagenInput(esto.files[0]);
      $scope.publicacion.newFile = esto.files;
    });
  }
  $scope.ImagenDelPerfil = function(publicacion) {
    if (NotNullNotUndefinedNotEmpty(publicacion)) {
      if (NotNullNotUndefinedNotEmpty(publicacion.newContenidoMM)) {
        return publicacion.newContenidoMM;
      } else {
        return $scope.obtenerImagenPublicacion(publicacion)
      }
    } else {
      return "img/loading.gif";
    }
  }
  $scope.guardarCambios = function() {
    if (NotNullNotUndefinedNotEmpty($scope.publicacion.newFile)) {
      var arr = []
      var y = 0;
      while (y < $scope.publicacion.newFile.length) {
        var fd = new FormData();
        angular.forEach($scope.publicacion.newFile, function (v, k) {
          if (k == y) {
            fd.append('file.jpg', $scope.publicacion.newFile[k]);
          }
        });
        arr.push({formdata: fd});
        y++
      }
      Llamada.http.postFile(arr[0].formdata, "A")
        .then(function(respuesta) {
          $scope.publicacion.ContenidoMM = respuesta.Archivo;
          $scope.publicacion.newFile = null;
          guardarCambios();
        });
    } else {
      guardarCambios();
    }
  }
  guardarCambios = function() {
    Llamada.http.post("TiposPublicacionCrearModificar?IDIdioma=" + getIdioma(), $scope.publicacion)
      .then(function(respuesta) {
        if (respuesta.ID > 0) {
          $scope.tareasAdicionalesCambioPag();
          $location.path("/publicaciones");
          mensajeExito("Los datos se han guardado con éxito");
        } else {
          anadirErrores("Ha ocurrido un error al guardar");
        }
      })
  }

  $scope.obtenerImagenPublicacion = function(algo) {
    if (NotNullNotUndefinedNotEmpty(algo)) {
      if (algo.ContenidoMMCargado === true) {
        return algo.DataContenidoMM;
      } else {
        if (algo.ContenidoMMCargando === true) {
          return "img/cargando.gif";
        } else {
          algo.ContenidoMMCargando = true;
          Llamada.http.getArrayByte(algo.ContenidoMM, "A")
            .then(function(respuesta) {
              algo.DataContenidoMM = respuesta.data;
              algo.ContenidoMMCargando = false;
              algo.ContenidoMMCargado = true;
            })
        }
      }
    } else {
      return "img/cargando.gif";
    }
  }
});
musicien.factory('TipoPublicacion', function($http, $q) {
  var publi;
  var Modificar = {
    get: function() {
      return publi
    },
    set: function(valores) {
      publi = valores
    }
  }
  return {
    Modificar
  }
});
