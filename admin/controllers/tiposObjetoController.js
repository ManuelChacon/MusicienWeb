musicien.controller('tiposObjeto', function ($scope, Llamada, $location) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("PropiedadesYObjetosLeer?IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        $scope.tiposObjeto = respuesta.data.Objetos;
      })
  }
  $scope.crearTipoObjeto = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/crearCaracteristica")
  }
  $scope.eliminartipoObjeto = function(tipoObjeto, index) {
    result = DevExpress.ui.dialog.confirm("¿Seguro que deseas eliminar esto?");
    result.then(function(val) {
      if (val) {
        Llamada.http.get("TiposObjetoEliminar?IDTipoObjeto=" + tipoObjeto.IDTipoObjeto)
          .then(function(respuesta) {
            $scope.tiposObjeto.splice(index,1);
          })
      }
    });

  }
});
musicien.controller('modificarTipoObjeto', function ($scope, Llamada, $location, $routeParams) {
  if ($scope.protectedRoute()) {
    if (NotNullNotUndefinedNotEmpty($routeParams.IDTipoObjeto)) {
      Llamada.http.get("ObjetosLeerPorIDTipoObjeto?IDTipoObjeto=" + $routeParams.IDTipoObjeto + "&IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.tipoObjeto = respuesta.data;
          Llamada.http.get("PropiedadesLeer")
            .then(function(respuesta) {
              $scope.propiedades = respuesta.data;
            })
        })
    } else {
      $scope.tipoObjeto = new TipoObjeto();
      Llamada.http.get("PropiedadesLeer")
        .then(function(respuesta) {
          $scope.propiedades = respuesta.data;
        })
    }
  }



  $scope.AnadirPropiedad = function() {
    if (NotNullNotUndefinedNotEmpty($scope.selectedProperty)) {
      if (!NotNullNotUndefinedNotEmpty($scope.tipoObjeto.Propiedades)) {
        $scope.tipoObjeto.Propiedades = [];
      }
      $scope.tipoObjeto.Propiedades.push(JSON.parse($scope.selectedProperty))
    }
  }
  $scope.noenlista = function(propiedad) {
    var res = true;
    for (n = 0; n < $scope.tipoObjeto.Propiedades.length; n++) {
      if (NotNullNotUndefinedNotEmpty($scope.tipoObjeto.Propiedades[n])) {
        if ($scope.tipoObjeto.Propiedades[n].IDPropiedad == propiedad.IDPropiedad) {
          res = false;
        }
      }
    }
    return res;
  }
  $scope.crearPropiedad = function() {
    Llamada.http.post("PropiedadesCrear", $scope.newPropiedad)
      .then(function(respuesta) {
        $scope.propiedades = respuesta;
        $scope.tipoObjeto.Propiedades.push($scope.propiedades[$scope.propiedades.length-1])
      })

  }
  $scope.eliminarPropiedad = function(index) {
    var b = parseInt("" + $scope.tipoObjeto.Propiedades.length);
    if (!NotNullNotUndefinedNotEmpty($scope.tipoObjeto.PropiedadesElim)) {
      $scope.tipoObjeto.PropiedadesElim = [];
    }
    var a = $scope.tipoObjeto.Propiedades.splice(index,1);
    $scope.tipoObjeto.PropiedadesElim.push(a[0]);
  }
  $scope.obtenerTipoCaracteristica = function() {
    if (NotNullNotUndefinedNotEmpty($scope.tipoObjeto)) {
      if (NotNullNotUndefinedNotEmpty($scope.tipoObjeto.Tipo)) {
        var res = "";
        switch ($scope.tipoObjeto.Tipo) {
          case "P":
            res = "Tarjetas";
            break;
            case "T":
              res = "Etiquetas";
              break;
          default:
            res = "No se encuentra el tipo seleccionado.";
        }
        return res;
      } else {
        return "Selecciona un tipo de elemento de perfil del listado.";
      }
    } else {
      return "";
    }
  }
  $scope.tipoCambiado = function() {
    switch ($scope.newTipo) {
      case "T":
        $scope.tipoObjeto.TienePropiedades = 0;
        break;
        case "P":
          $scope.tipoObjeto.TienePropiedades = 1;
          break;
      default:

    }
    $scope.tipoObjeto.Tipo = $scope.newTipo;
  }
  window.cambioIconoOpcion = function(esto) {
    if (!NotNullNotUndefinedNotEmpty($scope.newObjeto)) {
      $scope.newObjeto = {}
    }
    $scope.$apply(function () {
      $scope.newObjeto.newContenidoMM = $scope.obtenerImagenInput(esto.files[0]);
      $scope.newObjeto.newFile = esto.files;
    });
  }
  $scope.anadirObjeto = function() {
    if (!NotNullNotUndefinedNotEmpty($scope.tipoObjeto.Objetos)) {
      $scope.tipoObjeto.Objetos = [];
    }
    $scope.tipoObjeto.Objetos.push($scope.newObjeto);
    $scope.newObjeto = null;
  }
  $scope.eliminarObjeto = function(index) {
    if (!NotNullNotUndefinedNotEmpty($scope.tipoObjeto.ObjetosElim)) {
      $scope.tipoObjeto.ObjetosElim = [];
    }
    $scope.tipoObjeto.ObjetosElim.push($scope.tipoObjeto.Objetos.splice(index, 1)[0]);
  }
  $scope.guardarCambios = function() {
    if (NotNullNotUndefinedNotEmpty($scope.tipoObjeto.ObjetosElim)) {
      for (i = 0; i < $scope.tipoObjeto.ObjetosElim.length; i++) {
        $scope.tipoObjeto.ObjetosElim[i].newFile = null;
      }
    }
    if (NotNullNotUndefinedNotEmpty($scope.tipoObjeto.Objetos)) {
      SubirImagenesRecursivamente(0,$scope.tipoObjeto.Objetos.length)
    } else {
      GuardarCambios();
    }
  }
  GuardarCambios = function() {
    Llamada.http.post("TiposObjetoCrearModificar?IDIdioma=" + getIdioma(), $scope.tipoObjeto)
      .then(function(respuesta) {
        $scope.tareasAdicionalesCambioPag();
        $location.path("/caracteristicas");
        mensajeExito("Los datos se han guardado con éxito");
      })
  }
  SubirImagenesRecursivamente = function(index,longitud) {
    if (index < longitud) {
      if (NotNullNotUndefinedNotEmpty($scope.tipoObjeto.Objetos[index].newFile)) {
        var arr = []
        var y = 0;
        while (y < $scope.tipoObjeto.Objetos[index].newFile.length) {
          var fd = new FormData();
          angular.forEach($scope.tipoObjeto.Objetos[index].newFile, function (v, k) {
            if (k == y) {
              fd.append('file.jpg', $scope.tipoObjeto.Objetos[index].newFile[k]);
            }
          });
          arr.push({formdata: fd});
          y++
        }
        Llamada.http.postFile(arr[0].formdata, "A")
          .then(function(respuesta) {
            $scope.tipoObjeto.Objetos[index].ContenidoMM = respuesta.Archivo;
            $scope.tipoObjeto.Objetos[index].newFile = null;
            index++;
            SubirImagenesRecursivamente(index,longitud);
          });
      } else {
        index++;
        SubirImagenesRecursivamente(index,longitud);
      }
    } else {
      GuardarCambios();
    }
  }
});
