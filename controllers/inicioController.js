musicien.controller('inicio', function ($scope, $location, $routeParams,Redes, Llamada) {
  if ($location.path() === "/new") {
    $location.path("/home");
    //$scope.cargaInicial();
  }
  $scope.cargaInicial();
  if ($routeParams.access_token !== undefined && $routeParams.access_token !== null) {
    Redes.Sociales.Instagram.Login($routeParams.access_token);
  }
  if ($routeParams.guidverif !== undefined && $routeParams.guidverif !== null) {
    Llamada.http.get("UsuariosVerificar?guid=" + $routeParams.guidverif)
      .then(function(respuesta) {
        console.log(respuesta);
        console.log(respuesta);
        if (respuesta.data.ID > 0) {
          mensajeExito("Bienvenido a Musicien.");
          mensajeExito("Tu cuenta ha sido validada con éxito. Ahora puedes iniciar sesión para empezar a disfrutar de Musicien.");
          $location.path("/preferencias");
        } else {
          anadirErrores(respuesta.data.Resultado);
        }
      })
  }
  $scope.LeerComentariosPublicacion = function(publicacion) {
      if (publicacion.ConComentarios === true) {
        for (i = 0; i < $scope.publicaciones.length; i++) {
          if ($scope.publicaciones[i].IDPublicacion == publicacion.IDPublicacion) {
            $scope.publicaciones[i].ConComentarios = false;
            $scope.publicaciones[i].Comentarios.splice(0,$scope.publicaciones[i].Comentarios.length);
          }
        }
      } else {
        Llamada.http.get("PublicacionesLeerPorID?IDPublicacion=" + publicacion.IDPublicacion + "&IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
          .then(function(respuesta) {
            for (i = 0; i < $scope.publicaciones.length; i++) {
              if ($scope.publicaciones[i].IDPublicacion == respuesta.data.IDPublicacion) {
                $scope.publicaciones[i].ConComentarios = true;
                console.log($scope.publicaciones[i])
                console.log(respuesta.data.Comentarios);
                if (NotNullNotUndefinedNotEmpty($scope.publicaciones[i].Comentarios)) {
                  $scope.publicaciones[i].Comentarios.splice(0,$scope.publicaciones[i].Comentarios.length)
                } else {
                  $scope.publicaciones[i].Comentarios = [];
                }
                for (h = 0; h < respuesta.data.Comentarios.length; h++) {
                  $scope.publicaciones[i].Comentarios.push(respuesta.data.Comentarios[h]);
                }
                console.log($scope.publicaciones[i])
              }
            }
          });
      }

  }
  $scope.SeguirDejarSeguirUsuario = function(usuario) {
    if (usuario.IDUsuarioSigueUsuario > 0) {
      $scope.DejarSeguirUsuario(usuario);
    } else {
      $scope.SeguirUsuario(usuario);
    }
  }
  recargarTops();
  $scope.SeguirUsuario = function(usuario) {
    PonerLoadingTrue()
    Llamada.http.get("UsuarioSigueUsuarioSeguir?IDUsuarioSeguidor=" + getIDUsuario() + "&IDUsuarioSeguido=" + usuario.IDUsuario)
      .then(function(respuesta) {
        console.log(respuesta);
        ActualizarSeguidorPublicaciones(usuario.IDUsuario, respuesta.data.ID);

      })
  }
  $scope.DejarSeguirUsuario = function(usuario) {
    PonerLoadingTrue()
    Llamada.http.get("UsuarioSigueUsuarioDejarDeSeguir?IDUsuarioSigueUsuario=" + usuario.IDUsuarioSigueUsuario)
      .then(function(respuesta) {
        console.log(respuesta);
        ActualizarSeguidorPublicaciones(usuario.IDUsuario, 0);
      })
  }
  $scope.condicionesSeguir = function(usuarioseguido) {
    if (NotNullNotUndefinedNotEmpty($scope.usuario)) {
      if ($scope.usuario.Login!==true) {
        return true;
      } else {
        if (usuarioseguido.IDUsuario == $scope.usuario.IDUsuario) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  }
  $scope.checkClassPref = function(letra) {
    if (NotNullNotUndefinedNotEmpty($scope.PublicacionesMostradas)) {
      if ($scope.PublicacionesMostradas == letra) {
      	return "btn btn-sigues";
      } else {
        return "btn btn-todo";
      }
    }  else {
      return "btn btn-default";
    }
  }
  $scope.checkClassPubFav = function (letra) {
    if (NotNullNotUndefinedNotEmpty($scope.usuario)) {
      if ($scope.usuario.PreferenciaPublInicial == letra) {
          return "fa fa-lock";
          alert("Si en " + letra)
      } else {
        return "fa fa-unlock";
      }
    } else {
      return "";
    }
  }
  $scope.CambiarPubFavorito = function(letra) {
    Llamada.http.get("UsuariosCambiarPublicacionesPreferentes?IDUsuario=" + getIDUsuario() + "&PreferenciaPublInicial="+ letra)
      .then(function(respuesta) {
        CambiarPrefPublicacionUsuario(letra);
      })
  }
  $scope.active = 1;
  $scope.changeTabNum = function(num) {
      $scope.active = num;
    }
    $scope.estaActive = function(num) {
      if (parseInt(num) == parseInt($scope.active)) {
        return "f-active";
      }
    }
});
