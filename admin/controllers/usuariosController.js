musicien.controller('usuarios', function ($scope, Llamada, $location) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("UsuariosLeerFakes")
      .then(function(respuesta) {
        $scope.usuarios = respuesta.data;
      })
  }
  $scope.modificarUsuario = function(user) {
    $scope.tareasAdicionalesCambioPag();
    $location.path("/modificarUsuario/" + user.IDUsuario);
  }
  $scope.crearUsuario = function() {
    $location.path("/crearUsuario")
  }
  $scope.eliminarUsuario = function(usuario, index) {
    Llamada.http.get("UsuariosEliminar?IDUsuario=" + usuario.IDUsuario)
      .then(function(respuesta) {
        $scope.usuarios.splice(index,1)
      })
  }
});

musicien.controller('modificarusuarios', function ($scope, Llamada, $routeParams) {
  var newuser = false;
  if ($scope.protectedRoute()) {
    if (NotNullNotUndefinedNotEmpty($routeParams.IDUsuario)) {
      Llamada.http.get("UsuariosLeerPorID?IDUsuario=" + $routeParams.IDUsuario + "&IDUsuarioLector=")
        .then(function(respuesta) {
          $scope.user = respuesta.data;
          Llamada.http.getArrayByte($scope.user.ContenidoMM, "I")
            .then(function(respuesta) {
              $scope.user.DataContenidoMM = respuesta.data;
            })
          Llamada.http.getArrayByte($scope.user.ContenidoMMBanner, "I")
            .then(function(respuesta) {
              $scope.user.DataContenidoMMBanner = respuesta.data;
            })
        })
    } else {
      $scope.user = {}
      newuser = true;
    }
  }
  window.cambioInput = function(esto) {
    $scope.$apply(function () {
      $scope.user.DataContenidoMM = $scope.obtenerImagenInput(esto.files[0]);
      $scope.user.newFile = esto.files;
    });
  }
  window.cambioInputFondo = function(esto) {
    $scope.$apply(function () {
      $scope.user.DataContenidoMMBanner = $scope.obtenerImagenInput(esto.files[0]);
      $scope.user.newFileBanner = esto.files;
    });
  }
  $scope.GuardarCambios = function() {
    if (NotNullNotUndefinedNotEmpty($scope.user.newFile)) {
      var arr = []
      var y = 0;
      while (y < $scope.user.newFile.length) {
        var fd = new FormData();
        angular.forEach($scope.user.newFile, function (v, k) {
          if (k == y) {
            fd.append('file.jpg', $scope.user.newFile[k]);
          }
        });
        arr.push({formdata: fd});
        y++
      }
      Llamada.http.postFile(arr[0].formdata, "I")
        .then(function(respuesta) {
          $scope.user.ContenidoMM = respuesta.Archivo;
          $scope.user.newFile = null;
          GuardarBanner();
        });
    } else {
      GuardarBanner();
    }
  }
  GuardarBanner = function() {
    if (NotNullNotUndefinedNotEmpty($scope.user.newFileBanner)) {
      var arr = []
      var y = 0;
      while (y < $scope.user.newFileBanner.length) {
        var fd = new FormData();
        angular.forEach($scope.user.newFileBanner, function (v, k) {
          if (k == y) {
            fd.append('file.jpg', $scope.user.newFileBanner[k]);
          }
        });
        arr.push({formdata: fd});
        y++
      }
      Llamada.http.postFile(arr[0].formdata, "I")
        .then(function(respuesta) {
          $scope.user.ContenidoMMBanner = respuesta.Archivo;
          $scope.user.newFileBanner = null;
          GuardarUsuario();
        });
    } else {
      GuardarUsuario();
    }
  }
  GuardarUsuario = function() {
    $scope.user.Fake = 1;
    if (newuser) {
      Llamada.http.post("UsuariosCrear", { Nombre: $scope.user.Nombre, Email: "musicien" + Aleatorio(1111,9999) + "@musicien.es", Contrasena: Aleatorio(1111,9999) })
        .then(function(respuesta) {
          $scope.user.IDUsuario = respuesta.ID;
          Llamada.http.post("UsuariosModificar", $scope.user)
            .then(function(respuesta) {
              $scope.verUsuarios();
              mensajeExito("Datos guardados con éxito");
            })
        })
    } else {
      Llamada.http.post("UsuariosModificar", $scope.user)
        .then(function(respuesta) {
          $scope.verUsuarios();
          mensajeExito("Datos guardados con éxito");
        })
    }

  }
});
