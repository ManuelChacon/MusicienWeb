musicien.controller('cupones', function ($scope, Llamada, $location) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("CuponesLeer")
      .then(function(respuesta) {
        $scope.cupones = respuesta.data;
        console.log($scope.cupones);
      })
  }
  $scope.transformarFecha = function(fecha) {
    return TransformarFecha(fecha);
  }
  $scope.modificarCupon = function(cupon, index) {
    $location.path("/modificarCupon/" + cupon.IDCupon)
  }
  $scope.crearCupon = function() {
    $location.path("/crearCupon");
  }
  $scope.eliminarCupon = function(cupon, index) {
    result = DevExpress.ui.dialog.confirm("¿Seguro que deseas eliminar este cupón?");
    result.then(function(val) {
      if (val) {
        Llamada.http.get("CuponesEliminar?IDCupon=" + cupon.IDCupon)
          .then(function(respuesta) {
            $scope.cupones.splice(index,1);
          })
      }

    })
  }

});

musicien.controller('modificarcupon', function ($scope, $routeParams, Llamada, $location) {
  if ($scope.protectedRoute()) {
    if (NotNullNotUndefinedNotEmpty($routeParams.IDCupon)) {
      Llamada.http.get("CuponesLeerPorIDCupon?IDCupon=" + $routeParams.IDCupon)
        .then(function(respuesta) {
          console.log(respuesta.data);
          $scope.cupon = respuesta.data;
          if (NotNullNotUndefinedNotEmpty($scope.cupon.FechaDesde)) {
            $scope.cupon.FechaDesde = new Date(TransformarFecha($scope.cupon.FechaDesde).Fecha);
          }
          if (NotNullNotUndefinedNotEmpty($scope.cupon.FechaHasta)) {
            $scope.cupon.FechaHasta = new Date(TransformarFecha($scope.cupon.FechaHasta).Fecha);
          }
        })
    } else {
      $scope.cupon = {
        IDCupon: 0,
        Texto: "",
        Clave: "",
        IDPeriodicidad: 0,
      }
    }
    Llamada.http.get("PeriodicidadesLeer")
      .then(function(respuesta) {
        $scope.periodicidades = respuesta.data;
        console.log(respuesta);
      })
      Llamada.http.get("PlanesYPromocionesLeer?IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.planes = respuesta.data.Planes;
          $scope.promociones = respuesta.data.Promociones;
        })
  }
  $scope.esPeriodicidadSeleccionada = function(periodicidad) {
    if (NotNullNotUndefinedNotEmpty(periodicidad) && NotNullNotUndefinedNotEmpty($scope.cupon)) {
      return periodicidad.IDPeriodicidad == $scope.cupon.IDPeriodicidad;
    } else {
      return false;
    }
  }
  $scope.cambioPeriodicidad = function(esto) {
    console.log(esto);
    console.log($scope.idperiodicidad)
    $scope.cupon.IDPeriodicidad = $scope.idperiodicidad;
  }

  $scope.noEnPlanes = function(plan) {
    var res = true;
    if (NotNullNotUndefinedNotEmpty($scope.cupon)) {
      if (NotNullNotUndefinedNotEmpty($scope.cupon.Planes)) {
        for (n = 0; n < $scope.cupon.Planes.length; n++) {
          if ($scope.cupon.Planes[n].IDPlan == plan.IDPlan) {
            res = false;
          }
        }
      }
    }
    return res;
  }
  $scope.noEnPromos = function(plan) {
    var res = true;
    if (NotNullNotUndefinedNotEmpty($scope.cupon)) {
      if (NotNullNotUndefinedNotEmpty($scope.cupon.Promociones)) {
        for (n = 0; n < $scope.cupon.Promociones.length; n++) {
          if ($scope.cupon.Promociones[n].IDPromocion == plan.IDPromocion) {
            res = false;
          }
        }
      }
    }
    return res;
  }
  $scope.cambioplanpromo = function(esto) {
    console.log(esto);
    console.log($scope.newplanopromo);
    if (NotNullNotUndefinedNotEmpty($scope.newplanopromo)) {
      var c = JSON.parse($scope.newplanopromo)
      console.log("ok entro");
      if (NotNullNotUndefinedNotEmpty(c.IDPlan)) {
        console.log("Es un plan");
        if (!NotNullNotUndefinedNotEmpty($scope.cupon.Planes)) {
          $scope.cupon.Planes = [];
        }
        $scope.cupon.Planes.push(c);
      } else if (NotNullNotUndefinedNotEmpty(c.IDPromocion)) {
        console.log("Es una promoción");
        if (!NotNullNotUndefinedNotEmpty($scope.cupon.Promociones)) {
          $scope.cupon.Promociones = [];
        }
        $scope.cupon.Promociones.push(c);
      } else {
        console.log("No veo na");
      }
    }
  }
  $scope.eliminarCuponPlan = function(index) {
    if (!NotNullNotUndefinedNotEmpty($scope.cupon.PlanesElim)) {
      $scope.cupon.PlanesElim = [];
    }
    $scope.cupon.PlanesElim.push($scope.cupon.Planes.splice(index,1)[0]);
    console.log($scope.cupon);
  }
  $scope.eliminarCuponPromocion = function(index) {
    if (!NotNullNotUndefinedNotEmpty($scope.cupon.PromocionesElim)) {
      $scope.cupon.PromocionesElim = [];
    }
    $scope.cupon.PromocionesElim.push($scope.cupon.Promociones.splice(index,1)[0]);
    console.log($scope.cupon);
  }
  $scope.guardarCambios = function() {
    $scope.cupon.FechaDesde = TransformarFechaParaServicio($scope.cupon.FechaDesde, "00:00:00");
    $scope.cupon.FechaHasta = TransformarFechaParaServicio($scope.cupon.FechaHasta, "23:59:00");
    Llamada.http.post("CuponesCrearModificar", $scope.cupon)
      .then(function(respuesta) {
        console.log(respuesta);
        mensajeExito(respuesta.Resultado);
        $location.path("/cupones");
      })
  }
});
