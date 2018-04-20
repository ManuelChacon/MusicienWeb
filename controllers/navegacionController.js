musicien.controller('navegacion', function ($q, $scope, $location, Llamada, $http, Carrito, $window, $sce, Redes, $timeout, configuracionGlobal, oneSignal, $anchorScroll, Lightbox) {
    $scope.canOcultada = false;
    $scope.jsonpillado = false;
    $scope.IDIdioma = 1;
    ObtenerJSONIdioma = function (id) {
        $scope.jsonpillado = true;
        $scope.IDIdioma = id;
        $http.get("idioma" + id + ".json")
            .then(function (respuesta) {
                console.log(respuesta);
                $scope.lang = respuesta.data;
            })
    }
    var lang = localStorage.getItem("musicienLang");
    if (NotNullNotUndefinedNotEmpty(lang)) {
        ObtenerJSONIdioma(lang);
        Llamada.http.get("IdiomasLeer")
            .then(function (respuesta) {
                $scope.idiomas = respuesta.data;
                for (i = 0; i < $scope.idiomas.length; i++) {
                    if ($scope.idiomas[i].IDIdioma == parseInt(lang)) {
                        idiomaencontrado = true;
                        $scope.idiomaactivo = $scope.idiomas[i].NombreIdioma;
                        $scope.flagidiomaactivo = $scope.iconode($scope.idiomas[i].Icono);
                    }
                }
            })
    } else {
        Llamada.http.get("IdiomasLeer")
            .then(function (respuesta) {
                var userLanguage = navigator.language || navigator.userLanguage;
                console.log(userLanguage);
                $scope.idiomas = respuesta.data;
                var idiomaencontrado = false;
                for (i = 0; i < $scope.idiomas.length; i++) {
                    if ($scope.idiomas[i].IDIdioma == parseInt(lang)) {
                        idiomaencontrado = true;
                        console.log("Encuentro mi idioma aqui");
                        $scope.idiomaactivo = $scope.idiomas[i].NombreIdioma;
                        $scope.flagidiomaactivo = $scope.iconode($scope.idiomas[i].Icono);
                        if ($scope.jsonpillado !== true) {
                            //ObtenerJSONIdioma($scope.IDIdioma);
                            //localStorage.setItem("musicienLang", "" + $scope.IDIdioma);
                        }
                    } else {
                        console.log(userLanguage.indexOf($scope.idiomas[i].browser_string) > -1);
                        if (userLanguage.indexOf($scope.idiomas[i].browser_string) > -1) {
                            idiomaencontrado = true;
                            //console.log("Encuentro mi idioma pero no lo tengo asignado");
                            if ($scope.IDIdioma != $scope.idiomas[i].IDIdioma) {
                                langu = $scope.idiomas[i].IDIdioma;
                                localStorage.setItem("musicienLang", "" + langu);
                                //ObtenerJSONIdioma(lang);
                                //console.log("Necesito recargar!");
                                location.reload();
                            } else {
                                $scope.idiomaactivo = $scope.idiomas[i].NombreIdioma;
                                $scope.flagidiomaactivo = $scope.iconode($scope.idiomas[i].Icono);
                                ObtenerJSONIdioma($scope.IDIdioma);
                            }
                        }
                    }
                }
                if (!idiomaencontrado) {
                    //console.log("Mi idioma no lo encontré");
                    langu = "2";
                    localStorage.setItem("musicienLang", "2");
                    location.reload();
                }
            })
    } /*else {
    var userLang = navigator.language || navigator.userLanguage;
    switch (userLang) {
      case "es":
        lang = 1;
        localStorage.setItem("musicienLang", "" + lang);
        break;
        case "en":
          lang = 2;
          localStorage.setItem("musicienLang", "" + lang);
          break;
      default:
        lang = 2;
        localStorage.setItem("musicienLang", "" + lang);
    }
    ObtenerJSONIdioma(lang);
  }*/

    getIdioma = function () {
        if (NotNullNotUndefinedNotEmpty($scope.IDIdioma)) {
            return $scope.IDIdioma;
        } else {
            return "";
        }
    }
    $scope.cambiarIdioma = function (idioma) {
        /*ObtenerJSONIdioma(idioma.IDIdioma);
        $scope.idiomaactivo = idioma.NombreIdioma;
        $scope.flagidiomaactivo = $scope.iconode(idioma.Icono);*/
        localStorage.setItem("musicienLang", "" + idioma.IDIdioma);
        location.reload();
    }
    $scope.iconode = function (URLImagen) {
        return configuracionGlobal.api_url + "DownloadFile?fileName=" + URLImagen + "&Tipo=A";
    }
    getIDUsuario = function () {
        if ($scope.usuario !== null && $scope.usuario !== undefined) {
            if ($scope.usuario.IDUsuario !== null && $scope.usuario.IDUsuario !== undefined) {
                return $scope.usuario.IDUsuario;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    $scope.esPubli = function (publi) {
        if (NotNullNotUndefinedNotEmpty(publi)) {
            if (NotNullNotUndefinedNotEmpty(publi.TipoPubli)) {

                return publi.TipoPubli.Modelo == 2;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    $scope.esCompraVenta = function (publi) {
        if (NotNullNotUndefinedNotEmpty(publi)) {
            if (NotNullNotUndefinedNotEmpty(publi.TipoPubli)) {

                return publi.TipoPubli.Modelo == 1;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    $scope.PlayListCargada = false;
    marcarPlaylistCargada = function () {
        $scope.PlayListCargada = true;
    }

    comprobarLogin = function () {
        var usuario = JSON.parse(sessionStorage.getItem("musicienLogin"));
        console.log(usuario);
        if (NotNullNotUndefinedNotEmpty(usuario)) {
            $scope.usuario = usuario;
            Carrito.compra.inicializarCarrito();
            if ($scope.usuario.IDUsuario > 0) {
                Llamada.http.get("UsuariosLeerDatosPropios?IDUsuario=" + getIDUsuario() + "&IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
                    .then(function (contenido) {

                        $scope.usuario = contenido.data;
                        $scope.usuario.Login = true;
                        if ($scope.usuario.ContenidoMMServidor > 0) {
                            Llamada.http.getArrayByte($scope.usuario.ContenidoMM, "I")
                                .then(function (respuesta) {
                                    $scope.usuario.DataContenidoMM = respuesta.data;
                                })
                        } else {
                            $scope.usuario.DataContenidoMM = $scope.usuario.ContenidoMM;
                        }
                    });
            }
        }
    }
    comprobarLogin();
    $scope.cargarTiposPublicacion = function () {

    }
    $scope.obtenerImagenInput = function (imagen) {
        var reader = new FileReader();
        var a = window.URL.createObjectURL(imagen);
        return a;
    }
    $scope.esTipoPropiedad = function (tipo1, tipo2) {
        return tipo1 === tipo2;
    }
    $scope.transformarFecha = function (fecha) {
        try {
            var res = TransformarFecha(fecha);
            return res;
        } catch (ex) {
            return "";
        }

    }
    $scope.cantidadArticulosCarrito = function () {
        return Carrito.compra.cantidadArticulos();
    }
    $scope.verCarrito = function () {
        $scope.tareasAdicionalesCambioPag();
        $location.path("/carrito")
    }
    $scope.verinicio = function () {
        $location.hash('inicio');
        $anchorScroll();
    }
    $scope.mostrandoChatt = false;
    $scope.claseChat = function () {
        if ($scope.mostrandoChatt) {
            return "chat-general";
        } else {
            return "chat-general-oculto";
        }
    }
    cambiarEstadoChat = function (val) {

        $scope.mostrandoChatt = val;
    }
    $scope.clasecolumna = function () {
        if ($scope.mostrandoChatt) {
            return "";
        } else {
            return "offset-md-1";
        }
    }


    $scope.puedohacer = function () {
        $location.hash('quehacer');
        $anchorScroll();
    }
    $scope.descubre = function () {
        $location.hash('top');
        $anchorScroll();
    }
    $scope.contacto = function () {
        $location.hash('contact');
        $anchorScroll();
    }
    $scope.valorarusertop = function (valor, tipo, musico) {
        if (getIDUsuario() < 1) {
            anadirErrores($scope.lang.poder_valorar_err);
        } else {
            Llamada.http.get("ValoracionesUsuarioCrear?IDUsuarioLector=" + getIDUsuario() + "&IDUsuario=" + musico.IDUsuario + "&Valoracion=" + valor + "&Tipo=" + tipo)
                .then(function (respuesta) {
                    /*var res = -1;
                    for (i = 0; i < $scope.TopMusicos.length; i++) {
                      if ($scope.TopMusicos[i].IDUsuario = musico.IDUsuario) {
                        res = i;
                      }
                    }
                    if (res > -1) {
                      $scope.TopMusicos[i].Valoracion = respuesta.data.Valoracion;
                    }*/
                    console.log(respuesta)
                })
        }
    }
    $scope.obtenerPrecio = function () {
        return Carrito.compra.obtenerPrecio();
    }
    $scope.eliminarPublicacion = function (publicacion, index) {
        Llamada.http.get("PublicacionesEliminar?IDPublicacion=" + publicacion.IDPublicacion)
            .then(function (respuesta) {
                $scope.publicaciones.splice(index, 1);
            })
    }
    $scope.cargarFechaDe = function (propiedad, IDObjeto, IDTipoObjetoCategoria, index) {
        propiedad.FechaCargado = true;
        if (NotNullNotUndefinedNotEmpty(propiedad.Valor)) {
            var fechayhora = propiedad.Valor.split("T");
            var fecha = fechayhora[0];
            var fechasep = fecha.split("-");
            fecha = fechasep[0] + "-";
            if (parseInt(fechasep[1]) < 10) {
                fecha = fecha + "0" + fechasep[1] + "-";
            } else {
                fecha = fecha + fechasep[1] + "-";
            }
            if (parseInt(fechasep[2]) < 10) {
                fecha = fecha + "0" + fechasep[2];
            } else {
                fecha = fecha + fechasep[2];
            }

            document.getElementById(VacioSiUndefined(IDObjeto) + "obj" + VacioSiUndefined(IDTipoObjetoCategoria) + "propiedadfecha" + VacioSiUndefined(index)).value = fecha;
        }

    }
    $scope.NotNull = function (val) {
        if (NotNullNotUndefinedNotEmpty(val)) {
            return true;
        } else {
            return false;
        }
    }
    $scope.cargaInicial = function () {
        var usuario = JSON.parse(sessionStorage.getItem("musicienLogin"));
        Carrito.compra.inicializarCarrito();
        if (NotNullNotUndefinedNotEmpty(usuario)) {
            $scope.usuario = usuario;
            if ($scope.usuario.IDUsuario > 0) {
                Llamada.http.get("UsuariosLeerDatosPropios?IDUsuario=" + getIDUsuario() + "&IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
                    .then(function (contenido) {
                        $scope.usuario = contenido.data;
                        $scope.usuario.Login = true;
                        if ($scope.usuario.ContenidoMMServidor > 0) {
                            Llamada.http.getArrayByte($scope.usuario.ContenidoMM, "I")
                                .then(function (respuesta) {
                                    $scope.usuario.DataContenidoMM = respuesta.data;
                                })
                        } else {
                            $scope.usuario.DataContenidoMM = $scope.usuario.ContenidoMM;
                        }

                        /*for (n = 0; n < $scope.usuario.Categorias.length; n++) {
                          Llamada.http.getArrayByte($scope.usuario.Categorias[n].Imagen, "A", n)
                            .then(function(respuesta) {
                              $scope.usuario.Categorias[respuesta.posi].DataContenidoMM = respuesta.data;
                            })
                        }*/
                        if ($scope.usuario.PreferenciaPublInicial == "T") {
                            $scope.PublicacionesMostradas = "T";
                            $scope.active = 1;
                            Llamada.http.get("PublicacionesLeer?IDUsuarioLector=" + getIDUsuario() + "&IDInicio=&tamPag=5&IDIdioma=" + getIdioma() + "&restricciones=true")
                                .then(function (respuesta) {
                                    console.log("MIra aqui");
                                    $scope.publicaciones = respuesta.data.Publicaciones;
                                    console.log($scope.publicaciones)
                                    for (i = 0; i < $scope.publicaciones.length; i++) {
                                        $scope.publicaciones[i].Comentarios = [];
                                    }
                                    recargarTops();
                                })
                        } else if ($scope.usuario.PreferenciaPublInicial == "F") {
                            $scope.PublicacionesMostradas = "F";
                            $scope.active = 1;
                            Llamada.http.get("PublicacionesLeerSeguidosPor?IDUsuarioLector=" + getIDUsuario() + "&IDInicio=&tamPag=5&IDIdioma=" + getIdioma())
                                .then(function (respuesta) {

                                    $scope.publicaciones = respuesta.data;
                                    console.log($scope.publicaciones)
                                    for (i = 0; i < $scope.publicaciones.length; i++) {
                                        $scope.publicaciones[i].Comentarios = [];
                                    }
                                    Llamada.http.get("PublicacionesUsuariosLeerTops?IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
                                        .then(function (respuesta) {
                                            $scope.TopMusicos = respuesta.data.Usuarios;
                                            $scope.TopPublicaciones = respuesta.data.Publicaciones;
                                            $scope.TopFiltros = respuesta.data.Filtros;
                                        })
                                })
                        } else {
                            Llamada.http.get("UsuariosCambiarPublicacionesPreferentes?IDUsuario=" + getIDUsuario() + "&PreferenciaPublInicial=T")
                                .then(function (respuesta) {
                                    $scope.usuario.PreferenciaPublInicial = "T";
                                    mensajeExito("Puedes activar las notificaciones en cualquier momento pulsando Activar Notificaciones en el desplegable de tu nombre de Usuario");
                                    /*if (confirm("¿Quieres activar las notificaciones de tu dispositivo paa recibir las actualizaciones de los usuarios que te interesan?")) {
                                      $scope.RegistrarUsuario()
                                    } else {
                                      $scope.alerts.push({ type: 'success', msg: "Puedes activar las notificaciones en cualquier momento pulsando en al campana de la parte superior"});
                                    }*/
                                })
                            $scope.PublicacionesMostradas = "T";
                            $scope.active = 1;
                            Llamada.http.get("PublicacionesLeer?IDUsuarioLector=" + getIDUsuario() + "&IDInicio=&tamPag=5&IDIdioma=" + getIdioma() + "&restricciones=true")
                                .then(function (respuesta) {
                                    console.log("MIra aqui");
                                    $scope.publicaciones = respuesta.data.Publicaciones;
                                    console.log($scope.publicaciones)
                                    for (i = 0; i < $scope.publicaciones.length; i++) {
                                        $scope.publicaciones[i].Comentarios = [];
                                    }
                                    Llamada.http.get("PublicacionesUsuariosLeerTops?IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
                                        .then(function (respuesta) {
                                            $scope.TopMusicos = respuesta.data.Usuarios;
                                            $scope.TopPublicaciones = respuesta.data.Publicaciones;
                                        })
                                })
                        }

                    })
                if (!NotNullNotUndefinedNotEmpty($scope.TiposPublicacion)) {
                    Llamada.http.get("TiposPublicacionesLeerPorIDUsuario?IDUsuario=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
                        .then(function (respuesta) {
                            $scope.TiposPublicacion = respuesta.data;
                        })
                }
            } else {
                $scope.usuario.Login = false;
            }

        } else {
            Llamada.http.get("PublicacionesLeer?IDUsuarioLector=&IDInicio=&tamPag=5&IDIdioma=" + getIdioma() + "&restricciones=true")
                .then(function (respuesta) {
                    $scope.restriccionVisible = respuesta.data.VisiblesSinLogin;
                    if ($scope.restriccionVisible === false) {
                        $location.path("/");
                        mensajeExito("Inicia sesión para empezar a disfrutar de Musicien.");
                    }
                    $scope.publicaciones = respuesta.data.Publicaciones;
                    for (i = 0; i < $scope.publicaciones.length; i++) {
                        $scope.publicaciones[i].Comentarios = [];
                    }
                    Llamada.http.get("PublicacionesUsuariosLeerTops?IDUsuarioLector=&IDIdioma=" + getIdioma())
                        .then(function (respuesta) {
                            $scope.TopMusicos = respuesta.data.Usuarios;
                            $scope.TopPublicaciones = respuesta.data.Publicaciones;
                        })
                })
        }
    }
    $scope.cerrarSesionUsuario = function () {
        sessionStorage.clear();
        $scope.usuario = null;
        //$scope.inicio();
        //$scope.cargaInicial();
        $location.path("/");
    }
    recargarTops = function () {
        Llamada.http.get("PublicacionesUsuariosLeerTops?IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
            .then(function (respuesta) {
                $scope.TopMusicos = respuesta.data.Usuarios;
                $scope.TopPublicaciones = respuesta.data.Publicaciones;
                $scope.TopFiltros = respuesta.data.Filtros;
            })
    }
    $scope.alerts = [];

    $scope.addAlert = function () {
        $scope.alerts.push({ msg: 'Another alert!' });
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    $scope.tipoPublicacion = function (tipo, publicacion) {
        if (tipo === null || tipo === undefined || publicacion === null || publicacion === undefined) {
            return false;
        } else {
            return publicacion.Tipo == tipo;
        }
    }
    $scope.cargarMultimedia = function (publicacion) {
        publicacion.estiloMusicien = {
            "background-color": publicacion.Usuario.Color
        }
        if (publicacion !== null && publicacion !== undefined) {
            publicacion.Cargada = true;
            if (!NotNullNotUndefinedNotEmpty(publicacion.Usuario.ContenidoMMServidor)) {
                publicacion.Usuario.ContenidoMMServidor = 1;
            }
            if (publicacion.Usuario.ContenidoMMServidor > 0) {
                Llamada.http.getArrayByte(publicacion.Usuario.ContenidoMM, "I")
                    .then(function (respuesta) {
                        publicacion.Usuario.DataContenidoMM = respuesta.data;
                    })
            } else {
                publicacion.Usuario.DataContenidoMM = publicacion.Usuario.ContenidoMM;
            }
            if (publicacion.ReUsuarioContenidoMMServidor > 0) {
                Llamada.http.getArrayByte(publicacion.ReUsuarioContenidoMM, "I")
                    .then(function (respuesta) {
                        publicacion.ReUsuarioDataContenidoMM = respuesta.data;
                    })
            } else {
                publicacion.ReUsuarioDataContenidoMM = publicacion.ReUsuarioContenidoMM;
            }
        }

    }
    $scope.cargarTopMultimedia = function (publicacion) {
        console.log("Cargando del top")
        if (publicacion !== null && publicacion !== undefined) {
            publicacion.Cargada = true;
            Llamada.http.getArrayByte(publicacion.ContenidoMM, "I")
                .then(function (respuesta) {
                    publicacion.DataContenidoMM = respuesta.data;
                })
            if (!NotNullNotUndefinedNotEmpty(publicacion.Usuario.ContenidoMMServidor)) {
                publicacion.Usuario.ContenidoMMServidor = 1;
            }
            if (publicacion.Usuario.ContenidoMMServidor > 0) {
                Llamada.http.getArrayByte(publicacion.Usuario.ContenidoMM, "I")
                    .then(function (respuesta) {
                        publicacion.Usuario.DataContenidoMM = respuesta.data;
                    })
            } else {
                publicacion.Usuario.DataContenidoMM = publicacion.Usuario.ContenidoMM;
            }
            if (publicacion.ReUsuarioContenidoMMServidor > 0) {
                Llamada.http.getArrayByte(publicacion.ReUsuarioContenidoMM, "I")
                    .then(function (respuesta) {
                        publicacion.ReUsuarioDataContenidoMM = respuesta.data;
                    })
            } else {
                publicacion.ReUsuarioDataContenidoMM = publicacion.ReUsuarioContenidoMM;
            }
        }
    }
    $scope.cargarMusico = function (musico) {
        musico.Cargada = true;
        if (musico.ContenidoMMServidor > 0) {
            Llamada.http.getArrayByte(musico.ContenidoMM, "I")
                .then(function (respuesta) {
                    musico.DataContenidoMM = respuesta.data;
                })
        } else {
            musico.DataContenidoMM = musico.ContenidoMM;
        }
    }
    $scope.cargarAltDe = function (propiedad) {
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
    $scope.preferencias = function () {
        $scope.tareasAdicionalesCambioPag()
        $location.path("/preferencias");
    }
    $scope.meInteresa = function (publicacion) {
        console.log("Ma interesao");
        console.log(publicacion);
        Llamada.http.get("PublicacionesInteresarsePor?IDPublicacion=" + publicacion.IDPublicacion + "&IDUsuario=" + getIDUsuario())
            .then(function (respuesta) {
                console.log(respuesta);
                if (respuesta.data.ID > 0) {
                    mensajeExito(respuesta.data.Resultado);
                } else {
                    anadirErrores(respuesta.data.Resultado);
                }

            })
    }
    $scope.contratar = function () {
        $scope.tareasAdicionalesCambioPag()
        $location.path("/contratar");
    }
    $scope.verPublicacionSiEsImagen = function (publicacion, propiedad) {
        if ($scope.esTipoPropiedad(propiedad.TipoValor, 'I')) {
            $scope.verPublicacion(publicacion);
        }
    }
    $scope.verMasNotificaciones = function () {
        $scope.tareasAdicionalesCambioPag()
        $location.path("/notificaciones");
    }
    $scope.inicio = function () {
        $scope.tareasAdicionalesCambioPag();
        $location.path("/home");
        $scope.cargaInicial();
    }
    $scope.VerPerfiles = function () {
        $scope.tareasAdicionalesCambioPag();
        $location.path("/perfiles");
    }
    $scope.verPerfil = function (usuario) {
        $scope.tareasAdicionalesCambioPag();
        $location.path("/perfil/" + usuario.IDUsuario + "/" + transformarEnRuta(usuario.Nombre))
    }
    $scope.selectPerfil = function (perfil) {
        $scope.tareasAdicionalesCambioPag();
        $location.path("/perfiles/" + perfil.IDCategoria);
    }
    $scope.verPerfilPag = function (usuario, pagina) {
        $scope.tareasAdicionalesCambioPag();
        $location.path("/perfil/" + usuario.IDUsuario + "/" + transformarEnRuta(usuario.Nombre) + "/" + pagina)
    }
    $scope.verPublicacion = function (publicacion) {
        $scope.tareasAdicionalesCambioPag()
        $location.path("/publicacion/" + publicacion.IDPublicacion + "/" + transformarEnRuta(publicacion.Titulo))
    }
    $scope.verComentariosPublicacion = function (publicacion) {
        $scope.tareasAdicionalesCambioPag()
        $location.path("/publicacion/" + publicacion.IDPublicacion + "/" + transformarEnRuta(publicacion.Titulo))
    }
    $scope.tareasAdicionalesCambioPag = function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
        $("nav.navbar.bootsnav > .side").removeClass("on");
        $("body").removeClass("on-side");
        $scope.mostrarFiltros = false;
        $scope.PlayListCargada = false;
        $scope.estabamodificando = false;
        vaciarMensajes();
    }
    $scope.actualizarCat = function (cat) {
        $scope.usuario.Categorias = cat;
        for (i = 0; i < $scope.usuario.Categorias.length; i++) {
            Llamada.http.getArrayByte($scope.usuario.Categorias[i].Imagen, "A", i)
                .then(function (respuesta) {
                    $scope.usuario.Categorias[respuesta.posi].DataContenidoMM = respuesta.data;
                });
        }
    }
    $scope.cargarCatUsuario = function (cat) {
        Llamada.http.getArrayByte(cat.Imagen, "A")
            .then(function (respuesta) {
                cat.DataContenidoMM = respuesta.data;
                var found = false;
                for (i = 0; i < $scope.usuario.Categorias.length; i++) {
                    if ($scope.usuario.Categorias[i].IDUsuarioCategoria == cat.IDUsuarioCategoria) {
                        $scope.usuario.Categorias[i] = cat;
                        found = true;
                    }
                }
                if (!found) {
                    $scope.usuario.Categorias.push(cat);
                }
            })
    }
    $scope.eliminarCatUsuario = function (cat) {
        for (i = 0; i < $scope.usuario.Categorias.length; i++) {
            if ($scope.usuario.Categorias[i].IDUsuarioCategoria == cat.IDUsuarioCategoria) {
                $scope.usuario.Categorias.splice(i, 1);
            }
        }
    }
    $scope.claseCabecera = function () {
        if ($location.path() === "/landing") {
            return "navbar navbar-toggleable-md navbar-light bg-faded top-bar navbar-static-top sps sps--abv  fixed-top"
        } else {
            return "navbar navbar-expand-lg fixed-top menu "
        }
    }
    /*$scope.rutaActiva = function(ruta) {
      if ($location.path() === ruta) {
        return true;
      } else {
        return false;
      }
    }*/
    $scope.rutaActiva = function (rutaActual) {
        return rutaActual === $location.path();
    }
    $scope.cargarMultimediaComentario = function (comentario) {
        comentario.Cargada = true;
        if (comentario !== null && comentario !== undefined) {
            if (comentario.Usuario !== null && comentario.Usuario !== undefined) {
                if (comentario.Usuario.ContenidoMMServidor > 0) {
                    Llamada.http.getArrayByte(comentario.Usuario.ContenidoMM, "I")
                        .then(function (respuesta) {
                            comentario.Usuario.DataContenidoMM = respuesta.data;
                        })
                } else {
                    comentario.Usuario.DataContenidoMM = comentario.Usuario.ContenidoMM;
                }

            }
        }
    }
    anadirPublicacion = function (publicacion) {
        if (NotNullNotUndefinedNotEmpty(publicacion)) {
            publicacion.Usuario = $scope.usuario;
            var n = 0;
            var encontrado = false;
            if ($scope.modificando !== true) {
                if (NotNullNotUndefinedNotEmpty($scope.publicaciones)) {
                    while (!encontrado) {
                        if ($scope.publicaciones[n].Fijado > 0) {
                            n++;
                        } else {
                            encontrado = true;
                        }
                    }
                    $scope.publicaciones.splice(n, 0, publicacion);
                } else {
                    mensajeExito("Publicación modificada con éxito");
                    encontrado = true;
                    modificandoEn(false);
                    $scope.estabamodificando = true;
                }
            } else {
                mensajeExito("Publicación modificada con éxito");
                encontrado = true;
                modificandoEn(false);
                $scope.estabamodificando = true;
            }

        }
    }
    $scope.modificando = false;
    modificandoEn = function (val) {
        $scope.modificando = val;
    }
    anadirErrores = function (error) {
        DevExpress.ui.notify(error, "error", 2000);
    }
    mensajeExito = function (mensaje) {
        DevExpress.ui.notify(mensaje, "success", 2000);
    }
    vaciarMensajes = function () {
        $scope.alerts.splice(0, $scope.alerts.length);
    }
    anadirComentario = function (comentario) {
        if (NotNullNotUndefinedNotEmpty(comentario)) {
            for (i = 0; i < $scope.publicaciones.length; i++) {
                if ($scope.publicaciones[i].IDPublicacion == comentario.IDPublicacion) {
                    $scope.publicaciones[i].ConComentarios = true;
                    comentario.Usuario = $scope.usuario;
                    $scope.publicaciones[i].Comentarios.splice(0, 0, comentario)
                }
            }

        }
    }
    $scope.esComentarioBase = function (comentario) {
        if (comentario.IDComentarioPadre > 0) {
            return false;
        } else {
            return true;
        }
    }
    $scope.hayMasComentarios = function (publicacion) {

    }
    $scope.calcularTiempo = function (algo) {
        if (NotNullNotUndefinedNotEmpty(algo)) {
            if (NotNullNotUndefinedNotEmpty(algo.Creacion)) {
                if (algo.FechaCarg === true) {
                    return algo.FechaDiferencia;
                } else {
                    algo.FechaCarg = true;

                    fechasep = algo.Creacion.split("T");
                    lafecha = fechasep[0].split("-");
                    lahora = fechasep[1].split(":");
                    var datepub = new Date(parseInt(lafecha[0]), parseInt(lafecha[1]) - 1, parseInt(lafecha[2]), parseInt(lahora[0]), parseInt(lahora[1]), parseInt(lahora[2]))
                    var dateactual = new Date();
                    var timeDiff = Math.abs(dateactual.getTime() - datepub.getTime());
                    if ((timeDiff / (1000 * 3600 * 24)) <= 1) {
                        if ((timeDiff / (1000 * 3600)) <= 1) {
                            if (parseInt(timeDiff * 0.0000166667) < 2) {
                                if (parseInt(timeDiff * 0.0000166667) < 1) {
                                    algo.FechaDiferencia = $scope.lang.ahora_mismo;
                                } else {
                                    algo.FechaDiferencia = $scope.lang.inicio_min_singular + " " + parseInt(timeDiff * 0.0000166667) + " " + $scope.lang.fin_minuto_singular;
                                }
                            } else {
                                algo.FechaDiferencia = $scope.lang.inicio_min_plural + " " + parseInt(timeDiff * 0.0000166667) + " " + $scope.lang.fin_min_plural;
                            }
                        } else {
                            if (parseInt(timeDiff / (1000 * 3600)) < 2) {
                                algo.FechaDiferencia = $scope.lang.inicio_h_singular + " " + parseInt(timeDiff / (1000 * 3600)) + " " + $scope.lang.fin_h_singular;
                            } else {
                                algo.FechaDiferencia = $scope.lang.inicio_h_plural + " " + parseInt(timeDiff / (1000 * 3600)) + " " + $scope.lang.fin_h_plural;
                            }

                        }
                    } else {
                        var diffDays = parseInt(timeDiff / (1000 * 3600 * 24));
                        if (diffDays < 2) {
                            algo.FechaDiferencia = $scope.lang.inicio_d_singular + " " + diffDays + " " + $scope.lang.fin_d_singular;
                        } else {
                            algo.FechaDiferencia = $scope.lang.inicio_d_plural + " " + diffDays + " " + $scope.lang.fin_d_plural;
                            if (diffDays > 30) {
                                var meses = parseInt(diffDays / 30);
                                if (meses >= 12) {
                                    var anos = parseInt(meses / 12);
                                    if (anos < 2) {
                                        algo.FechaDiferencia = $scope.lang.inicio_ano_singular + " " + anos + " " + $scope.lang.fin_ano_singular;
                                    } else {
                                        algo.FechaDiferencia = $scope.lang.inicio_ano_plural + " " + anos + " " + $scope.lang.fin_ano_plural;
                                    }
                                } else {
                                    if (meses < 2) {
                                        algo.FechaDiferencia = $scope.lang.inicio_mes_singular + " " + meses + " " + $scope.lang.fin_mes_singular;
                                    } else {
                                        algo.FechaDiferencia = $scope.lang.inicio_mes_plural + " " + meses + " " + $scope.lang.fin_mes_plural;
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
    $scope.TarifasPublicacion = [];
    $scope.calcularTiempoPropiedad = function (algo) {
        algo.FechaCarg = true;
        fechasep = algo.Valor.split("T");
        lafecha = fechasep[0].split("-");
        lahora = fechasep[1].split(":");
        var datepub = new Date(parseInt(lafecha[0]), parseInt(lafecha[1]) - 1, parseInt(lafecha[2]), parseInt(lahora[0]), parseInt(lahora[1]), parseInt(lahora[2]))
        var dateactual = new Date();
        var timeDiff = Math.abs(dateactual.getTime() - datepub.getTime());
        if ((timeDiff / (1000 * 3600 * 24)) <= 1) {
            if ((timeDiff / (1000 * 3600)) <= 1) {
                if (parseInt(timeDiff * 0.0000166667) < 2) {
                    if (parseInt(timeDiff * 0.0000166667) < 1) {
                        algo.FechaDiferencia = "ahora mismo";
                    } else {
                        algo.FechaDiferencia = "desde hace " + parseInt(timeDiff * 0.0000166667) + " minuto";
                    }
                } else {
                    algo.FechaDiferencia = "desde hace " + parseInt(timeDiff * 0.0000166667) + " minutos";
                }
            } else {
                if (parseInt(timeDiff / (1000 * 3600)) < 2) {
                    algo.FechaDiferencia = "desde hace " + parseInt(timeDiff / (1000 * 3600)) + " hora";
                } else {
                    algo.FechaDiferencia = "desde hace " + parseInt(timeDiff / (1000 * 3600)) + " horas";
                }

            }
        } else {
            var diffDays = parseInt(timeDiff / (1000 * 3600 * 24));
            if (diffDays < 2) {
                algo.FechaDiferencia = "desde hace " + diffDays + " día";
            } else {
                algo.FechaDiferencia = "desde hace " + diffDays + " días";
                if (diffDays > 30) {
                    var meses = parseInt(diffDays / 30);
                    if (meses >= 12) {
                        var anos = parseInt(meses / 12);
                        if (anos < 2) {
                            algo.FechaDiferencia = "desde hace " + anos + " año";
                        } else {
                            algo.FechaDiferencia = "desde hace " + anos + " años";
                        }
                    } else {
                        if (meses < 2) {
                            algo.FechaDiferencia = "desde hace " + meses + " mes";
                        } else {
                            algo.FechaDiferencia = "desde hace " + meses + " meses";
                        }
                    }
                }
            }
        }
    }
    $scope.calcularReTiempo = function (algo) {
        if (NotNullNotUndefinedNotEmpty(algo)) {
            if (NotNullNotUndefinedNotEmpty(algo.ReCreacion)) {
                if (algo.FechaReCarg === true) {
                    return algo.FechaReDiferencia;
                } else {
                    algo.FechaReCarg = true;

                    fechasep = algo.ReCreacion.split("T");
                    lafecha = fechasep[0].split("-");
                    lahora = fechasep[1].split(":");
                    var datepub = new Date(parseInt(lafecha[0]), parseInt(lafecha[1]) - 1, parseInt(lafecha[2]), parseInt(lahora[0]), parseInt(lahora[1]), parseInt(lahora[2]))
                    var dateactual = new Date();
                    var timeDiff = Math.abs(dateactual.getTime() - datepub.getTime());
                    if ((timeDiff / (1000 * 3600 * 24)) <= 1) {
                        if ((timeDiff / (1000 * 3600)) <= 1) {
                            if (parseInt(timeDiff * 0.0000166667) < 2) {
                                if (parseInt(timeDiff * 0.0000166667) < 1) {
                                    algo.FechaReDiferencia = "ahora mismo";
                                } else {
                                    algo.FechaReDiferencia = "hace " + parseInt(timeDiff * 0.0000166667) + " minuto";
                                }
                            } else {
                                algo.FechaReDiferencia = "hace " + parseInt(timeDiff * 0.0000166667) + " minutos";
                            }
                        } else {
                            if (parseInt(timeDiff / (1000 * 3600)) < 2) {
                                algo.FechaReDiferencia = "hace " + parseInt(timeDiff / (1000 * 3600)) + " hora";
                            } else {
                                algo.FechaReDiferencia = "hace " + parseInt(timeDiff / (1000 * 3600)) + " horas";
                            }

                        }
                    } else {
                        var diffDays = parseInt(timeDiff / (1000 * 3600 * 24));
                        if (diffDays < 2) {
                            algo.FechaReDiferencia = "hace " + diffDays + " día";
                        } else {
                            algo.FechaReDiferencia = "hace " + diffDays + " días";
                            if (diffDays > 30) {
                                var meses = parseInt(diffDays / 30);
                                if (meses >= 12) {
                                    var anos = parseInt(meses / 12);
                                    if (anos < 2) {
                                        algo.FechaReDiferencia = "hace " + anos + " año";
                                    } else {
                                        algo.FechaReDiferencia = "hace " + anos + " años";
                                    }
                                } else {
                                    if (meses < 2) {
                                        algo.FechaReDiferencia = "hace " + meses + " mes";
                                    } else {
                                        algo.FechaReDiferencia = "hace " + meses + " meses";
                                    }
                                }
                            }
                        }
                    }
                    return algo.FechaReDiferencia;
                }
            } else {
                "no se creacion";
            }
        } else {
            "no se";
        }


    }
    $scope.checkLoginStatus = function () {
        if (NotNullNotUndefinedNotEmpty($scope.usuario)) {
            if ($scope.usuario.Login === true) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    $scope.loadingSeguir = false;
    PonerLoadingTrue = function () {
        $scope.loadingSeguir = true;
    }
    PonerLoadingFalse = function () {
        $scope.loadingSeguir = false;
    }
    ActualizarSeguidorPublicaciones = function (IDUsuario, IDUsuarioSigueUsuario) {
        for (i = 0; i < $scope.publicaciones.length; i++) {
            if ($scope.publicaciones[i].Usuario.IDUsuario == IDUsuario) {
                $scope.publicaciones[i].Usuario.IDUsuarioSigueUsuario = IDUsuarioSigueUsuario;
            }
        }
        PonerLoadingFalse();
    }
    $scope.claseSeguir = function (usuario) {
        if (NotNullNotUndefinedNotEmpty(usuario)) {
            if (NotNullNotUndefinedNotEmpty(usuario.IDUsuarioSigueUsuario)) {
                if (usuario.IDUsuarioSigueUsuario > 0) {
                    return "btn-unfollow";
                } else {
                    return "btn-follow";
                }
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    $scope.claseSeguirMini = function (usuario) {
        if (NotNullNotUndefinedNotEmpty(usuario)) {
            if (NotNullNotUndefinedNotEmpty(usuario.IDUsuarioSigueUsuario)) {
                if (usuario.IDUsuarioSigueUsuario > 0) {
                    return "btn-unfollow";
                } else {
                    return "btn-follow";
                }
            } else {
                return "";
            }
        } else {
            return "";
        }
    }
    $scope.valorSeguir = function (usuario) {
        if (NotNullNotUndefinedNotEmpty(usuario)) {
            if (NotNullNotUndefinedNotEmpty(usuario.IDUsuarioSigueUsuario)) {
                if (usuario.IDUsuarioSigueUsuario > 0) {
                    return "Siguiendo";
                } else {
                    return "Seguir";
                }
            } else {
                return "";
            }
        } else {
            return "";
        }

    }
    $scope.condicionesBloquear = function (usuario) {
        if ($scope.checkLoginStatus()) {
            if (NotNullNotUndefinedNotEmpty(usuario)) {
                if (usuario.IDUsuario == getIDUsuario()) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
    $scope.BloquearDesBloquearUsuario = function (user) {
        if (user.BloqueoUsuario < 1) {
            $scope.BloquearUsuarioPorID(user.IDUsuario)
                .then(function (respuesta) {
                    console.log("holi");
                    user.SoyBloqueador = 1;
                    user.BloqueoUsuario = respuesta;
                    console.log(user);
                })
        } else {
            if (user.SoyBloqueador > 0) {
                Llamada.http.get("UsuarioDesbloqueaUsuario?IDUsuarioBloqueaUsuario=" + user.BloqueoUsuario)
                    .then(function (respuesta) {
                        user.BloqueoUsuario = 0;

                        mensajeExito($scope.lang.usuario_desbloqueado);
                    })
            }
        }

    }
    $scope.DenunciarPublicacion = function (publi) {
        console.log(publi);
        var msj = prompt("Indica el motivo de la denuncia:");
        var dn = {
            TipoObjeto: "P",
            NombreObjeto: publi.Titulo,
            Usuario: publi.Usuario.Nombre,
            IDUsuario: getIDUsuario(),
            IDObjeto: publi.IDPublicacion,
            Texto: msj,
        }
        Llamada.http.post("DenunciaCrear", dn)
            .then(function (respuesta) {
                console.log(respuesta)
                if (respuesta.ID > 0) {
                    mensajeExito(respuesta.Resultado)
                } else {
                    anadirErrores(respuesta.Resultado)
                }

            })
    }
    $scope.BloquearUsuarioPorID = function (IDUsuario) {
        var deferred = $q.defer();
        if (!$scope.checkLoginStatus()) {
            anadirErrores($scope.lang.bloquear_inicio_sesion);
        } else {
            if (IDUsuario == getIDUsuario()) {
                anadirErrores($scope.lang.no_bloquearte);
            } else {
                Llamada.http.get("UsuarioBloqueaUsuario?IDUsuarioBloqueador=" + getIDUsuario() + "&IDUsuarioBloqueado=" + IDUsuario)
                    .then(function (respuesta) {
                        mensajeExito($scope.lang.usuario_bloqueado_exito);
                        deferred.resolve(respuesta.data.ID);
                    })
                return deferred.promise;
            }
        }


    }
    $scope.claseBloquear = function (usuario) {
        if (NotNullNotUndefinedNotEmpty(usuario)) {
            if (NotNullNotUndefinedNotEmpty(usuario.BloqueoUsuario)) {
                if (usuario.BloqueoUsuario > 0) {
                    if (usuario.SoyBloqueador > 0) {
                        return "btn-bloqueado";
                    } else {
                        return "btn-unfollow";
                    }
                } else {
                    return "btn-follow";
                }
            } else {
                return "";
            }
        } else {
            return "";
        }

    }
    $scope.valorBloquear = function (usuario) {
        if (NotNullNotUndefinedNotEmpty(usuario)) {
            if (NotNullNotUndefinedNotEmpty(usuario.BloqueoUsuario)) {
                if (usuario.BloqueoUsuario > 0) {
                    if (usuario.SoyBloqueador > 0) {
                        return "Bloqueado";
                    } else {
                        return "Te ha bloqueado";
                    }
                } else {
                    return "Bloquear";
                }
            } else {
                return "";
            }
        } else {
            return "";
        }
    }
    $scope.LoginSocial = function (red) {
        switch (red) {
            case 'facebook':
                Redes.Sociales.Facebook.Login();
                break;
            case 'twitter':
                Redes.Sociales.Twitter.AuthURL();
                break;
            case 'instagram':
                Redes.Sociales.Instagram.AuthURL();
                break;
            default:
                console.log("red no encontrada")
        }
    }
    if ($location.absUrl().split("?")[1] !== undefined) {
        Redes.Sociales.Twitter.Callback($location.absUrl().split("?")[1])
    }
    $scope.PublicacionesLeerTodas = function () {
        Llamada.http.get("PublicacionesLeer?IDUsuarioLector=" + getIDUsuario() + "&IDInicio=&tamPag=5&IDIdioma=" + getIdioma() + "&restricciones=true")
            .then(function (respuesta) {
                $location.path("/home");
                $scope.PublicacionesMostradas = "T";
                $scope.active = 1;
                $scope.usuariosFiltr = []
                $scope.publicaciones = respuesta.data.Publicaciones;
                for (i = 0; i < $scope.publicaciones.length; i++) {
                    $scope.publicaciones[i].Comentarios = [];
                }

            })
    }
    $scope.PublicacionesLeerSeguidos = function () {
        Llamada.http.get("PublicacionesLeerSeguidosPor?IDUsuarioLector=" + getIDUsuario() + "&IDInicio=&tamPag=5&IDIdioma=" + getIdioma())
            .then(function (respuesta) {
                $scope.PublicacionesMostradas = "F";
                $scope.active = 1;
                $scope.usuariosFiltr = []
                $scope.publicaciones = respuesta.data;
                for (i = 0; i < $scope.publicaciones.length; i++) {
                    $scope.publicaciones[i].Comentarios = [];
                }

            })
    }
    CambiarPrefPublicacionUsuario = function (letra) {
        $scope.usuario.PreferenciaPublInicial = letra;
    }
    $scope.BuscarPorTexto = function () {
        $scope.tareasAdicionalesCambioPag();
        $location.path("/home");
        var a = new FiltrosBusqueda();
        a.Cadena = document.getElementById("textobusqueda").value;
        console.log(a);
        Llamada.http.get("CategoriasLeer?IDIdioma=" + getIdioma())
            .then(function (respuesta) {
                var TemCats = respuesta.data;
                for (i = 0; i < TemCats.length; i++) {
                    TemCats[i].Checked = true;
                }
                a.Categorias = TemCats;
                Llamada.http.post("PublicacionesFiltrar?IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma(), a)
                    .then(function (respuesta) {
                        $scope.PublicacionesMostradas = "B";
                        $scope.publicaciones = respuesta.Publicaciones;
                        for (i = 0; i < $scope.publicaciones.length; i++) {
                            $scope.publicaciones[i].Comentarios = [];
                        }
                        $scope.usuariosFiltr = respuesta.Usuarios;
                    })
            })

    }
    $scope.mostrarFiltros = false;
    $scope.ActivarFiltros = function () {
        if ($scope.mostrarFiltros) {
            $scope.mostrarFiltros = false;
            $scope.PublicacionesLeerTodas();
        } else {
            $scope.PublicacionesMostradas = "R";
            $scope.tareasAdicionalesCambioPag();
            $location.path("/home");
            $scope.mostrarFiltros = true;
            $scope.filtros = new FiltrosBusqueda();
            Llamada.http.get("TiposPublicacionesLeer?IDIdioma=" + getIdioma())
                .then(function (respuesta) {
                    $scope.filtros.TipoPubli = respuesta.data;
                    Llamada.http.get("CategoriasLeer?IDIdioma=" + getIdioma())
                        .then(function (respuesta) {
                            $scope.filtros.Categorias = respuesta.data;
                        })
                })
        }
    }
    $scope.FiltrarPublicaciones = function () {
        $location.path("/home");
        if (NotNullNotUndefinedNotEmpty($scope.filtros.FechaHastaHTML)) {
            $scope.filtros.FechaHasta = TransformarFechaParaServicio($scope.filtros.FechaHastaHTML, "23:59:00");
        }
        if (NotNullNotUndefinedNotEmpty($scope.filtros.FechaDesdeHTML)) {
            $scope.filtros.FechaDesde = TransformarFechaParaServicio($scope.filtros.FechaDesdeHTML, "00:00:00");
        }
        Llamada.http.post("PublicacionesFiltrar?IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma(), $scope.filtros)
            .then(function (respuesta) {
                $scope.PublicacionesMostradas = "B";

                $scope.publicaciones = respuesta.Publicaciones;
                for (i = 0; i < $scope.publicaciones.length; i++) {
                    $scope.publicaciones[i].Comentarios = [];
                }
                $scope.usuariosFiltr = respuesta.Usuarios;
            })
        //"2017-12-20T19:01:35.377"
    }
    $scope.filtrarPorFiltro = function (filtro) {
        $location.path("/home");
        Llamada.http.get("PublicacionesFiltrarPorIDFiltro?IDFiltroPrehecho=" + filtro.IDFiltroPrehecho + "&IDUsuarioLector=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
            .then(function (respuesta) {
                $scope.PublicacionesMostradas = "B";
                $scope.publicaciones = respuesta.data.Publicaciones;
                for (i = 0; i < $scope.publicaciones.length; i++) {
                    $scope.publicaciones[i].Comentarios = [];
                }
                $scope.usuariosFiltr = respuesta.data.Usuarios;
            })
    }
    $scope.RegistrarUsuario = function () {
        /*oneSignal.signal.CheckRegistered()
          .then(function(respuesta) {
            if (!respuesta) {
              oneSignal.signal.Register()
            } else {
            }
          })*/
        oneSignal.signal.Register()
        //oneSignal.signal.Register()
    }
    $scope.AnadirTags = function () {
        oneSignal.signal.SendTag(getIDUsuario());
        Llamada.http.get("ActivarNotificacionesPush?IDUsuario=" + getIDUsuario())
    }
    $scope.clickAccion = function (accion) {
        $scope.usuario.Notificaciones.Cantidad = $scope.usuario.Notificaciones.Cantidad - 1;
        if (accion.Tipo == "P") {
            var a = { IDPublicacion: accion.IDCosa, Titulo: 'publicacion' }
            $scope.verPublicacion(a);
        } else if (accion.Tipo == "U") {
            var a = { IDUsuario: accion.IDCosa, Nombre: 'usuario' }
            $scope.verPerfil(a);
        } else {
            anadirErrores($scope.lang.error_general);
        }
    }
    $scope.clickNotificacion = function (accion, index, subobj) {
        console.log(accion);
        $scope.usuario.Notificaciones.Notific.splice(index, 1);
        if (accion.IDAccionUsuario > 0) {
            Llamada.http.get("AccionesUsuarioMarcarSuscripcionLeida?IDAccionUsuario=" + accion.IDAccionUsuario + "&IDUsuario=" + getIDUsuario() + "&Leida=true")
                .then(function (respuesta) {
                })
            $scope.clickAccion(accion);
        } else if (accion.IDPublicacionInteresUsuario > 0) {
            Llamada.http.get("PublicacionesInteresUsuarioMarcarLeido?IDPublicacionInteresUsuario=" + accion.IDPublicacionInteresUsuario + "&Leido=1")
                .then(function (respuesta) {
                    console.log(respuesta);
                    if (subobj > 0) {
                        var a = { IDPublicacion: accion.IDCosa, Titulo: 'publicacion' }
                        $scope.verPublicacion(a);
                    } else {
                        var a = { IDUsuario: accion.IDUsuario, Nombre: 'usuario' }
                        $scope.verPerfil(a);

                    }
                    $scope.usuario.Notificaciones.Cantidad = $scope.usuario.Notificaciones.Cantidad - 1;
                })

            console.log("Es de compra/venta")
        } else {
            anadirErrores($scope.lang.error_general);
        }

    }
    $scope.vermaspublis = function () {
        console.log("Ver más");
        var idinicio = $scope.publicaciones[$scope.publicaciones.length - 1].IDPublicacion;
        switch ($scope.PublicacionesMostradas) {
            case "B":
                anadirErrores($scope.lang.no_haymas_error);
                break;
            case "T":
                Llamada.http.get("PublicacionesLeer?IDUsuarioLector=" + getIDUsuario() + "&IDInicio=" + idinicio + "&tamPag=5&IDIdioma=" + getIdioma() + "&restricciones=true")
                    .then(function (respuesta) {
                        $scope.publicacionesrecibidas = respuesta.data.Publicaciones;
                        if ($scope.publicacionesrecibidas.length < 1) {
                            anadirErrores($scope.lang.no_haymasp_error);
                        }
                        for (i = 0; i < respuesta.data.length; i++) {
                            $scope.publicacionesrecibidas[i].Comentarios = [];
                        }
                        console.log(respuesta.data);
                        $scope.publicaciones = $scope.publicaciones.concat($scope.publicacionesrecibidas);
                    })


                break;
            case "F":
                Llamada.http.get("PublicacionesLeerSeguidosPor?IDUsuarioLector=" + getIDUsuario() + "&IDInicio=" + idinicio + "&tamPag=5&IDIdioma=" + getIdioma())
                    .then(function (respuesta) {
                        if (respuesta.data.length < 1) {
                            anadirErrores($scope.lang.no_haymasp_error);
                        }
                        for (i = 0; i < respuesta.data.length; i++) {
                            respuesta.data[i].Comentarios = [];
                        }
                        console.log(respuesta.data);
                        $scope.publicaciones = $scope.publicaciones.concat(respuesta.data);
                    })
                break;
            default:
                Llamada.http.get("PublicacionesLeer?IDUsuarioLector=" + getIDUsuario() + "&IDInicio=" + idinicio + "&tamPag=5&IDIdioma=" + getIdioma() + "&restricciones=true")
                    .then(function (respuesta) {
                        $scope.publicacionesrecibidas = respuesta.data.Publicaciones;
                        if ($scope.publicacionesrecibidas.length < 1) {
                            anadirErrores($scope.lang.no_haymasp_error);
                        }
                        for (i = 0; i < respuesta.data.length; i++) {
                            $scope.publicacionesrecibidas[i].Comentarios = [];
                        }
                        console.log(respuesta.data);
                        $scope.publicaciones = $scope.publicaciones.concat($scope.publicacionesrecibidas);
                    })
        }
    }
    $scope.notificacionesActivadas = function () {
        if ($scope.notifconsultadas === true) {
            return !$scope.notificacionesEnabled;
        } else {
            return true;

            try {
                oneSignal.signal.CheckRegistered()
                    .then(function (respuesta) {
                        $scope.notificacionesEnabled = respuesta;
                        $scope.notifconsultadas = true;
                    })
            }
            catch (ex) {
            }

        }
    }
    window.cambioSuscripcion = function (subscribed) {
        if (subscribed === true) {
            oneSignal.signal.SendTag(getIDUsuario());
            $scope.$apply(function () {
                $scope.notificacionesEnabled = subscribed;
            });

        } else {
            $scope.$apply(function () {
                $scope.notificacionesEnabled = subscribed;
            });
        }
    }
    $scope.ponerRojo = function (cantidad) {
        if (cantidad > 0) {
            return 'charSelected';
        } else {
            return "";
        }

    }
    $scope.siEsMio = function (IDUsuario) {
        return IDUsuario == getIDUsuario();
    }
    $scope.ocultarCan = function () {
        $scope.canOcultada = true;
    }
    $scope.iraPerfiles = function () {
        $location.path("/preferencias/perfiles")
    };
    $scope.cargarImagenPropiedad = function (propiedad) {
        propiedad.Cargada = true;
        Llamada.http.getArrayByte(propiedad.Valor, "I")
            .then(function (respuesta) {
                propiedad.DataValor = respuesta.data;
            });
    }
    $scope.cargarImagenesPropiedad = function (propiedad) {
        propiedad.Cargada = true;
        var e = propiedad.Valor.split("#");
        propiedad.DataValor = [];
        for (i = 0; i < e.length; i++) {
            if (NotNullNotUndefinedNotEmpty(e[i])) {
                Llamada.http.getArrayByte(e[i], "I")
                    .then(function (respuesta) {
                        propiedad.DataValor.push(respuesta.data);
                    });
            }
        }
    }
    $scope.cargarPlaylist = function (propiedad, publicacion) {
        propiedad.PlaylistCargado = true;
        if (NotNullNotUndefinedNotEmpty(propiedad.Valor)) {
            var tipo = "";
            var url = "";
            try {
                var a = propiedad.Valor.split("%%%");
                tipo = a[0];
                url = a[1];
            } catch (ex) {
                console.log("Excepción!");
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
                soundcloud.scrolling = "no";
                soundcloud.frameborder = "no";
                soundcloud.src = url;
                document.getElementById("playlist" + publicacion.IDPublicacion + "propi" + propiedad.IDPropiedad + "re" + publicacion.IDRePublicacion).appendChild(soundcloud);
            }
        }
    }
    $scope.cargarFacebook = function (propiedad, publicacion) {
        propiedad.PlaylistCargado = true;
        if (NotNullNotUndefinedNotEmpty(propiedad.Valor)) {
            var tipo = "";
            var url = propiedad.Valor;
            propiedad.TipoPlaylist = tipo;
            propiedad.URLPlaylist = url;
            soundcloud = document.createElement("iframe");
            soundcloud.width = "100%";
            soundcloud.height = "620";
            soundcloud.scrolling = "yes";
            soundcloud.frameborder = "yes";
            soundcloud.allow = "encrypted-media";
            soundcloud.src = url;
            document.getElementById("playlist" + publicacion.IDPublicacion + "propi" + propiedad.IDPropiedad + "re" + publicacion.IDRePublicacion).appendChild(soundcloud);
        }
    }
    $scope.cargarMultimediaFiltro = function (filtro) {
        filtro.Cargada = true;
        Llamada.http.getArrayByte(filtro.ContenidoMM, "A")
            .then(function (respuesta) {
                filtro.DataContenidoMM = respuesta.data;
            })
    }
    $scope.abrirLightbox = function (Imagen) {
        $scope.openLightboxModal(0, [Imagen]);
    }
    $scope.abrirLightboxMultiple = function (Imagenes, index) {
        $scope.openLightboxModal(index, Imagenes);
    }
    $scope.openLightboxModal = function (index, imagenes) {
        Imagenes = [];
        for (i = 0; i < imagenes.length; i++) {
            imagen = {
                url: imagenes[i],
                thumbUrl: imagenes[i]
            }
            Imagenes.push(imagen);
        }
        Lightbox.openModal(Imagenes, index);
    };
    $scope.VisiblesSinPerfil = true;
    comprobarPermisosIniciales = function (idUsuario) {
        Llamada.http.get("SitioLeer?idUsuario=" + idUsuario)
            .then(function (respuesta) {
                console.log("Mira los datos que me llegan:");
                console.log(respuesta.data);
                if (respuesta.data.VisiblesSinLogin === false && respuesta.data.IDUsuario < 1) {
                    $location.path("/");
                    
                }
                $scope.botonEntrar = respuesta.data.VisiblesSinLogin;
                $scope.VisiblesSinPerfil = respuesta.data.VisiblesSinPerfil;
                $scope.cantidadPerfiles = respuesta.data.CantidadPerfiles;
            })
    }
    $scope.VisibilidadSinPerfiles = function () {
        if ($scope.VisiblesSinPerfil !== true) {
            if ($scope.cantidadPerfiles > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
    comprobacionInicial = function () {
        var usuario = JSON.parse(sessionStorage.getItem("musicienLogin"));
        Carrito.compra.inicializarCarrito();
        if (NotNullNotUndefinedNotEmpty(usuario)) {
            if (usuario.IDUsuario > 0) {
                comprobarPermisosIniciales(usuario.IDUsuario);
            } else {
                comprobarPermisosIniciales(0);
            }
        } else {
            comprobarPermisosIniciales(0);
        }

    }
    comprobacionInicial();
});
