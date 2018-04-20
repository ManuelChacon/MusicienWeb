musicien.controller('perfilusuario', function ($scope, $location, Llamada, $window, $sce, Redes, $routeParams) {
  Llamada.http.get("UsuariosLeerPorID?IDUsuario=" + $routeParams.IDUsuario + "&IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
    .then(function(respuesta) {
      console.log(respuesta.data);
      $scope.perfilUsuario = respuesta.data;
      /*for (i = 0; i < $scope.perfilUsuario.Publicaciones.length; i++) {
        $scope.perfilUsuario.Publicaciones[i].Usuario = {
          Nombre: $scope.perfilUsuario.Nombre,
          ContenidoMM: $scope.perfilUsuario.ContenidoMM,
          ContenidoMMAlt: $scope.perfilUsuario.ContenidoMMAlt,
          ContenidoMMServidor: $scope.perfilUsuario.ContenidoMMServidor,
          IDUsuario: $scope.perfilUsuario.IDUsuario,
          IDUsuarioSigueUsuario: $scope.perfilUsuario.IDUsuarioSigueUsuario,
        }
      }*/
      for (n = 0; n < $scope.perfilUsuario.Categorias.length; n++) {
        Llamada.http.getArrayByte($scope.perfilUsuario.Categorias[n].Imagen, "A", n)
          .then(function(respuesta) {
            $scope.perfilUsuario.Categorias[respuesta.posi].DataContenidoMM = respuesta.data;
          })
      }
      if ($scope.perfilUsuario.ContenidoMMServidor > 0) {
        Llamada.http.getArrayByte($scope.perfilUsuario.ContenidoMM, "I")
          .then(function(respuesta) {
            $scope.perfilUsuario.DataContenidoMM = respuesta.data;
          })
      } else {
        $scope.perfilUsuario.DataContenidoMM = $scope.perfilUsuario.ContenidoMM;
      }
      Llamada.http.getArrayByte($scope.perfilUsuario.ContenidoMMBanner, "I")
        .then(function(respuesta) {
          console.log(respuesta);
          $scope.perfilUsuario.DataContenidoMMBanner = respuesta.data;
        })
      if (NotNullNotUndefinedNotEmpty($routeParams.tabnum)) {
        $scope.changeTabNum(parseInt($routeParams.tabnum));
      }
    })
    $scope.estaActive = function(num) {
      if (parseInt(num) == parseInt($scope.active)) {
        return "active";
      }
    }
    $scope.changeTabNum = function(num) {
      $scope.active = num;
      if (parseInt($scope.active) == 3) {
        Llamada.http.get("UsuariosLeerSeguidoresDe?IDUsuario=" + $scope.perfilUsuario.IDUsuario + "&IDUsuarioLector=" + getIDUsuario())
          .then(function(respuesta) {
            console.log(respuesta.data);
            $scope.perfilUsuario.Seguidos = respuesta.data;
          })
      } else if (parseInt($scope.active) == 4) {
        Llamada.http.get("UsuariosLeerSeguidosPor?IDUsuario=" + $scope.perfilUsuario.IDUsuario + "&IDUsuarioLector=" + getIDUsuario())
          .then(function(respuesta) {
            console.log(respuesta.data);
            $scope.perfilUsuario.Seguidoress = respuesta.data;
          })
      }
    }
    $scope.abrirPestana = function(a, categoria, index) {

      if (categoria.ConInfo !== true) {
        Llamada.http.get("CategoriasLeerPropiedadesPorID?IDUsuarioCategoria=" + categoria.IDUsuarioCategoria  + "&IDIdioma=" + getIdioma())
          .then(function(respuesta) {
            console.log(respuesta);
            $scope.perfilUsuario.Categorias[index].ConInfo = true;
            $scope.perfilUsuario.Categorias[index].Propiedades = respuesta.data.Propiedades;
            $scope.perfilUsuario.Categorias[index].Objetos = respuesta.data.Objetos;
            $scope.changeTabNum(a);
            console.log($scope.perfilUsuario)
          })

      } else {
        $scope.changeTabNum(a);
      }
    }
    $scope.LeerMasPublicaciones = function() {
      var idinicio = $scope.perfilUsuario.Publicaciones[$scope.perfilUsuario.Publicaciones.length-1].IDPublicacion;
      Llamada.http.get("PublicacionesLeerPorIDUsuario?IDUsuario=" + $routeParams.IDUsuario + "&IDUsuarioLector=" + getIDUsuario() + "&IDInicio=" + idinicio + "&tamPag=5&IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          if (respuesta.data.length < 1) {
            anadirErrores($scope.lang.no_haymasp_error);
          }
          for (i = 0; i < respuesta.data.length; i++) {
            respuesta.data[i].Comentarios = [];
          }
          console.log(respuesta.data);
          $scope.perfilUsuario.Publicaciones = $scope.perfilUsuario.Publicaciones.concat(respuesta.data);
        })
    }
    $scope.LeerComentariosPublicacion = function(publicacion) {
      if (publicacion.ConComentarios === true) {
        for (i = 0; i < $scope.perfilUsuario.Publicaciones.length; i++) {
          if ($scope.perfilUsuario.Publicaciones[i].IDPublicacion == publicacion.IDPublicacion) {
            $scope.perfilUsuario.Publicaciones[i].ConComentarios = true;
            $scope.perfilUsuario.Publicaciones[i].Comentarios.splice(0,$scope.perfilUsuario.Publicaciones[i].Comentarios.length)
          }
        }
      } else {
        Llamada.http.get("PublicacionesLeerPorID?IDPublicacion=" + publicacion.IDPublicacion + "&IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
          .then(function(respuesta) {
            for (i = 0; i < $scope.perfilUsuario.Publicaciones.length; i++) {
              if ($scope.perfilUsuario.Publicaciones[i].IDPublicacion == respuesta.data.IDPublicacion) {
                $scope.perfilUsuario.Publicaciones[i].ConComentarios = true;
                console.log($scope.perfilUsuario.Publicaciones[i])
                console.log(respuesta.data.Comentarios);
                if (NotNullNotUndefinedNotEmpty($scope.perfilUsuario.Publicaciones[i].Comentarios)) {
                  $scope.perfilUsuario.Publicaciones[i].Comentarios.splice(0,$scope.perfilUsuario.Publicaciones[i].Comentarios.length)
                } else {
                  $scope.perfilUsuario.Publicaciones[i].Comentarios = [];
                }
                for (h = 0; h < respuesta.data.Comentarios.length; h++) {
                  $scope.perfilUsuario.Publicaciones[i].Comentarios.push(respuesta.data.Comentarios[h]);
                }
                console.log($scope.perfilUsuario.Publicaciones[i])
              }
            }
          });
      }
    }

    $scope.condicionesSeguir = function(usuarioseguido) {
      return true;
    }
    $scope.esTipoObjeto = function(tipo, tipoObjeto) {
      return tipo == tipoObjeto.Tipo;
    }
    $scope.sinFormulario = true;
    $scope.SeguirDejarSeguirUsuario = function(usuario) {
      if (usuario.IDUsuarioSigueUsuario > 0) {
        $scope.DejarSeguirUsuario(usuario);
      } else {
        $scope.SeguirUsuario(usuario);
      }
    }
    $scope.SeguirUsuario = function(usuario) {
      Llamada.http.get("UsuarioSigueUsuarioSeguir?IDUsuarioSeguidor=" + getIDUsuario() + "&IDUsuarioSeguido=" + usuario.IDUsuario)
        .then(function(respuesta) {
          console.log(respuesta);
          $scope.perfilUsuario.IDUsuarioSigueUsuario = respuesta.data.ID;

        })
    }
    $scope.DejarSeguirUsuario = function(usuario) {
      Llamada.http.get("UsuarioSigueUsuarioDejarDeSeguir?IDUsuarioSigueUsuario=" + usuario.IDUsuarioSigueUsuario)
        .then(function(respuesta) {
          console.log(respuesta);
          $scope.perfilUsuario.IDUsuarioSigueUsuario = 0;
        })
    }
    $scope.condicionesSeguirCabeza = function(usuarioseguido) {
      if (NotNullNotUndefinedNotEmpty($scope.usuario) && NotNullNotUndefinedNotEmpty(usuarioseguido)) {
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


    $scope.condicionesSeguirFollowers = function(usuarioseguido) {
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
    $scope.SeguirDejarSeguirUsuarioFollower = function(usuario) {
      if (usuario.IDUsuarioSigueUsuario > 0) {
        $scope.DejarSeguirUsuarioFollower(usuario);
      } else {
        $scope.SeguirUsuarioFollower(usuario);
      }
    }
    $scope.SeguirUsuarioFollower = function(usuario) {
      Llamada.http.get("UsuarioSigueUsuarioSeguir?IDUsuarioSeguidor=" + getIDUsuario() + "&IDUsuarioSeguido=" + usuario.IDUsuario)
        .then(function(respuesta) {
          console.log(respuesta);
          //ActualizarFollowsYFollowers(usuario.IDUsuario, respuesta.data.ID);
          usuario.IDUsuarioSigueUsuario = respuesta.data.ID;

        })
    }
    $scope.DejarSeguirUsuarioFollower = function(usuario) {
      Llamada.http.get("UsuarioSigueUsuarioDejarDeSeguir?IDUsuarioSigueUsuario=" + usuario.IDUsuarioSigueUsuario)
        .then(function(respuesta) {
          console.log(respuesta);
          ActualizarFollowsYFollowers(usuario.IDUsuario, 0);
          usuario.IDUsuarioSigueUsuario = respuesta.data.ID;
        })
    }
    ActualizarFollowsYFollowers = function(IDUsuario, newValor) {
      if (NotNullNotUndefinedNotEmpty($scope.perfilUsuario)) {
        if (NotNullNotUndefinedNotEmpty($scope.perfilUsuario.Seguidos)) {
          for (i = 0; i < $scope.perfilUsuario.Seguidos.length; i++) {
            if ($scope.perfilUsuario.Seguidos[i].IDUsuario == IDUsuario) {
              $scope.perfilUsuario.Seguidos[i].IDUsuarioSigueUsuario = newValor;
              if (newValor > 0) {
                $scope.perfilUsuario.Seguidos[i].Seguidores++;
              } else {
                $scope.perfilUsuario.Seguidos[i].Seguidores--;
              }
            }
          }
        }
        if (NotNullNotUndefinedNotEmpty($scope.perfilUsuario.Seguidores)) {
          for (i = 0; i < $scope.perfilUsuario.Seguidores.length; i++) {
            if ($scope.perfilUsuario.Seguidores[i].IDUsuario == IDUsuario) {
              $scope.perfilUsuario.Seguidores[i].IDUsuarioSigueUsuario = newValor;
              if (newValor > 0) {
                $scope.perfilUsuario.Seguidores[i].Seguidores++;
              } else {
                $scope.perfilUsuario.Seguidores[i].Seguidores--;
              }
            }
          }
        }
      }

    }
    comprobarPermisos()
});
