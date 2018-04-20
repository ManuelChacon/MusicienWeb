musicien.factory('Carrito', function($http, $q, configuracionGlobal, Llamada) {
  var articulos = [];

  var precio = 0;
  var compra = {
    insertarArticulo: function(articulo) {
      var res = true;
      var mensaje = "";
      console.log("Checkeando promoción")
      console.log(articulo);
      if (NotNullNotUndefinedNotEmpty(articulo.Planes)) {
        for (r = 0; r < articulo.Planes.length; r++) {
          articulo.Planes[r].Checked = true;
        }
      }
      if (articulos.length > 0) {
        if (articulos[0].TipoArticulo == "PR" || articulos[0].TipoArticulo == "PL") {
          res = false;
          mensaje = "No puedes añadir más artículos al carrito.";
        } else {
          if (articulo.TipoArticulo == "PR" || articulo.TipoArticulo == "PL") {
            res = false;
            mensaje = "No puedes combinar este artículo con los que hay en tu carrito.";
          }
        }
      }
      
      if (NotNullNotUndefinedNotEmpty(articulo)) {
          for (i = 0; i < articulos.length; i++) {
            if (NotNullNotUndefinedNotEmpty(articulos[i])) {
              if (NotNullNotUndefinedNotEmpty(articulos[i].IDPlan) && NotNullNotUndefinedNotEmpty(articulo.IDPlan)) {
                if (articulos[i].IDPlan > 0 && articulo.IDPlan > 0) {
                  if (articulos[i].IDPlan == articulo.IDPlan) {
                    mensaje = "Este articulo ya lo tienes en el carrito";
                    console.log("Estos articulso plan son iguales");
                      console.log(articulos[i]);
                      console.log(articulo)
                    res = false;
                  }
                }
              }
              if (NotNullNotUndefinedNotEmpty(articulos[i].IDPublicacion) && NotNullNotUndefinedNotEmpty(articulo.IDPublicacion)) {
                if (articulos[i].IDPublicacion > 0 && articulo.IDPublicacion > 0) {
                  if (articulos[i].IDPublicacion == articulo.IDPublicacion) {
                    mensaje = "Este articulo ya lo tienes en el carrito";
                    console.log("Estos articulso plan son iguales");
                      console.log(articulos[i]);
                      console.log(articulo)
                    res = false;
                  }
                }
              }
              if (NotNullNotUndefinedNotEmpty(articulos[i].IDPromocion) && NotNullNotUndefinedNotEmpty(articulo.IDPromocion)) {

                if (articulos[i].IDPromocion > 0 && articulo.IDPromocion > 0) {
                  if (articulos[i].IDPromocion == articulo.IDPromocion) {
                    console.log("Estos articulo Promoción son iguales");
                    mensaje = "Este articulo ya lo tienes en el carrito";
                      console.log(articulos[i]);
                      console.log(articulo)
                    res = false;
                  }
                }

              }
            }
          }
      }
      if (res) {
        articulos.push(articulo)
      } else {
        return anadirErrores(mensaje);
      }
      sessionStorage.setItem("carritoMusicien", JSON.stringify(articulos))
    },
    verCarrito: function() {
      return articulos;
    },
    cantidadArticulos:function() {
      return articulos.length;
    },
    eliminarDeCarrito: function(index) {
      articulos[index].Eliminando = true;
      result = DevExpress.ui.dialog.confirm("¿Estás seguro de que deseas eliminar este artículo del carrito?");
      result.then(function(val) {
        if (val) {
          articulos.splice(index,1);
          console.log(articulos);
          sessionStorage.setItem("carritoMusicien", JSON.stringify(articulos))
        }
      });

    },
    obtenerPrecio: function() {
      return precio;
    },
    recalcularPrecio: function() {
      precio = 0;
      for (i = 0; i < articulos.length; i++) {
        if (NotNullNotUndefinedNotEmpty(articulos[i])) {
          if (NotNullNotUndefinedNotEmpty(articulos[i].Tarifas)) {
            for (n = 0; n < articulos[i].Tarifas.length; n++) {
              if (NotNullNotUndefinedNotEmpty(articulos[i].Tarifas[n].IDTarifaPlan)) {
                if (parseInt(articulos[i].Tarifas[n].IDTarifaPlan) == parseInt(articulos[i].TarifaSelected)) {
                  precio = precio+articulos[i].Tarifas[n].Precio;
                }
              }
              if (NotNullNotUndefinedNotEmpty(articulos[i].Tarifas[n].IDTarifaPromocion)) {
                if (parseInt(articulos[i].Tarifas[n].IDTarifaPromocion) == parseInt(articulos[i].TarifaSelected)) {
                  precio = precio+articulos[i].Tarifas[n].Precio;
                }
              }
              if (NotNullNotUndefinedNotEmpty(articulos[i].Tarifas[n].IDTarifaPublicacion)) {
                if (parseInt(articulos[i].Tarifas[n].IDTarifaPublicacion) == parseInt(articulos[i].TarifaSelected)) {
                  precio = precio+articulos[i].Tarifas[n].Precio;
                }
              }
            }
          }
        }
      }
      console.log(precio);
    },
    guardarCompra: function(IDUsuario) {
      var deferred = $q.defer();
      var carrito = { Planes: [], Promociones:[], Publicaciones:[] }
      var guardar = true;
      var errores = [];
      for (n = 0; n < articulos.length; n++) {
        articulos[n].TarifaSelected = parseInt(articulos[n].TarifaSelected);
        switch (articulos[n].TipoArticulo) {
          case "PL":
            carrito.Planes.push(articulos[n]);
            break;
            case "PR":
              carrito.Promociones.push(articulos[n]);
              var selecteds = 0;
              for (i = 0; i < articulos[n].Planes.length; i++) {
                if (articulos[n].Planes[i].Checked === true) {
                  selecteds++;
                }
              }
              console.log(selecteds);
              if (selecteds !== articulos[n].MaxPlanes) {
                errores.push("El número de planes seleccionado (" + selecteds + ") no coincide con el número de planes que debes seleccionar para " + articulos[n].NombrePromocion + "(" + articulos[n].MaxPlanes + ").")
                guardar = false;
              }
              break;
              case "PB":
                carrito.Publicaciones.push(articulos[n]);
                console.log(selecteds);
                if (!NotNullNotUndefinedNotEmpty(articulos[n].TarifaSelected)) {
                  errores.push("Debes seleccionar una tarifa para la publicación " + articulos[n].Titulo + ".");
                  guardar = false;
                }
                break;

          default:
          alert("No encontré donde meterlo")
        }
      }
      console.log(carrito);
      if (guardar) {
        Llamada.http.post("CompraCrear?IDUsuario=" + IDUsuario, carrito)
          .then(function(respuesta) {
            console.log(respuesta);
            deferred.resolve({ok: respuesta});
            //Aqui te tengo que llevar a la pasarela de pago con el parámetro: respuesta.Guid
            //alert("Listo para pgar, con el guid:" + respuesta.Guid)
            articulos = [];
            sessionStorage.setItem("carritoMusicien", "");
          })
      } else {
        deferred.resolve({error: errores});
      }
      return deferred.promise;
    },
    inicializarCarrito: function() {
      console.log("Inicializando carrito")
      if (NotNullNotUndefinedNotEmpty(sessionStorage.getItem("carritoMusicien"))) {
        try {
          console.log("Hay carrito")
          articulos = JSON.parse(sessionStorage.getItem("carritoMusicien"));
        } catch (Ex) {
          articulos = [];
        }
      } else {
        console.log("No lo hay")
        articulos = [];
      }
    }

  }
  return {
    compra
  }
});
musicien.controller('verCarrito', function ($scope, $location, Llamada, $window, $sce, $timeout, configuracionGlobal, Carrito) {
  console.log("Holi")
  if ($scope.TarifasPublicacion.length < 1) {
    Llamada.http.get("TarifasPublicacionLeer")
      .then(function(respuesta) {
        console.log(respuesta);
        $scope.TarifasPublicacion = respuesta.data;
      })
  }
  $scope.contentCarrito = function() {
    return Carrito.compra.verCarrito();
  }
  $scope.noesTipo = function(string, articulo) {
    return articulo.TipoArticulo !== string;
  }
  $scope.consoleCarrito = function() {
    console.log(Carrito.compra.verCarrito())
  }
  $scope.cambioTarifa = function() {
    Carrito.compra.recalcularPrecio()
  }
  $scope.eliminarDelCarrito = function(index) {
    return Carrito.compra.eliminarDeCarrito(index)
  }
  $scope.clasebotontrash = function(articulo) {
        if (NotNullNotUndefinedNotEmpty(articulo)) {
          if (articulo.Eliminando === true) {
            return "otroicono";
          } else {
            return "fa fa-trash";
          }
        } else { 
          return "fa fa-trash";
        }
      }
  $scope.cambioSelectedPlan = function(articulo, plan) {
    console.log(articulo, plan);
    if (plan.Checked === true) {
      plan.Checked = false;
    } else {
      plan.Checked = true;
    }
    var selecteds = 0;
    if (plan.Checked === true) {
      for (i = 0; i < articulo.Planes.length; i++) {
        if (articulo.Planes[i].Checked === true) {
          selecteds++;
        }
      }
      console.log(selecteds);
      if (selecteds > articulo.MaxPlanes) {
        anadirErrores($scope.lang.debes_marcar + articulo.MaxPlanes + $scope.lang.planes);
        plan.Checked = false;
      }
    } else {
      console.log("Has descheckeado, ok");
    }
  }
  $scope.guardarCompra = function() {
    Carrito.compra.guardarCompra(getIDUsuario())
      .then(function(respuesta) {
        console.log(respuesta);

        if (NotNullNotUndefinedNotEmpty(respuesta)) {
          console.log("Hay respuesta");
          if (NotNullNotUndefinedNotEmpty(respuesta.error)) {
            console.log("Hay error")
            for (i = 0; i < respuesta.error.length; i++) {
              anadirErrores(respuesta.error[i]);
            }

          } else {
            console.log("No hay error");
             $window.location.href = "http://musicien.es/pago.php?Id=" + respuesta.ok.Guid;
           }
         }
      })
  }
  $scope.cargarArticulo = function(articulo) {
    articulo.artCargado = true;
    Llamada.http.getArrayByte(articulo.ContenidoMM, "I")
      .then(function(respuesta) {
        articulo.DataContenidoMM = respuesta.data;
      })
  }
  comprobarPermisos();
});

musicien.controller('promocionarPublicacion', function ($scope, $location, Llamada, $window, $sce, $timeout, configuracionGlobal, Carrito) {
  $scope.promocionarPublicacion = function(publi) {
    mipubli = JSON.parse("" + JSON.stringify(publi));
    mipubli.TarifaSelected = null;
    mipubli.TipoArticulo = "PB";
    mipubli.Precio = 0;
    mipubli.ID = mipubli.IDPublicacion;
    if ($scope.TarifasPublicacion.length < 1) {
      Llamada.http.get("TarifasPublicacionLeer")
        .then(function(respuesta) {
          console.log(respuesta);
          $scope.TarifasPublicacion = respuesta.data;
          mipubli.Tarifas = JSON.parse("" + JSON.stringify($scope.TarifasPublicacion));
          mipubli.TarifaSelected = JSON.parse("" + JSON.stringify($scope.TarifasPublicacion[0].IDTarifaPublicacion))
          Carrito.compra.insertarArticulo(mipubli);
          Carrito.compra.recalcularPrecio();
          console.log("En el carrito hay:");
          console.log(Carrito.compra.verCarrito())
        })
      } else {
        mipubli.Tarifas = JSON.parse("" + JSON.stringify($scope.TarifasPublicacion));
        mipubli.TarifaSelected = JSON.parse("" + JSON.stringify($scope.TarifasPublicacion[0].IDTarifaPublicacion))
        Carrito.compra.insertarArticulo(mipubli);
        Carrito.compra.recalcularPrecio();
        console.log("En el carrito hay:");
        console.log(Carrito.compra.verCarrito())
      }

  }
});
