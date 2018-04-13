musicien.controller('filtros', function ($scope, Llamada) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("FiltrosPrehechosLeer")
      .then(function(respuesta) {
        $scope.filtros = respuesta.data;
      })
  }
  $scope.eliminarFiltro = function(filtro, index) {
    result = DevExpress.ui.dialog.confirm("¿Seguro que deseas eliminar esta búsqueda?");
    result.then(function(val) {
      if (val) {
        Llamada.http.get("FiltrosPrehechosEliminar?IDFiltroPrehecho=" + filtro.IDFiltroPrehecho)
          .then(function(respuesta) {
            $scope.filtros.splice(index,1);
          })
      }
    });

  }
  $scope.cargarMultimediaFiltro = function(filtro){
    filtro.Cargada = true;
    Llamada.http.getArrayByte(filtro.ContenidoMM, "A")
      .then(function(respuesta) {
        filtro.DataContenidoMM = respuesta.data;
      })
  }
});

musicien.controller('modificarFiltro', function ($scope, $routeParams, Llamada) {
  if ($scope.protectedRoute()) {
    if (NotNullNotUndefinedNotEmpty($routeParams.IDFiltroPrehecho)) {
      Llamada.http.get("FiltrosLeerPorIDFiltro?IDFiltroPrehecho=" + $routeParams.IDFiltroPrehecho + "&IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.filtros = respuesta.data;
          document.getElementById("fechadesde").value = $scope.filtros.FechaDesde.split("T")[0];
          document.getElementById("fechahasta").value = $scope.filtros.FechaHasta.split("T")[0];
        })
    } else {
      $scope.filtros = new FiltrosBusqueda();
      Llamada.http.get("TiposPublicacionesLeer?IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        $scope.filtros.TipoPubli = respuesta.data;
        Llamada.http.get("CategoriasLeer?IDIdioma=" + getIdioma())
          .then(function(respuesta) {
            $scope.filtros.Categorias = respuesta.data;
          })
      })
    }
  }
  $scope.FiltrarPublicaciones = function() {
    if (NotNullNotUndefinedNotEmpty($scope.filtros.FechaHastaHTML)) {

      $scope.filtros.FechaHasta = TransformarFechaParaServicio($scope.filtros.FechaHastaHTML, "23:59:00");
    }
    if (NotNullNotUndefinedNotEmpty($scope.filtros.FechaDesdeHTML)) {
      $scope.filtros.FechaDesde = TransformarFechaParaServicio($scope.filtros.FechaDesdeHTML, "00:00:00");
    }
    Llamada.http.post("FiltrosPrehechosCrearModificar?IDIdioma=" + getIdioma(), $scope.filtros)
      .then(function(respuesta) {
        mensajeExito("Datos guardados con éxito");
        $scope.verFiltros();
      })
  }
});
musicien.controller('crearpostadmin', function ($scope, Llamada) {

  getIDUsuario = function() {
    if (NotNullNotUndefinedNotEmpty($scope.newIDUsuario)) {
      return $scope.newIDUsuario;
    } else {
      return $scope.usuario.IDUsuario;
    }
  }
  if ($scope.protectedRoute()) {
    Llamada.http.get("TiposPublicacionesLeer?IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        for (i = 0; i < respuesta.data.length; i++) {
          respuesta.data[i].Checked = true;
        }
        $scope.TiposPublicacion = respuesta.data;
      })
      Llamada.http.get("UsuariosLeerFakes")
        .then(function(respuesta) {
          $scope.FakeUsers = respuesta.data;
          //Esto es para forzar a musicien
          $scope.newIDUsuario = $scope.FakeUsers[0].IDUsuario;
          /*for (q = 0; q < $scope.FakeUsers.length; q++) {

            Llamada.http.getArrayByte($scope.FakeUsers[q].ContenidoMM, "I", q)
              .then(function(respuesta) {
                $scope.FakeUsers[respuesta.posi].DataContenidoMM = respuesta.data;
              })
          }*/
        })
  }


});
