musicien.controller('perfilUsuario', function ($scope, Llamada, $location, $routeParams) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("UsuariosLeerDatosPropios?IDUsuario=" + $routeParams.IDUsuario + "&IDUsuarioLector=" + $routeParams.IDUsuario + "&IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        console.log(respuesta);
        $scope.perfilUsuario = respuesta.data;
        Llamada.http.get("UsuariosPlanesYPromocionesLeerPorIDUsuario?IDUsuario=" + $routeParams.IDUsuario + "&IDIdioma=" + getIdioma())
          .then(function(respuesta) {
            $scope.planesu = respuesta.data.Planes;
            $scope.promocionesu = respuesta.data.Promociones;
            /*for (i = 0; i < $scope.promocionesu.length; i++) {
              $scope.promocionesu[i].FechaFin = TransformarFecha($scope.promocionesu[i].FechaFin).Fecha;
            }
            for (i = 0; i < $scope.planesu.length; i++) {
              $scope.planesu[i].FechaFin = TransformarFecha($scope.planesu[i].FechaFin).Fecha;
            }*/
            if ($scope.perfilUsuario.ContenidoMMServidor > 0) {
              Llamada.http.getArrayByte($scope.perfilUsuario.ContenidoMM, "I")
                .then(function(respuesta) {
                  $scope.perfilUsuario.DataContenidoMM = respuesta.data;
                })
            } else {
              $scope.perfilUsuario.DataContenidoMM = $scope.perfilUsuario.ContenidoMM;
            }
          })
      })
  };
  $scope.claseFijadaU = function(val) {
    if (val > 0) {
      return "fa fa-lock";
    } else {
      return "fa fa-unlock";
    }
  }
  $scope.claseFijadaUVip = function(val) {
    if (val > 0) {
      return "fa fa-star";
    } else {
      return "fa fa-star-o";
    }
  }
  $scope.transformarFecha = function(fechafea) {
    if (NotNullNotUndefinedNotEmpty(fechafea)) {
      return TransformarFecha(fechafea);
    } else {
      return { Fecha: "Activo" }
    }

  }
  $scope.bloquearUsuario = function(usuario) {
    var newstate = 0;
    if (usuario.Bloqueado < 1) {
        newstate = 1;
    }
    Llamada.http.get("UsuariosBloquear?IDUsuario=" + usuario.IDUsuario + "&Bloqueado=" + newstate)
      .then(function(respuesta) {
        usuario.Bloqueado = newstate;
      })
  }
  $scope.privilegiarUsuario = function(usuario) {
    var newstate = 0;
    if (usuario.EsVip < 1) {
        newstate = 1;
    }
    Llamada.http.get("UsuariosVip?IDUsuario=" + usuario.IDUsuario + "&Activo=" + newstate)
      .then(function(respuesta) {
        usuario.EsVip = newstate;
      })
  }
});
