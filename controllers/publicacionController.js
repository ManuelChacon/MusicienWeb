musicien.controller('publicacion', function ($scope, $routeParams, Llamada, Redes, $sce) {
    var idusuario = "";
    modificandoEn(false);
  if ($scope.usuario !== null && $scope.usuario !== undefined) {
    idusuario = getIDUsuario();
  }
  Llamada.http.get("PublicacionesLeerPorID?IDPublicacion=" + $routeParams.IDPublicacion + "&IDUsuarioLector=" + idusuario + "&IDIdioma=" + getIdioma())
    .then(function(respuesta) {

      $scope.publicacion = respuesta.data;
      buttonwhatsapp = Redes.Sociales.Whatsapp.ObtenerBoton($scope.publicacion.Titulo, $scope.publicacion.IDPublicacion);

      Redes.Sociales.Twitter.ObtenerBoton($scope.publicacion.Titulo, $scope.publicacion.IDPublicacion);
      buttonwhatsapp.className = "hidden-lg-up";
      //document.getElementById("botonwhatsapp").appendChild(buttonwhatsapp);
      //gapi.plus.go();
      if (!NotNullNotUndefinedNotEmpty($scope.TopMusicos)) {
        recargarTops();
        //anadirErrores("cargo tops")
      }
    });
  $scope.esComentarioHijoDe = function(comentariopadre) {
    return function(comentario) {
      return comentario.IDComentarioPadre == comentariopadre.IDComentario;
    }
  }
  anadirComentario = function(comentario) {
    if (NotNullNotUndefinedNotEmpty(comentario)) {
      comentario.Usuario = $scope.usuario;
      $scope.publicacion.Comentarios.splice(0,0,comentario)
    }

  }
  $scope.shareFB = function() {
    Redes.Sociales.Facebook.SharePubli($scope.publicacion.IDPublicacion);
  }
  $scope.dejarDeEditar = function() {
    modificandoEn(false);
  }
  $scope.modificarPublicacion = function() {
    modificandoEn(true);
  }

  $scope.condicionesSeguir = function(usuarioseguido) {
    if (NotNullNotUndefinedNotEmpty($scope.usuario)) {
      if ($scope.usuario.Login!==true) {
        return true;
      } else {
        if (NotNullNotUndefinedNotEmpty(usuarioseguido)) {
          if (usuarioseguido.IDUsuario == $scope.usuario.IDUsuario) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  }
});
musicien.controller('formulariocomentario', function ($scope, $routeParams, Llamada) {
  sinoesnulo = function(a,b) {
    if (NotNullNotUndefinedNotEmpty(b)) {
      return b;
    } else if (NotNullNotUndefinedNotEmpty(a)) {
      return a.IDPublicacion;
    } else {
      return 0;
    }

  }
  $scope.init = function(IDComentarioPadre, IDPublicacion) {

    $scope.newComentario = {
      Descripcion: "",
      IDUsuario: getIDUsuario(),
      IDPublicacion: sinoesnulo($scope.publicacion, IDPublicacion)
    }
    $scope.newComentario.IDComentarioPadre = IDComentarioPadre;
  }
  $scope.enviarComentario = function() {
    if (NotNullNotUndefinedNotEmpty($scope.newComentario)) {
      if (!NotNullNotUndefinedNotEmpty($scope.newComentario.IDComentarioPadre)) {
        $scope.newComentario.IDComentarioPadre = 0;
      }
      if (!NotNullNotUndefinedNotEmpty($scope.newComentario.IDPublicacion)) {
        $scope.newComentario.IDPublicacion = $scope.publicacion.IDPublicacion;
      }
      if (!NotNullNotUndefinedNotEmpty($scope.newComentario.IDUsuario)) {
        $scope.newComentario.IDUsuario = getIDUsuario();
      }
      Llamada.http.post("ComentariosCrear", $scope.newComentario)
      .then(function(respuesta) {
        $scope.newComentario.IDComentario = respuesta.ID;
        anadirComentario($scope.newComentario);
        $scope.newComentario = JSON.parse("" + JSON.stringify($scope.newComentario))
        $scope.newComentario.Descripcion = "";
      })
    } else {
      $scope.emptys.push("Rellena la publicación.");
    }

  }
  $scope.condicionesSeguir = function(usuarioseguido) {
    if (NotNullNotUndefinedNotEmpty($scope.usuario)) {
      if ($scope.usuario.Login!==true) {
        return true;
      } else {
        if (NotNullNotUndefinedNotEmpty(usuarioseguido)) {
          if (usuarioseguido.IDUsuario == $scope.usuario.IDUsuario) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }

      }
    } else {
      return true;
    }
  }
  comprobarPermisos();
});
