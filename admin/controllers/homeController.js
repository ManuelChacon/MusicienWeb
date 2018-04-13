musicien.controller('home', function ($scope, Llamada) {
  $scope.pagina = 0;
  $scope.usuarios = [];
  if ($scope.protectedRoute()) {
    console.log("Estmos en home");
    Llamada.http.get("EstadisticasInicialesLeer")
      .then(function(respuesta) {
        console.log(respuesta.data);
        $scope.estadisticas = respuesta.data;
        $scope.cambioPagina(1)
      })
  }
  $scope.calcularPorcentaje = function(cifra1, cifra2) {
    var a = (cifra1*100)/cifra2;
    return (100-a).toFixed(2);
  }
  $scope.iconup = function(cifra1, cifra2) {
    if (cifra1 > cifra2) {
      return "fa fa-sort-asc";
    } else {
      return "fa fa-sort-desc";
    }
  }
  TratarUsuarios = function(usuarios) {
    $scope.usuarios.push(usuarios);
  }
  $scope.haciaAdelante = function(val) {
    cadena = "";
    var a = parseInt(JSON.parse(JSON.stringify("" + $scope.pagina)));
    b = +(a)+1;
      console.log(a);
      //console.log($scope.usuarios);
      switch ($scope.active) {
        case 1:
          if (NotNullNotUndefinedNotEmpty($scope.usuarios[b])) {
            $scope.pagina++;
          } else {
            cadena = "UsuariosLeer";
            var idInicio = $scope.usuarios[a][$scope.usuarios[a].length-1].IDUsuario;
            Llamada.http.get(cadena + "?idInicio=" + idInicio + "&tamPag=10")
              .then(function(respuesta) {
                if (respuesta.data.length < 1) {
                  anadirErrores("No hay más resultados que mostrar");
                } else {
                  TratarUsuarios(respuesta.data);
                  $scope.pagina++;
                }
              })
          }
          break;
          case 2:
            if (NotNullNotUndefinedNotEmpty($scope.usuarios[b])) {
              $scope.pagina++;
            } else {
              cadena = "UsuariosLeerNuevos";
              var idInicio = $scope.usuarios[a][$scope.usuarios[a].length-1].IDUsuario;
              Llamada.http.get(cadena + "?idInicio=" + idInicio + "&tamPag=10")
                .then(function(respuesta) {
                  if (respuesta.data.length < 1) {
                    anadirErrores("No hay más resultados que mostrar");
                  } else {
                    TratarUsuarios(respuesta.data);
                    $scope.pagina++;
                  }
                })
            }
            break;
            case 3:
              comprobarPlanesOPromos(a, val);
              break;
              case 4:
              console.log("Voy a cambiar las acciones");
              console.log($scope.actions);
                if (NotNullNotUndefinedNotEmpty($scope.actions[b])) {
                  $scope.pagina++;
                } else {
                  cadena = "AccionesUsuariosLeer";
                  var idInicio = $scope.actions[a][$scope.actions[a].length-1].Creacion;
                  Llamada.http.get(cadena + "?FechaInicio=" + idInicio + "&tamPag=10")
                    .then(function(respuesta) {
                      if (respuesta.data.length < 1) {
                        anadirErrores("No hay más resultados que mostrar");
                      } else {
                        TratarAcciones(respuesta.data);
                        $scope.pagina++;
                      }
                    })
                }
                break;
                case 5:
                  if (NotNullNotUndefinedNotEmpty($scope.publicaciones[b])) {
                    $scope.pagina++;
                  } else {
                    var idInicio = $scope.publicaciones[a][$scope.publicaciones[a].length-1].IDPublicacion;
                    Llamada.http.get("PublicacionesLeer?IDUsuarioLector=&IDInicio=" + idInicio +"&tamPag=10&IDIdioma=" + getIdioma())
                      .then(function(respuesta) {
                        if (respuesta.data.length < 1) {
                          anadirErrores("No hay más resultados que mostrar");
                        } else {
                          TratarPublicaciones(respuesta.data);
                          $scope.pagina++;
                        }
                      })
                  }

                  break;
        default:
          anadirErrores("Ha ocurrido un error");
      }

  }
  comprobarPlanesOPromos = function(a, val) {
    b = +(a)+1;
    switch (val) {
      case 1:
        if (NotNullNotUndefinedNotEmpty($scope.planesperiodos[b])) {
          $scope.pagina++;
        } else {
          console.log("Planes");
          console.log($scope.planesperiodos);
          console.log(a);
          var idInicio = $scope.planesperiodos[a][$scope.planesperiodos[a].length-1].IDUsuarioPlanPeriodos;
          console.log(idInicio);
          Llamada.http.get("PlanesPeriodosLeer?idInicio=" + idInicio + "&tamPag=10&IDIdioma=" + getIdioma())
            .then(function(respuesta) {
              if (respuesta.data.length < 1) {
                anadirErrores("No hay más resultados que mostrar");
              } else {
                TratarPlanes(respuesta.data);
                $scope.pagina++;
              }
            })
        }

        break;
        case 2:
          if (NotNullNotUndefinedNotEmpty($scope.promocionesperiodos[b])) {
            $scope.pagina++;
          } else {
            console.log("Promociones");
            console.log($scope.promocionesperiodos);
            console.log(a);
            var idInicio = $scope.promocionesperiodos[a][$scope.promocionesperiodos[a].length-1].IDUsuarioPromocionPeriodo;
            console.log(idInicio);
            Llamada.http.get("PromocionesPeriodosLeer?idInicio=" + idInicio + "&tamPag=10&IDIdioma=" + getIdioma())
              .then(function(respuesta) {
                if (respuesta.data.length < 1) {
                  anadirErrores("No hay más resultados que mostrar");
                } else {
                  TratarPromociones(respuesta.data);
                  $scope.pagina++;
                }

              })
          }

          break;
      default:

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
  $scope.hacerTopUsuario = function(usuario) {
    var newstate = 0;
    if (usuario.EnTop < 1) {
        newstate = 1;
    }
    Llamada.http.get("UsuariosTop?IDUsuario=" + usuario.IDUsuario + "&Activo=" + newstate)
      .then(function(respuesta) {
        usuario.EnTop = newstate;
      })
  }
  $scope.hacerTopPublicacion = function(publicacion) {
    var newstate = 0;
    if (publicacion.EnTop < 1) {
        newstate = 1;
    }
    Llamada.http.get("PublicacionesTop?IDPublicacion=" + publicacion.IDPublicacion + "&Activo=" + newstate)
      .then(function(respuesta) {
        publicacion.EnTop = newstate;
      })
  }
  $scope.eliminarPublicacion = function(publicacion, index) {
    result = DevExpress.ui.dialog.confirm("¿Seguro que deseas eliminar esta publicación?");
    result.then(function(val) {
      if (val) {
        Llamada.http.get("PublicacionesEliminar?IDPublicacion=" + publicacion.IDPublicacion)
          .then(function(respuesta) {
            $scope.publicaciones[$scope.pagina].splice(index,1);
          })
      }
    });

    }
    $scope.claseFijadaU = function(val) {
      if (val > 0) {
        return "fa fa-lock fa-lg";
      } else {
        return "fa fa-unlock fa-lg";
      }
    }
    $scope.claseFijadaUVip = function(val) {
      if (val > 0) {
        return "fa fa-star fa-lg";
      } else {
        return "fa fa-star-o fa-lg";
      }
    }
    $scope.claseFijadaUTop = function(val) {
      if (val > 0) {
        return "fa fa-arrow-circle-up";
      } else {
        return "fa fa-arrow-circle-o-up";
      }
    }
  $scope.haciaAtras = function() {
    if ($scope.pagina > 0) {
      $scope.pagina--;
    } else {
      anadirErrores("No puedes ir más atras");
    }
  }
  $scope.transformarFecha = function(fechafea) {
    if (NotNullNotUndefinedNotEmpty(fechafea)) {
      return TransformarFecha(fechafea);
    } else {
      return { Fecha: "Activo" }
    }

  }
  $scope.cargarImagen = function(usuario) {
    if (NotNullNotUndefinedNotEmpty(usuario)) {
      usuario.Cargado = true;
      if (usuario.ContenidoMMServidor > 0) {
        Llamada.http.getArrayByte(usuario.ContenidoMM, "I")
          .then(function(respuesta) {
            usuario.DataContenidoMM = respuesta.data;
          })
      } else {
        usuario.DataContenidoMM = usuario.ContenidoMM;
      }
    }
  }
  $scope.cambioPagina = function(num, idInicio) {
    $scope.active = num;
    $scope.pagina = 0;
    console.log("CAMBIO PAGINA A " + $scope.pagina);
    if (!NotNullNotUndefinedNotEmpty(idInicio)) {
      idInicio = "";
      $scope.usuarios = [];
      $scope.publicaciones = [];
    }
    switch (parseInt(num)) {
      case 1:
        Llamada.http.get("UsuariosLeer?idInicio=" + idInicio + "&tamPag=10")
          .then(function(respuesta) {
            TratarUsuarios(respuesta.data);
          })
        break;
        case 2:
        Llamada.http.get("UsuariosLeerNuevos?idInicio=" + idInicio + "&tamPag=10")
          .then(function(respuesta) {
            TratarUsuarios(respuesta.data);
          })
          break;
          case 4:
            console.log("Holi");
            cadena = "AccionesUsuariosLeer";
            $scope.actions = [];
            Llamada.http.get(cadena + "?FechaInicio=&tamPag=10")
              .then(function(respuesta) {
                if (respuesta.data.length < 1) {
                  anadirErrores($scope.lang.no_resultados);
                } else {
                  TratarAcciones(respuesta.data);
                }
              })
            break;
            case 5:
            Llamada.http.get("PublicacionesLeer?IDUsuarioLector=&IDInicio=&tamPag=10&IDIdioma=" + getIdioma())
              .then(function(respuesta) {
                if (respuesta.data.length < 1) {
                  anadirErrores($scope.lang.no_resultados);
                } else {
                  TratarPublicaciones(respuesta.data);
                }
              })
              break;
      default:

    }
  }
  TratarPublicaciones = function(publis) {
    $scope.publicaciones.push(publis);
  }
  TratarPlanes = function(planes) {
    $scope.planesperiodos.push(planes);
  }
  TratarPromociones = function(planes) {
    $scope.promocionesperiodos.push(planes);
  }
  TratarAcciones = function(acts) {
    $scope.actions.push(acts);
  }
  $scope.pn = 1;
  $scope.verPlanesPromos = function(val) {
    $scope.pn = val;
    idInicio = "";
    $scope.pagina = 0;
    switch (val) {
      case 1:
        $scope.planesperiodos = []
        Llamada.http.get("PlanesPeriodosLeer?idInicio=" + idInicio + "&tamPag=10&IDIdioma=" + getIdioma())
          .then(function(respuesta) {
            TratarPlanes(respuesta.data);
          })
        break;
        case 2:
          $scope.promocionesperiodos = []
          Llamada.http.get("PromocionesPeriodosLeer?idInicio=" + idInicio + "&tamPag=10&IDIdioma=" + getIdioma())
            .then(function(respuesta) {
              TratarPromociones(respuesta.data);
            })
          break;
      default:

    }
  }
});
musicien.controller('porcentaje', function ($scope, Llamada) {
  $scope.init = function(cifra1, cifra2) {
    var a = (cifra1*100)/cifra2;
    $scope.porcentaje = -((100-a).toFixed(2));
    if (cifra1 > cifra2) {
      $scope.clasesort = "fa fa-sort-asc";
      $scope.mas = "mas";
      $scope.color = "green";
    } else {
      $scope.clasesort = "fa fa-sort-desc";
      $scope.mas = "menos";
      $scope.color = "red";
    }
  }

});
