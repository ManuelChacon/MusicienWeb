musicien.controller('preferencias2', function ($scope, $location, Llamada, $window, $anchorScroll, $routeParams, $http) {
  if ($scope.checkLoginStatus()) {
    if (NotNullNotUndefinedNotEmpty($routeParams.Perfiles)) {
      $location.hash('perfiles');
      $anchorScroll();
    }
  } else {
    $location.path("/home");
  }
  $scope.cargarCategorias = function() {
    Llamada.http.get("UsuariosCategoriasLeerPorIDUsuario?IDUsuario=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        console.log(respuesta);
        $scope.actualizarCat(respuesta.data);
      })
  }
  if (NotNullNotUndefinedNotEmpty($scope.usuario)) {
    $scope.cargarCategorias();
    console.log($scope.usuario.ContenidoMMBanner)
    Llamada.http.getArrayByte($scope.usuario.ContenidoMMBanner, "I")
      .then(function(respuesta) {
        console.log(respuesta);
        $scope.usuario.DataContenidoMMBanner = respuesta.data;
      })
  } else {
    $scope.cargaInicial();
    $scope.cargarCategorias();
  }
  $scope.cargarLocalizaciones = function () {
      console.log("Holi")
      if ($scope.usuario.Localizacion.length > 4) {
          Llamada.http.get("CiudadesLeer?cadena=" + $scope.usuario.Localizacion)
              .then(function (respuesta) {
                  console.log(respuesta.data);
                  $scope.localidades = respuesta.data.predictionField;
              })
      }
  }
  $scope.cambiarLocalizacion = function (val) {
      $scope.usuario.Localizacion = val;
      $scope.localidades = [];
  }
  $scope.sinFormulario = false;
  $scope.selectPerfil = function(index) {
    $scope.selectingPerfil = false;
    console.log(index);
    Llamada.http.get("CategoriasLeerPropiedadesPorID?IDUsuarioCategoria=" + $scope.usuario.Categorias[index].IDUsuarioCategoria  + "&IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        console.log(respuesta);
        $scope.selectedPerfil = respuesta.data;
      })
  }
  guardarPerfil = function() {
    console.log("Todo listo!!");
    console.log($scope.selectedPerfil);
    Llamada.http.post("UsuariosCategoriasCrearModificar?IDIdioma=" + getIdioma(),$scope.selectedPerfil)
      .then(function(respuesta) {
        console.log(respuesta);
        $scope.selectedPerfil = null;
        $scope.cargarCatUsuario(respuesta);
      })
  }
  RecorrerPropiedadesPerfil = function(index, longitud) {
    if (index < longitud) {
      if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Propiedades[index].ValorFecha)) {
        $scope.selectedPerfil.Propiedades[index].Valor = TransformarFechaParaServicio($scope.selectedPerfil.Propiedades[index].ValorFecha, "23:59:00");
      }
      if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Propiedades[index].newFile)) {
        var arr = []
        var y = 0;
        while (y < $scope.selectedPerfil.Propiedades[index].newFile.length) {
          var fd = new FormData();
          angular.forEach($scope.selectedPerfil.Propiedades[index].newFile, function (v, k) {
            if (k == y) {
              fd.append('file.jpg', $scope.selectedPerfil.Propiedades[index].newFile[k]);
            }
          });
          arr.push({formdata: fd});
          y++
        }
        console.log(arr);
        Llamada.http.postFile(arr[0].formdata, $scope.selectedPerfil.Propiedades[index].TipoValor)
          .then(function(respuesta) {
            console.log(respuesta);
            $scope.selectedPerfil.Propiedades[index].Valor = respuesta.Archivo;
            $scope.selectedPerfil.Propiedades[index].newFile = null;
            index++;
            RecorrerPropiedadesPerfil(index);
          });
      } else {
        index++;
        RecorrerPropiedadesPerfil(index,longitud);
      }
    } else {
      ComprobarObjetos();
    }
  }
  ComprobarObjetos = function() {
    if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Objetos)) {
      RecorrerObjetosPerfil(0, $scope.selectedPerfil.Objetos.length);
    }
  }
  RecorrerObjetosPerfil = function(index, longitud) {
    if (index < longitud) {
      if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Objetos[index].Objetos)) {
        RecorrerObjetosDelTipoObjeto(index, longitud, 0, $scope.selectedPerfil.Objetos[index].Objetos.length);
      } else {
        index++;
        RecorrerObjetosPerfil(index,longitud);
      }
    } else {
      guardarPerfil();
    }
  }
  RecorrerObjetosDelTipoObjeto = function(indextipo, longitudtipo, index, longitud) {
    if (index < longitud) {
      if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Objetos[indextipo].Objetos[index].Propiedades)) {
        RecorrerPropiedadesDelObjeto(indextipo, longitudtipo, index, longitud, 0, $scope.selectedPerfil.Objetos[indextipo].Objetos[index].Propiedades.length);
      } else {
        index++;
        RecorrerObjetosDelTipoObjeto(indextipo, longitudtipo, index, longitud);
      }
    } else {
      indextipo++;
      RecorrerObjetosPerfil(indextipo, longitudtipo);
    }
  }
  RecorrerPropiedadesDelObjeto = function(indextipo, longitudtipo, indexobjeto, longitudobjeto, index, longitud) {
    if (index < longitud) {
      if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto])) {
        if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades)) {
          if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index])) {
            if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index].ValorFecha)) {
              $scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index].Valor = TransformarFechaParaServicio($scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index].ValorFecha, "23:59:00");
            }
            if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index].newFile)) {
              var arr = []
              var y = 0;
              while (y < $scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index].newFile.length) {
                var fd = new FormData();
                angular.forEach($scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index].newFile, function (v, k) {
                  if (k == y) {
                    fd.append('file.jpg', $scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index].newFile[k]);
                  }
                });
                arr.push({formdata: fd});
                y++
              }
              console.log(arr);
              Llamada.http.postFile(arr[0].formdata, $scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index].TipoValor)
                .then(function(respuesta) {
                  console.log(respuesta);
                  $scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index].Valor = respuesta.Archivo;
                  $scope.selectedPerfil.Objetos[indextipo].Objetos[indexobjeto].Propiedades[index].newFile = null;
                  index++;
                  RecorrerPropiedadesPerfil(index);
                });
            } else {
              index++;
              RecorrerPropiedadesDelObjeto(indextipo, longitudtipo, indexobjeto, longitudobjeto, index, longitud);
            }
          } else {
            index++;
            RecorrerPropiedadesDelObjeto(indextipo, longitudtipo, indexobjeto, longitudobjeto, index, longitud);
          }
        } else {
          index++;
          RecorrerPropiedadesDelObjeto(indextipo, longitudtipo, indexobjeto, longitudobjeto, index, longitud);
        }
      } else {
        index++;
        RecorrerPropiedadesDelObjeto(indextipo, longitudtipo, indexobjeto, longitudobjeto, index, longitud);
      }

    } else {
      indexobjeto++;
      RecorrerObjetosDelTipoObjeto(indextipo, longitudtipo, indexobjeto, longitudobjeto);
    }
  }

  $scope.actualizarPerfil = function() {
    console.log($scope.selectedPerfil);
    if (NotNullNotUndefinedNotEmpty($scope.selectedPerfil.Propiedades)) {
      RecorrerPropiedadesPerfil(0,$scope.selectedPerfil.Propiedades.length);
    } else {
      ComprobarObjetos();
    }

  }
  $scope.eliminarPerfil = function() {
    Llamada.http.get("UsuariosCategoriasEliminar?IDUsuarioCategoria=" + $scope.selectedPerfil.IDUsuarioCategoria)
      .then(function(respuesta) {
        $scope.eliminarCatUsuario($scope.selectedPerfil)
        $scope.selectedPerfil = null;
      })
  }
  $scope.esTipoObjeto = function(tipo, tipoObjeto) {
    return tipo == tipoObjeto.Tipo;
  }
  $scope.anadirPerfil = function() {
    $scope.selectingPerfil = true;
    $scope.selectedPerfil = null;
    Llamada.http.get("CategoriasLeer?IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        console.log(respuesta);
        $scope.perfilesdisp = respuesta.data;
        for (i = 0; i < $scope.perfilesdisp.length; i++) {
          Llamada.http.getArrayByte($scope.perfilesdisp[i].Imagen, "A", i)
            .then(function(respuesta) {
              console.log(respuesta);
              $scope.perfilesdisp[respuesta.posi].DataContenidoMM = respuesta.data;
            });
        }
      })
  }
$scope.guardandocambios = false;
  $scope.guardarCambiosUsuario = function() {
    if ($scope.defaultFondoSelected) {
      $scope.usuario.ContenidoMMBanner = "";
    }
    $scope.guardandocambios = true;
    if (!$scope.actualSelected || !$scope.actualFondoSelected) {
      if ($scope.inputSelected) {
        Llamada.http.postFileInput(document.getElementById("exampleFormControlFile1").files[0], "I")
          .then(function(respuesta) {
            $scope.usuario.ContenidoMM = respuesta.Archivo;
            $scope.usuario.DataContenidoMM = document.getElementById("img-contenedor").src;
            if ($scope.inputFondoSelected) {
              Llamada.http.postFileInput(document.getElementById("exampleFormControlFile2").files[0], "I")
                .then(function(respuesta) {
                  $scope.usuario.ContenidoMMBanner = respuesta.Archivo;
                  $scope.usuario.DataContenidoMMBanner = document.getElementById("imgfondo-contenedor").src;
                  Llamada.http.post("UsuariosModificar", $scope.usuario)
                    .then(function(respuesta) {
                      mensajeExito("Datos guardados con éxito");
                      $scope.guardandocambios = false;
                    })
                })


            } else {
              Llamada.http.post("UsuariosModificar", $scope.usuario)
                .then(function(respuesta) {
                  mensajeExito("Datos guardados con éxito");
                  $scope.guardandocambios = false;
                })
            }
          })
      } else {
        if ($scope.defaultSelected) {
          $scope.usuario.ContenidoMM = "defaultprofile.png";
        }
        if ($scope.inputFondoSelected) {
          Llamada.http.postFileInput(document.getElementById("exampleFormControlFile2").files[0], "I")
            .then(function(respuesta) {
              $scope.usuario.ContenidoMMBanner = respuesta.Archivo;
              $scope.usuario.DataContenidoMMBanner = document.getElementById("imgfondo-contenedor").src;
              Llamada.http.post("UsuariosModificar", $scope.usuario)
                .then(function(respuesta) {
                  mensajeExito("Datos guardados con éxito");
                  $scope.guardandocambios = false;
                })
            })


        } else {
          Llamada.http.post("UsuariosModificar", $scope.usuario)
            .then(function(respuesta) {
              mensajeExito("Datos guardados con éxito");
              $scope.guardandocambios = false;
            })
        }
      }
    } else {
      Llamada.http.post("UsuariosModificar", $scope.usuario)
        .then(function(respuesta) {
          mensajeExito("Datos guardados con éxito");
          $scope.guardandocambios = false;
        })
    }
  }
  window.previsualizarFoto = function() {
    var arch = document.getElementById("exampleFormControlFile1").files;
    var reader = new FileReader();
    document.getElementById("img-contenedor").src = window.URL.createObjectURL(arch[0]);
  }
  $scope.selectNewPerfil = function(index) {
    $scope.selectedPerfil = null;
    console.log(index);
    Llamada.http.get("CategoriasLeerPropiedadesPorID?IDCategoria=" + $scope.perfilesdisp[index].IDCategoria  + "&IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        $scope.selectedPerfil = respuesta.data;
        $scope.selectedPerfil.IDUsuario = getIDUsuario();
        $scope.selectingPerfil = false;
      })
  }
  $scope.cancelNewPerfil = function() {
    $scope.selectingPerfil = false;
  }
  $scope.NotInMisPerfiles = function(perfil) {
    var res = true;
    for (i = 0; i < $scope.usuario.Categorias.length; i++) {
      if ($scope.usuario.Categorias[i].IDCategoria == perfil.IDCategoria) {
        res = false;
      }
    }
    return res;
  }

  $scope.actualSelected = true;
  $scope.inputSelected = false;
  $scope.defaultSelected = false;
  $scope.inputSeleccionada = function() {
    if ($scope.inputSelected) {
      return 'select'
    } else {
      return '';
    }
  }
  $scope.defaultSeleccionada = function() {
    if ($scope.defaultSelected) {
      return 'select'
    } else {
      return '';
    }
  }
  $scope.actualSeleccionada = function() {
    if ($scope.actualSelected) {
      return 'select'
    } else {
      return '';
    }
  }
  $scope.cambiarPorActual = function() {
    $scope.actualSelected = true;
    $scope.inputSelected = false;
    $scope.defaultSelected = false;
  }
  $scope.cambiarPorDefault = function() {
    $scope.actualSelected = false;
    $scope.inputSelected = false;
    $scope.defaultSelected = true;
  }
  $scope.cambiarPorInput = function() {
    $scope.actualSelected = false;
    $scope.inputSelected = true;
    $scope.defaultSelected = false;
  }


  $scope.actualFondoSelected = true;
  $scope.inputFondoSelected = false;
  $scope.defaultFondoSelected = false;
  window.previsualizarFondo = function() {
    var arch = document.getElementById("exampleFormControlFile2").files;
    var reader = new FileReader();
    document.getElementById("imgfondo-contenedor").src = window.URL.createObjectURL(arch[0]);
  }
  $scope.inputFondoSeleccionada = function() {
    if ($scope.inputFondoSelected) {
      return 'select'
    } else {
      return '';
    }
  }
  $scope.actualFondoSeleccionada = function() {
    if ($scope.actualFondoSelected) {
      return 'select'
    } else {
      return '';
    }
  }
  $scope.defaultFondoSeleccionada = function() {
    if ($scope.defaultFondoSelected) {
      return 'select'
    } else {
      return '';
    }
  }
  $scope.cambiarFondoPorActual = function() {
    $scope.actualFondoSelected = true;
    $scope.inputFondoSelected = false;
    $scope.defaultFondoSelected = false;
  }
  $scope.cambiarFondoPorInput = function() {
    $scope.actualFondoSelected = false;
    $scope.inputFondoSelected = true;
    $scope.defaultFondoSelected = false;
  }
  $scope.cambiarPorFondoDefault = function() {
    $scope.actualFondoSelected = false;
    $scope.inputFondoSelected = false;
    $scope.defaultFondoSelected = true;
  }
  ControlarCambio = function(newObjeto, tipoObjeto) {
    truenew = JSON.parse("" + JSON.stringify(newObjeto));
    truenew.Random = Aleatorio(1001, 9999);
    tipoObjeto.Objetos.push(truenew);
  }
  $scope.modificarObjeto = function(objeto) {
    if (objeto.Modificando === true) {
      objeto.Modificando = false;
    } else {
      objeto.Modificado = 1;
      objeto.Modificando = true;
    }
  }
  $scope.dejardemodificarObjeto = function(objeto) {
    objeto.Modificando = false;
  }
  $scope.EstoyModificandoObjeto = function(objeto) {
    if (NotNullNotUndefinedNotEmpty(objeto)) {
      if (NotNullNotUndefinedNotEmpty(objeto.Modificando)) {
        return objeto.Modificando;
      } else {
        objeto.Modificando = false;
        return false;
      }
    } else {
      return false;
    }
  }
  $scope.eliminarObjeto = function(tipoObjeto, index) {
    if (tipoObjeto.Objetos[index].IDUsuarioCategoriaTiposObjetoObjeto > 0) {
      if (!NotNullNotUndefinedNotEmpty(tipoObjeto.ObjetosElim)) {
        tipoObjeto.ObjetosElim = []
      }
      tipoObjeto.ObjetosElim.push(tipoObjeto.Objetos.splice(index,1)[0]);
    } else {
      tipoObjeto.Objetos.splice(index,1);
    }
  }
  window.archivoSubido = function(esto) {
    console.log("Archivo subido!!")
    console.log(esto);
    console.log(esto.id);
    console.log("mira el objeto!");
    console.log(esto.id);
    index = parseInt(esto.id.split("propiedad")[1]);
    if (esto.id.split("propiedad")[0] != "obj") {
      console.log("Esto hay antes" + esto.id.split("propiedad")[0]);
      var indexes = esto.id.split("propiedad")[0];
      var indexplit = indexes.split("obj");
      var IDObjeto = parseInt(indexplit[0]);
      var IDTipoObjetoCategoria = parseInt(indexplit[1]);
      console.log("IDObjeto:" + IDObjeto + "IDtaltal:" + IDTipoObjetoCategoria);
      var ubicacion = -1;
      console.log("Perfil seleccionado:");
      console.log( $scope.selectedPerfil.Objetos);
      for (r = 0; r < $scope.selectedPerfil.Objetos.length; r++) {
        console.log("Mirando en:" + $scope.selectedPerfil.Objetos[r].IDTipoObjetoCategoria);
        console.log($scope.selectedPerfil.Objetos[r].IDTipoObjeto, IDTipoObjetoCategoria);
        if ($scope.selectedPerfil.Objetos[r].IDTipoObjeto == IDTipoObjetoCategoria) {

          ubicacion = r;
        }
      }
      if (ubicacion > -1) {
        var ubiobjeto = -1;
        for (h = 0; h < $scope.selectedPerfil.Objetos[ubicacion].Objetos.length; h++) {
          if ($scope.selectedPerfil.Objetos[ubicacion].Objetos[h].IDObjeto == IDObjeto) {
            if ($scope.EstoyModificandoObjeto($scope.selectedPerfil.Objetos[ubicacion].Objetos[h])) {
              ubiobjeto = h;
            } else {
            }
          }
        }
        if (ubiobjeto > -1) {
          console.log("Aquiii")
          console.log(  $scope.selectedPerfil.Objetos[ubicacion].Objetos[ubiobjeto].Propiedades[index])
          var extensionPermitida = tipoPermitido($scope.selectedPerfil.Objetos[ubicacion].Objetos[ubiobjeto].Propiedades[index].TipoValor);
          if (esto.files[0].type.indexOf(extensionPermitida) > -1) {
            $scope.$apply(function () {
              console.log(esto.files[0]);
              $scope.selectedPerfil.Objetos[ubicacion].Objetos[ubiobjeto].Propiedades[index].newContenidoMM = $scope.obtenerImagenInput(esto.files[0]);
              $scope.selectedPerfil.Objetos[ubicacion].Objetos[ubiobjeto].Propiedades[index].newFile = esto.files;
              $scope.selectedPerfil.Objetos[ubicacion].Objetos[ubiobjeto].Propiedades[index].fileName = esto.files[0].name;
            });
          } else {
            anadirErrores($scope.lang.no_permitido_error);
          }
        } else {
          anadirErrores($scope.lang.error_general);
        }
      } else {
        anadirErrores($scope.lang.error_general);
      }
    } else {
      console.log(index);
      var extensionPermitida = tipoPermitido($scope.selectedPerfil.Propiedades[index].TipoValor);
      if (esto.files[0].type.indexOf(extensionPermitida) > -1) {
        $scope.$apply(function () {
          console.log(esto.files[0]);
          $scope.selectedPerfil.Propiedades[index].newContenidoMM = $scope.obtenerImagenInput(esto.files[0]);
          $scope.selectedPerfil.Propiedades[index].newFile = esto.files;
          $scope.selectedPerfil.Propiedades[index].fileName = esto.files[0].name;
        });
      } else {
        anadirErrores($scope.lang.no_permitido_error);
      }
    }


  }
  $scope.noestipo = function(propiedad, tipo) {
    if (propiedad.TipoValor == tipo) {
      return false;
    } else {
      return true;
    }
  }
  $scope.noesfecha = function(propiedad) {
    if (!$scope.noestipo(propiedad,'Y') || !$scope.noestipo(propiedad,'D')) {
      return false;
    } else {
      return true;
    }
  }
  $scope.LeerPlanes = function() {
    $scope.planescargados = true;
    Llamada.http.get("UsuariosPlanesYPromocionesLeerPorIDUsuario?IDUsuario=" + getIDUsuario()  + "&IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        console.log(respuesta);
        $scope.planesu = respuesta.data.Planes;
        $scope.promocionesu = respuesta.data.Promociones;
        for (i = 0; i < $scope.promocionesu.length; i++) {
          $scope.promocionesu[i].FechaFin = $scope.transformarFecha($scope.promocionesu[i].FechaFin).Fecha;
        }
        for (i = 0; i < $scope.planesu.length; i++) {
          $scope.planesu[i].FechaFin = $scope.transformarFecha($scope.planesu[i].FechaFin).Fecha;
        }
      })
  }
  tipoPermitido = function(TipoValor) {
    var comp = "";
    switch (TipoValor) {
      case "I":
        comp = "image";
        break;
        case "S":
          comp = "audio";
          break;
          case "V":
            comp = "video";
            break;
      default:

    }
    return comp;
  }
$scope.anularPromo = function(promo, index) {
  if (NotNullNotUndefinedNotEmpty(promo)) {
    if (!NotNullNotUndefinedNotEmpty(promo.FechaFin)) {
      texto = "¿Estás seguro de que deseas anular esta promoción?";
    } else {
      texto = "¿Estás seguro de que deseas reactivar esta promoción?";
    }
  }
  result = DevExpress.ui.dialog.confirm(texto);
  result.then(function(val) {
    if (val) {
      Llamada.http.get("UsuariosPromocionesDesPagar?IDUsuarioPromocionPeriodo=" + promo.IDUsuarioPromocionPeriodo)
        .then(function(respuesta) {
          $scope.promocionesu[index].FechaFin = respuesta.data.Resultado;
        })
    }
  })

  }
  $scope.estaanulado = function(algo) {
    if (NotNullNotUndefinedNotEmpty(algo)) {
      if (!NotNullNotUndefinedNotEmpty(algo.FechaFin)) {
        return "fa fa-trash-o";
      } else {
        return "fa fa-refresh";
      }
    } else {
      return "";
    }

  }
  $scope.anularPlan = function(plan, index) {
    if (NotNullNotUndefinedNotEmpty(plan)) {
      if (!NotNullNotUndefinedNotEmpty(plan.FechaFin)) {
        texto = "¿Estás seguro de que deseas anular este plan?";
      } else {
        texto = "¿Estás seguro de que deseas reactivar este plan?";
      }
    }
    result = DevExpress.ui.dialog.confirm(texto);
    result.then(function(val) {
      if (val) {
        Llamada.http.get("UsuariosPlanesDesPagar?IDUsuarioPlanPeriodos=" + plan.IDUsuarioPlanPeriodos)
          .then(function(respuesta) {
            $scope.planesu[index].FechaFin = respuesta.data.Resultado;
          })
      }
    })
  }
  comprobarPermisos();
});
