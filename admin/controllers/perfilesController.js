musicien.controller('perfiles', function ($scope, Llamada, $location) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("CategoriasLeer?IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        $scope.categorias = respuesta.data;
      })
  }
  $scope.eliminarCategoria = function(categoria, index) {
    result = DevExpress.ui.dialog.confirm("¿Seguro que deseas eliminar este perfil?");
    result.then(function(val) {
      if (val) {
        Llamada.http.get("CategoriasEliminar?IDCategoria=" + categoria.IDCategoria)
          .then(function(respuesta) {
            $scope.categorias.splice(index,1);
          })
      }
    });

  }
  $scope.crearCategoria = function() {
    $location.path("/crearPerfil");
    $scope.tareasAdicionalesCambioPag();
  }
});
musicien.controller('modificarPerfil', function ($scope, Llamada, $routeParams, $location) {
  if ($scope.protectedRoute()) {
    if (NotNullNotUndefinedNotEmpty($routeParams.IDCategoria)) {
      Llamada.http.get("CategoriasLeerPropiedadesPorID?IDCategoria=" + $routeParams.IDCategoria + "&IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.categoria = respuesta.data;
          Llamada.http.get("PropiedadesLeerYObjetosLeer?IDIdioma=" + getIdioma())
            .then(function(respuesta) {
              $scope.propiedades = respuesta.data.Propiedades;
              $scope.tiposObjeto = respuesta.data.Objetos;
            })
        })
    } else {
      $scope.categoria = new Categoria();
      Llamada.http.get("PropiedadesLeerYObjetosLeer?IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.propiedades = respuesta.data.Propiedades;
          $scope.tiposObjeto = respuesta.data.Objetos;
        })
    }

  }
  $scope.ImagenDelPerfil = function(categoria) {
    if (NotNullNotUndefinedNotEmpty(categoria)) {
      if (NotNullNotUndefinedNotEmpty(categoria.newContenidoMM)) {
        return categoria.newContenidoMM;
      } else {
        return $scope.obtenerImagenCategoria(categoria)
      }
    } else {
      return "img/loading.gif";
    }
  }
  window.cambioImgPerfil = function(esto) {
    $scope.$apply(function () {
      $scope.categoria.newContenidoMM = $scope.obtenerImagenInput(esto.files[0]);
      $scope.categoria.newFile = esto.files;
    });
  }
  $scope.AnadirPropiedad = function() {
    if (NotNullNotUndefinedNotEmpty($scope.selectedProperty)) {
      if (!NotNullNotUndefinedNotEmpty($scope.categoria.Propiedades)) {
        $scope.categoria.Propiedades = [];
      }
      $scope.categoria.Propiedades.push(JSON.parse($scope.selectedProperty))
    }
  }
  $scope.noenlista = function(propiedad) {
    var res = true;
    if (NotNullNotUndefinedNotEmpty($scope.categoria.Propiedades)) {
      for (n = 0; n < $scope.categoria.Propiedades.length; n++) {
        if (NotNullNotUndefinedNotEmpty($scope.categoria.Propiedades[n])) {
          if ($scope.categoria.Propiedades[n].IDPropiedad == propiedad.IDPropiedad) {
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
        $scope.categoria.Propiedades.push($scope.propiedades[$scope.propiedades.length-1])
      })

  }
  $scope.eliminarPropiedad = function(index) {
    var b = parseInt("" + $scope.categoria.Propiedades.length);
    if (!NotNullNotUndefinedNotEmpty($scope.categoria.PropiedadesEliminadas)) {
      $scope.categoria.PropiedadesEliminadas = [];
    }
    var a = $scope.categoria.Propiedades.splice(index,1);
    $scope.categoria.PropiedadesEliminadas.push(a[0]);
  }
  $scope.eliminarObjeto = function(index) {
    if (!NotNullNotUndefinedNotEmpty($scope.categoria.ObjetosEliminados)) {
      $scope.categoria.ObjetosEliminados = [];
    }
    var a = $scope.categoria.Objetos.splice(index,1);
    $scope.categoria.ObjetosEliminados.push(a[0]);
  }
  $scope.guardarCambios = function() {
    if (NotNullNotUndefinedNotEmpty($scope.categoria.newFile)) {
      var arr = []
      var y = 0;
      while (y < $scope.categoria.newFile.length) {
        var fd = new FormData();
        angular.forEach($scope.categoria.newFile, function (v, k) {
          if (k == y) {
            fd.append('file.jpg', $scope.categoria.newFile[k]);
          }
        });
        arr.push({formdata: fd});
        y++
      }
      Llamada.http.postFile(arr[0].formdata, "A")
        .then(function(respuesta) {
          $scope.categoria.Imagen = respuesta.Archivo;
          $scope.categoria.newFile = null;
          guardarCambios();
        });
    } else {
      guardarCambios();
    }
  }
  guardarCambios = function() {
    Llamada.http.post("CategoriasCrearModificar?IDIdioma=" + getIdioma(), $scope.categoria)
      .then(function(respuesta) {
        if (respuesta.ID > 0) {
          $scope.tareasAdicionalesCambioPag();
          $location.path("/perfiles");
          mensajeExito("Los datos se han guardado con éxito");
        } else {
          anadirErrores("Ha ocurrido un error al guardar");
        }
      })
  }
  $scope.AnadirObjeto = function() {
    if (NotNullNotUndefinedNotEmpty($scope.selectedObject)) {
      if (!NotNullNotUndefinedNotEmpty($scope.categoria.Objetos)) {
        $scope.categoria.Objetos = [];
      }
      $scope.categoria.Objetos.push(JSON.parse($scope.selectedObject))
    }
  }
  $scope.noenlistaobjeto = function(tipoObjeto) {
    var res = true;
    if (NotNullNotUndefinedNotEmpty($scope.categoria.Objetos)) {
      for (n = 0; n < $scope.categoria.Objetos.length; n++) {
        if (NotNullNotUndefinedNotEmpty($scope.categoria.Objetos[n])) {
          if ($scope.categoria.Objetos[n].IDTipoObjeto == tipoObjeto.IDTipoObjeto) {
            res = false;
          }
        }
      }
    }

    return res;
  }
});
