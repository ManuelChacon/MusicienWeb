musicien.controller('admin', function ($scope, $location, Llamada, $window, $sce, $timeout, configuracionGlobal, $q, TipoPublicacion, $http) {
  $scope.IDIdioma = 1;
  var lang = localStorage.getItem("musicienLang");
  if (NotNullNotUndefinedNotEmpty(lang)) {
    $scope.IDIdioma = lang;
    console.log(lang + "es en uevo idioma");
  } else {
    lang = 1;
  }
  ObtenerJSONIdioma = function(id) {
    $scope.jsonpillado = true;
      console.log("Pillo el json")
    console.log("OBteniendo el idioma:" + id);
    $scope.IDIdioma = id;
    $http.get("../idioma" + id + ".json")
      .then(function(respuesta) {
        console.log(respuesta);
        $scope.lang = respuesta.data;
      })
  }
  ObtenerJSONIdioma($scope.IDIdioma);
  $scope.cambiarIdioma = function(idioma) {
    /*ObtenerJSONIdioma(idioma.IDIdioma);
    $scope.idiomaactivo = idioma.NombreIdioma;
    $scope.flagidiomaactivo = $scope.iconode(idioma.Icono);*/
    localStorage.setItem("musicienLang", "" + idioma.IDIdioma);
    location.reload();
  }
  getIdioma = function() {
    if (NotNullNotUndefinedNotEmpty($scope.IDIdioma)) {
      return $scope.IDIdioma;
    } else {
      return "";
    }
  }
  Llamada.http.get("IdiomasLeer")
    .then(function(respuesta) {
      $scope.idiomas = respuesta.data;
      for (i = 0; i < $scope.idiomas.length; i++) {
        if ($scope.idiomas[i].IDIdioma == parseInt(lang)) {
          idiomaencontrado = true;
          console.log("Encuentro mi idioma aqui");
          $scope.idiomaactivo = $scope.idiomas[i].NombreIdioma;
          $scope.flagidiomaactivo = $scope.iconode($scope.idiomas[i].Icono);
        }
      }
    });
    $scope.iconode = function(URLImagen) {
      return configuracionGlobal.api_url + "DownloadFile?fileName=" + URLImagen + "&Tipo=A";
    }
  $scope.checkLoginStatus = function() {
    if (NotNullNotUndefinedNotEmpty($scope.usuario)) {
      if ($scope.usuario.IDUsuario > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    return false;
  }
  $scope.esTipoPropiedad = function(tipo1, tipo2) {
    return tipo1===tipo2;
  }
  $scope.tareasAdicionalesCambioPag = function() {
      $('html, body').animate({scrollTop : 0},500);
      $("nav.navbar.bootsnav > .side").removeClass("on");
      $("body").removeClass("on-side");
      $scope.mostrarFiltros = false;
  }
  $scope.cargarImagenPropiedad = function(propiedad) {
    propiedad.Cargada = true;
    Llamada.http.getArrayByte(propiedad.Valor, "I")
      .then(function(respuesta) {
        propiedad.DataValor = respuesta.data;
      });
  }
  $scope.protectedRoute = function() {
    if ($scope.checkLoginStatus()) {
      return true;
    } else {
      $location.path("/");
      $scope.tareasAdicionalesCambioPag();
      return false;

    }
  }
  anadirErrores = function(error) {
    DevExpress.ui.notify(error, "error", 2000);
  }
  mensajeExito = function(mensaje) {
    DevExpress.ui.notify(mensaje, "success", 2000);
  }
  $scope.usuario = { Login: true }
  $scope.verTiposPublicacion = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/publicaciones")
  }
  $scope.verPublicacionesUsuarios = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/listapublicaciones/usuarios")
  }
  $scope.verUsuario = function(IDUsuario) {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/usuario/" + IDUsuario);
  }
  $scope.irAHome = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/home");
  }
  $scope.calcularTiempo = function(algo) {
    if (NotNullNotUndefinedNotEmpty(algo)) {
      if (NotNullNotUndefinedNotEmpty(algo.Creacion)) {
        if (algo.FechaCarg === true) {
          return algo.FechaDiferencia;
        } else {
          algo.FechaCarg = true;

          fechasep = algo.Creacion.split("T");
          lafecha = fechasep[0].split("-");
          lahora = fechasep[1].split(":");
          var datepub = new Date(parseInt(lafecha[0]), parseInt(lafecha[1])-1, parseInt(lafecha[2]),parseInt(lahora[0]), parseInt(lahora[1]), parseInt(lahora[2]))
          var dateactual = new Date();
          var timeDiff = Math.abs(dateactual.getTime() - datepub.getTime());
          if ((timeDiff / (1000 * 3600 * 24)) <= 1) {
            if ((timeDiff / (1000 * 3600)) <= 1) {
              if (parseInt(timeDiff*0.0000166667) < 2) {
                if (parseInt(timeDiff*0.0000166667) < 1) {
                  algo.FechaDiferencia = "ahora mismo";
                } else {
                  algo.FechaDiferencia = "hace " + parseInt(timeDiff*0.0000166667) + " minuto";
                }
              } else {
                algo.FechaDiferencia = "hace " + parseInt(timeDiff*0.0000166667) + " minutos";
              }
            } else {
              if (parseInt(timeDiff / (1000 * 3600)) < 2) {
                algo.FechaDiferencia = "hace " + parseInt(timeDiff / (1000 * 3600)) + " hora";
              } else {
                algo.FechaDiferencia = "hace " + parseInt(timeDiff / (1000 * 3600)) + " horas";
              }

            }
          } else {
            var diffDays = parseInt(timeDiff / (1000 * 3600 * 24));
            if (diffDays < 2) {
              algo.FechaDiferencia = "hace " + diffDays + " día";
            } else {
              algo.FechaDiferencia = "hace " + diffDays + " días";
              if (diffDays > 30) {
                var meses = parseInt(diffDays/30);
                if (meses >= 12) {
                  var anos = parseInt(meses/12);
                  if (anos < 2) {
                    algo.FechaDiferencia = "hace " + anos + " año";
                  } else {
                    algo.FechaDiferencia = "hace " + anos + " años";
                  }
                } else {
                  if (meses < 2) {
                    algo.FechaDiferencia = "hace " + meses + " mes";
                  } else {
                    algo.FechaDiferencia = "hace " + meses + " meses";
                  }
                }
              }
            }
          }
          return algo.FechaDiferencia;
        }
      } else {
        "no se creacion";
      }
    } else {
      "no se";
    }
  }
  $scope.verCupones = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/cupones")
  }

  $scope.verPublicaciones = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/listapublicaciones")
  }
  $scope.crearPublicacion = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/publicar")
  }
  $scope.verFiltros = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/filtros")
  }
  $scope.crearFiltro = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/crearFiltro")
  }
  anadirPublicacion = function() {
    mensajeExito("Publicación guardada con éxito");
    $scope.tareasAdicionalesCambioPag();
    $location.path("/listapublicaciones");
  }
  $scope.modificarFiltro = function(filtro) {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/modificarFiltro/" + filtro.IDFiltroPrehecho);
  }
  $scope.verPlaylists = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/playlists")
  }
  $scope.obtenerImagenCategoria = function(algo) {
    if (NotNullNotUndefinedNotEmpty(algo)) {
      if (algo.ContenidoMMCargado === true) {
        return algo.DataContenidoMM;
      } else {
        if (algo.ContenidoMMCargando === true) {
          return "img/cargando.gif";
        } else {
          algo.ContenidoMMCargando = true;
          Llamada.http.getArrayByte(algo.Imagen, "A")
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
  $scope.obtenerImagenUsuario = function(algo) {
    if (NotNullNotUndefinedNotEmpty(algo)) {
      if (algo.ContenidoMMCargado === true) {
        return algo.DataContenidoMM;
      } else {
        if (algo.ContenidoMMCargando === true) {
          return "img/cargando.gif";
        } else {
          algo.ContenidoMMCargando = true;
          Llamada.http.getArrayByte(algo.ContenidoMM, "I")
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
  $scope.obtenerImagen = function(algo) {
    if (algo.ContenidoMMCargado === true) {
      return algo.DataContenidoMM;
    } else {
      if (algo.ContenidoMMCargando === true) {
        return "img/cargando.gif";
      } else {
        algo.ContenidoMMCargando = true;
        if (algo.ContenidoMMServidor < 1) {
          algo.ContenidoMMCargando = false;
          algo.ContenidoMMCargado = true;
          algo.DataContenidoMM = algo.ContenidoMM;
          return algo.DataContenidoMM;
        } else {
          Llamada.http.getArrayByte(algo.ContenidoMM, "I")
            .then(function(respuesta) {
              algo.DataContenidoMM = respuesta.data;
              algo.ContenidoMMCargando = false;
              algo.ContenidoMMCargado = true;
            })
        }

      }
    }
  }
  $scope.verPerfiles = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/perfiles");

  }
  $scope.verUsuarioGenerico = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/usuario");
  }
  $scope.verTiposObjeto = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/caracteristicas");
  }
  $scope.modificarTipoObjeto = function(tipoObjeto) {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/modificarCaracteristica/" + tipoObjeto.IDTipoObjeto);
  }
  $scope.LoginUsuario = function(email, contrasena) {
    Llamada.http.getAuthGetAdminToken(email, contrasena)
      .then(function(respuesta) {
        if (respuesta.IDUsuario > 0) {
          $scope.usuario = respuesta;
          $scope.usuario.Login = true;
          $location.path("/home");
          $scope.tareasAdicionalesCambioPag();
        } else {
          anadirErrores("El usuario o la contraseña son incorrectos");
        }
      })
  }
  $scope.verUsuarios = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/verUsuariosAdmin");
  }
  $scope.obtenerImagenInput = function(imagen) {
      var reader = new FileReader();
      var a  = window.URL.createObjectURL(imagen);
      return a;
    }
    $scope.cargarTiposObjeto = function() {
      Llamada.http.get("PropiedadesYObjetosLeer?IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.MenuTiposObjeto = respuesta.data.Objetos;
        })
    }
    $scope.cargarCategorias = function() {
      Llamada.http.get("CategoriasLeer?IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.MenuCategorias = respuesta.data;
        })
    }
    $scope.modificarCategoria = function(categoria) {
      $location.path("/modificarPerfil/" + categoria.IDCategoria);
      $scope.tareasAdicionalesCambioPag();
    }
    $scope.modificarPlan = function(plan) {
      $location.path("/modificarPlan/" + plan.IDPlan);
      $scope.tareasAdicionalesCambioPag();
    }
    $scope.modificarTipoPublicacion = function(publi) {
      $location.path("/modificarPublicacion/" + publi.IDTipoPublicacion);
      TipoPublicacion.Modificar.set(publi);
      $scope.tareasAdicionalesCambioPag();
    }
    $scope.verPlanes = function() {
      $location.path("/planes");
      $scope.tareasAdicionalesCambioPag();
    }
    $scope.verPromociones = function() {
      $location.path("/promociones");
      $scope.tareasAdicionalesCambioPag();
    }
    $scope.modificarPromocion = function(promocion) {
      $location.path("/modificarPromocion/" + promocion.IDPromocion);
      $scope.tareasAdicionalesCambioPag();
    }
    $scope.cargarPlanesYPromos = function() {
      Llamada.http.get("PlanesYPromocionesLeer?IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.MenuPlanes = respuesta.data.Planes;
          $scope.MenuPromociones = respuesta.data.Promociones;
        })
    }
    $scope.cargarTiposPublicacion = function() {
      Llamada.http.get("TiposPublicacionesLeer?IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.MenuTiposPublicacion = respuesta.data;
          Llamada.http.get("PosicionesPublicidadLeer")
            .then(function(respuesta) {
              $scope.posiPubli = respuesta.data;
            })
        })
    }
    uploadInputFile = function(files, donde) {
      var deferred = $q.defer();
      var arr = []
      var y = 0;
      while (y < files.length) {
        var fd = new FormData();
        angular.forEach(files, function (v, k) {
          if (k == y) {
            fd.append('file.jpg', files[k]);
          }
        });
        arr.push({formdata: fd});
        y++
      }
      Llamada.http.postFile(arr[0].formdata, donde)
        .then(function(respuesta) {
          deferred.resolve(respuesta);
        });
        return deferred.promise;
    }
});
