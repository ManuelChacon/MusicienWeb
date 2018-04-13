musicien.controller('planes', function ($scope, Llamada, $location) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("PlanesYPromocionesLeer?IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        $scope.Planes = respuesta.data.Planes;
      });
    }
    $scope.eliminarPlan = function(plan, index) {
      result = DevExpress.ui.dialog.confirm("¿Seguro que deseas eliminar este plan?");
      result.then(function(val) {
        if (val) {
          $scope.Planes.splice(index,1);
          Llamada.http.get("PlanesEliminar?IDPlan=" + plan.IDPlan)
            .then(function(respuesta) {

            })
        }
      });

    }
    $scope.crearPlan = function() {
      $scope.tareasAdicionalesCambioPag();
      $location.path("/crearPlan");
    }
});
musicien.controller('modificarPlan', function ($scope, Llamada, $location, $routeParams) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("TiposPublicacionesLeer?IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        $scope.publicaciones = respuesta.data;
      })
    if (NotNullNotUndefinedNotEmpty($routeParams.IDPlan)) {
      Llamada.http.get("PlanesLeerPorIDPlan?IDPlan=" + $routeParams.IDPlan + "&Modificar=true&IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.plan = respuesta.data;
          Llamada.http.getArrayByte($scope.plan.ContenidoMM, "A")
            .then(function(respuesta) {
              $scope.plan.newContenidoMM = respuesta.data;
              Llamada.http.getArrayByte($scope.plan.Imagen1, "A")
                .then(function(respuesta) {
                  $scope.plan.newImagen1 = respuesta.data;
                })
                Llamada.http.getArrayByte($scope.plan.Imagen2, "A")
                  .then(function(respuesta) {
                    $scope.plan.newImagen2 = respuesta.data;
                  })
                  Llamada.http.getArrayByte($scope.plan.Imagen3, "A")
                    .then(function(respuesta) {
                      $scope.plan.newImagen3 = respuesta.data;
                    })
            })
        });
      } else {
        Llamada.http.get("PlanesLeerVacia")
          .then(function(respuesta) {
            $scope.plan = respuesta.data;
          });
      }
    }
    $scope.guardarCambios = function() {
      if (NotNullNotUndefinedNotEmpty($scope.plan.newFile)) {
        uploadInputFile($scope.plan.newFile, "A")
          .then(function(respuesta) {
            $scope.plan.ContenidoMM = respuesta.Archivo;
            $scope.plan.newFile = null;
            comprobarImagen1();
          })
      } else {
        comprobarImagen1();
      }
    }
    comprobarImagen1 = function() {
      if (NotNullNotUndefinedNotEmpty($scope.plan.newFile1)) {
        uploadInputFile($scope.plan.newFile1, "A")
          .then(function(respuesta) {
            $scope.plan.Imagen1 = respuesta.Archivo;
            $scope.plan.newFile1 = null;
            comprobarImagen2();
          })
      } else {
        comprobarImagen2();
      }
    }
    comprobarImagen2 = function() {
      if (NotNullNotUndefinedNotEmpty($scope.plan.newFile2)) {
        uploadInputFile($scope.plan.newFile2, "A")
          .then(function(respuesta) {
            $scope.plan.Imagen2 = respuesta.Archivo;
            $scope.plan.newFile2 = null;
            comprobarImagen3();
          })
      } else {
        comprobarImagen3();
      }
    }
    comprobarImagen3 = function() {
      if (NotNullNotUndefinedNotEmpty($scope.plan.newFile3)) {
        uploadInputFile($scope.plan.newFile3, "A")
          .then(function(respuesta) {
            $scope.plan.Imagen3 = respuesta.Archivo;
            $scope.plan.newFile3 = null;
            GuardarCambios();
          })
      } else {
        GuardarCambios();
      }

    }
    GuardarCambios = function() {
      Llamada.http.post("PlanesCrearModificar?IDIdioma=" + getIdioma(), $scope.plan)
        .then(function(respuesta) {
          $scope.tareasAdicionalesCambioPag();
          $location.path("/planes");
          mensajeExito("Los datos se han guardado con éxito");
        })
    }
    window.cambioImagenPlan = function(esto) {
      $scope.$apply(function () {
        $scope.plan.newContenidoMM = $scope.obtenerImagenInput(esto.files[0]);
        $scope.plan.newFile = esto.files;
      });
    }
    window.cambioImagenDesc = function(esto, cual) {
      $scope.$apply(function () {
        switch (parseInt(cual)) {
          case 1:
            $scope.plan.newImagen1 = $scope.obtenerImagenInput(esto.files[0]);
            $scope.plan.newFile1 = esto.files;
            break;
            case 2:
              $scope.plan.newImagen2 = $scope.obtenerImagenInput(esto.files[0]);
              $scope.plan.newFile2 = esto.files;
              break;
              case 3:
                $scope.plan.newImagen3 = $scope.obtenerImagenInput(esto.files[0]);
                $scope.plan.newFile3 = esto.files;
                break;
          default:
          anadirErrores("No encontré cual quieres cambiar");
        }
      });
    }
    $scope.cambioPublicacion = function(){
      if (NotNullNotUndefinedNotEmpty($scope.selectedPubli)) {
        if (!NotNullNotUndefinedNotEmpty($scope.plan.Publicaciones)) {
          $scope.plan.Publicaciones = [];
        }
        $scope.plan.Publicaciones.push(JSON.parse($scope.selectedPubli));
      }

    }
    $scope.noenpublis = function(publi) {
      var res = true;
      if (NotNullNotUndefinedNotEmpty($scope.plan.Publicaciones)) {
        for (n = 0; n < $scope.plan.Publicaciones.length; n++) {
          if ($scope.plan.Publicaciones[n].IDTipoPublicacion == publi.IDTipoPublicacion) {
            res = false;
          }
        }
      }
      return res;
    }
    $scope.eliminarPublicacion = function(index) {
      var a = $scope.plan.Publicaciones.splice(index,1);
      if (!NotNullNotUndefinedNotEmpty($scope.plan.PublicacionesElim)) {
        $scope.plan.PublicacionesElim = [];
      }
      $scope.plan.PublicacionesElim.push(a[0]);
    }
});
musicien.controller('promociones', function ($scope, Llamada, $location) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("PlanesYPromocionesLeer?IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        $scope.Promociones = respuesta.data.Promociones;
      });
    }
  $scope.crearPromocion = function() {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/crearPromocion");

  }
  $scope.eliminarPromocion = function(promocion, index) {
    result = DevExpress.ui.dialog.confirm("¿Seguro que deseas eliminar esta publicación?");
    result.then(function(val) {
      if (val) {
        Llamada.http.get("PromocionesEliminar?IDPromocion=" + promocion.IDPromocion)
          .then(function(respuesta) {
            $scope.Promociones.splice(index, 1);
          })
      }
    });

  }
});
musicien.controller('modificarPromocion', function ($scope, Llamada, $location, $routeParams) {
  if ($scope.protectedRoute()) {
    if (NotNullNotUndefinedNotEmpty($routeParams.IDPromocion)) {
      Llamada.http.get("PromocionesLeerPorIDPromocion?IDPromocion=" + $routeParams.IDPromocion + "&Modificar=true&IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.promocion = respuesta.data;
          Llamada.http.get("PlanesYPromocionesLeer?IDIdioma=" + getIdioma())
            .then(function(respuesta) {
              $scope.planes = respuesta.data.Planes;
            })
            Llamada.http.getArrayByte($scope.promocion.ContenidoMM, "A")
              .then(function(respuesta) {
                $scope.promocion.newContenidoMM = respuesta.data;
              })
        });
    } else {
      Llamada.http.get("PromocionesLeerVacia")
        .then(function(respuesta) {
          $scope.promocion = respuesta.data;
          Llamada.http.get("PlanesYPromocionesLeer?IDIdioma=" + getIdioma())
            .then(function(respuesta) {
              $scope.planes = respuesta.data.Planes;
            })
        });
    }
  }
  window.cambioImagenPromocion = function(esto) {
    $scope.$apply(function () {
      $scope.promocion.newContenidoMM = $scope.obtenerImagenInput(esto.files[0]);
      $scope.promocion.newFile = esto.files;
    });
  }
  $scope.guardarCambios = function() {
    if (NotNullNotUndefinedNotEmpty($scope.promocion.newFile)) {
      uploadInputFile($scope.promocion.newFile, "A")
        .then(function(respuesta) {;
          $scope.promocion.ContenidoMM = respuesta.Archivo;
          $scope.promocion.newFile = null;
          comprobarImagen1();
        })
    } else {
      comprobarImagen1();
    }
  }
  comprobarImagen1 = function() {
    if (NotNullNotUndefinedNotEmpty($scope.promocion.newFile1)) {
      uploadInputFile($scope.promocion.newFile1, "A")
        .then(function(respuesta) {
          $scope.promocion.Imagen1 = respuesta.Archivo;
          $scope.promocion.newFile1 = null;
          comprobarImagen2();
        })
    } else {
      comprobarImagen2();
    }
  }
  comprobarImagen2 = function() {
    if (NotNullNotUndefinedNotEmpty($scope.promocion.newFile2)) {
      uploadInputFile($scope.promocion.newFile2, "A")
        .then(function(respuesta) {
          $scope.promocion.Imagen2 = respuesta.Archivo;
          $scope.promocion.newFile2 = null;
          comprobarImagen3();
        })
    } else {
      comprobarImagen3();
    }
  }
  comprobarImagen3 = function() {
    if (NotNullNotUndefinedNotEmpty($scope.promocion.newFile3)) {
      uploadInputFile($scope.promocion.newFile3, "A")
        .then(function(respuesta) {
          $scope.promocion.Imagen3 = respuesta.Archivo;
          $scope.promocion.newFile3 = null;
          GuardarCambios();
        })
    } else {
      GuardarCambios();
    }
  }
  window.cambioImagenDesc = function(esto, cual) {
    $scope.$apply(function () {
      switch (parseInt(cual)) {
        case 1:
          $scope.promocion.newImagen1 = $scope.obtenerImagenInput(esto.files[0]);
          $scope.promocion.newFile1 = esto.files;
          break;
          case 2:
            $scope.promocion.newImagen2 = $scope.obtenerImagenInput(esto.files[0]);
            $scope.promocion.newFile2 = esto.files;
            break;
            case 3:
              $scope.promocion.newImagen3 = $scope.obtenerImagenInput(esto.files[0]);
              $scope.promocion.newFile3 = esto.files;
              break;
        default:
        anadirErrores("No encontré cual quieres cambiar");
      }
    });
  }
  GuardarCambios = function() {
    Llamada.http.post("PromocionesCrearModificar?IDIdioma=" + getIdioma(), $scope.promocion)
      .then(function(respuesta) {
        $scope.tareasAdicionalesCambioPag();
        $location.path("/promociones");
        mensajeExito("Los datos se han guardado con éxito");
      })
  }
  $scope.eliminarPlan = function(index) {
    if (!NotNullNotUndefinedNotEmpty($scope.promocion.PlanesElim)) {
      $scope.promocion.PlanesElim = [];
    }
    $scope.promocion.PlanesElim.push($scope.promocion.Planes.splice(index,1)[0]);
  }
  $scope.noenplanes = function(plan) {
    var res = true;
    for (n = 0; n < $scope.promocion.Planes.length; n++) {
      if ($scope.promocion.Planes[n].IDPlan == plan.IDPlan) {
        res = false;
      }
    }
    return res;
  }
  $scope.anadirPlan = function() {
    if (NotNullNotUndefinedNotEmpty($scope.newPlan)) {
      if (!NotNullNotUndefinedNotEmpty($scope.promocion.Planes)) {
        $scope.promocion.Planes = [];
      }
      $scope.promocion.Planes.push(JSON.parse($scope.newPlan));
    }

  }

});
