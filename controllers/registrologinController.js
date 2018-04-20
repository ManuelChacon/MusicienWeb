musicien.controller('modalesRegistroLogin', function ($scope, $uibModal, $log, $document, parametrosModal) {

  $scope.animationsEnabled = false;

  $scope.openModalRegistro = function (size, parentSelector) {
    parametrosModal({ Idioma: $scope.lang });
    $scope.tareasAdicionalesCambioPag()
    var parentElem = parentSelector ?
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modales/modal-registro.html',
      controller: 'RegistroLogin',
      size: size,
      appendTo: parentElem,
    });
    modalInstance.result.then(function (objdevuelto) {
        if (NotNullNotUndefinedNotEmpty(objdevuelto)) {
          if (NotNullNotUndefinedNotEmpty(objdevuelto.LoginSocial)) {
            $scope.LoginSocial(objdevuelto.LoginSocial);
          } else {
            $scope.cargaInicial();
          }
        } else {
          $scope.cargaInicial();
        }
      }, function () {
      });
  };
  $scope.openModalInicioSesion = function (size, parentSelector) {
    parametrosModal({ Idioma: $scope.lang });
          $scope.tareasAdicionalesCambioPag()
    var parentElem = parentSelector ?
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modales/modal-login.html',
      controller: 'RegistroLogin',
      size: size,
      appendTo: parentElem,

    });
    modalInstance.result.then(function (objdevuelto) {
        if (NotNullNotUndefinedNotEmpty(objdevuelto)) {
          if (NotNullNotUndefinedNotEmpty(objdevuelto.LoginSocial)) {
            $scope.LoginSocial(objdevuelto.LoginSocial);
          } else {
            $scope.cargaInicial();
          }
        } else {
          alert("He salido")

        }
      });
  };

  $scope.openModalAviso = function (size, parentSelector) {

          $scope.tareasAdicionalesCambioPag()
    var parentElem = parentSelector ?
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modales/aviso.html',
      controller: 'RegistroLogin',
      size: size,
      appendTo: parentElem,

    });
    modalInstance.result.then(function (objdevuelto) {
        if (NotNullNotUndefinedNotEmpty(objdevuelto)) {
          if (NotNullNotUndefinedNotEmpty(objdevuelto.LoginSocial)) {
            $scope.LoginSocial(objdevuelto.LoginSocial);
          } else {
            $scope.cargaInicial();
          }
        } else {
          alert("He salido")

        }
      });
  };

$scope.openModalPago = function (size, parentSelector) {

          $scope.tareasAdicionalesCambioPag()
    var parentElem = parentSelector ?
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modales/pagos.html',
      controller: 'RegistroLogin',
      size: size,
      appendTo: parentElem,

    });
    modalInstance.result.then(function (objdevuelto) {
        if (NotNullNotUndefinedNotEmpty(objdevuelto)) {
          if (NotNullNotUndefinedNotEmpty(objdevuelto.LoginSocial)) {
            $scope.LoginSocial(objdevuelto.LoginSocial);
          } else {
            $scope.cargaInicial();
          }
        } else {
          alert("He salido")

        }
      });
  };

});
musicien.controller('RegistroLogin', function ($scope, $location, Llamada, $window, $uibModalInstance, parametrosModal) {
  var credenciales = JSON.parse(localStorage.getItem("musicienCreds"));
  if (NotNullNotUndefinedNotEmpty(parametrosModal(null))) {
    $scope.lang = parametrosModal(null).Idioma;
  }
  if (credenciales !== null) {
    $scope.oldusuario = credenciales
  }
  $scope.registrarUsuario = function() {
    if (NotNullNotUndefinedNotEmpty($scope.newusuario.Email) && NotNullNotUndefinedNotEmpty($scope.newusuario.Contrasena) && NotNullNotUndefinedNotEmpty($scope.newusuario.Nombre)) {
      Llamada.http.post("UsuariosCrear", $scope.newusuario)
        .then(function(respuesta) {
          if (respuesta.ID > 0) {
            mensajeExito("El registro se ha completado con éxito, verifica tu correo para validar tu cuenta y empezar a utilizar Musicien.")
            //$scope.LoginUsuario($scope.newusuario.Email, $scope.newusuario.Contrasena);
          } else {
            anadirErrores(respuesta.Resultado);
          }
        })
    } else {
      anadirErrores($scope.lang.rellenar_todo_error);
    }
  }
  $scope.LoginUsuario = function(email, contrasena) {
    if (NotNullNotUndefinedNotEmpty(email) && NotNullNotUndefinedNotEmpty(contrasena)) {
      Llamada.http.getAuthGetToken(email, contrasena)
          .then(function (respuesta) {
              
            if (respuesta.IDUsuario > 0) {
                ColocarSitio(respuesta.Sitio);
              
            $uibModalInstance.close('ok');
          } else {
            anadirErrores(respuesta.Nombre);
          }
        })
    } else {
      anadirErrores($scope.lang.rellenar_ambos_error);
    }

  }
  $scope.iniciarSesUsuario = function() {
    var credenciales = { Email: $scope.oldusuario.Email, Contrasena: $scope.oldusuario.Contrasena }
    localStorage.setItem("musicienCreds", JSON.stringify(credenciales));
    $scope.LoginUsuario($scope.oldusuario.Email, $scope.oldusuario.Contrasena);
  }
  $scope.CerrarParaSocial = function(red) {

    $uibModalInstance.close({ LoginSocial: red });
  }
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
    };
    anadirErrores = function(error) {
      DevExpress.ui.notify(error, "error", 2000);
    }
    mensajeExito = function(mensaje) {
      DevExpress.ui.notify(mensaje, "success", 2000);
    }
});

musicien.controller('previsualizar', function($scope, $http, $location, $q, $uibModalInstance,Publicacion, Llamada) {
  $scope.publicacion = Publicacion.Modal.get()
  $scope.publicacion.DataContenidoMM = $scope.publicacion.ContenidoMM;
  $scope.publicacion.DataContenidoMMAlt = $scope.publicacion.ContenidoMMAlt;

  $scope.ok = function() {
    $uibModalInstance.close("hola");
  }
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
  $scope.tipoPublicacion = function(tipo,publicacion) {
      return publicacion.Tipo==tipo;
  }
  $scope.condicionesSeguir = function(usuario) {
    return true;
  }
  $scope.esTipoPropiedad = function(tipo1, tipo2) {
    return tipo1==tipo2;
  }
  $scope.asdf = function() {
    return "holi";
  }
  $scope.NotNull = function() {
    return true;
  }
});

musicien.factory('parametrosModal', ['$window', function(win) {
   var msgs;
   return function(msg) {
     if (msg !== null && msg !== undefined) {
       msgs = msg;
     }
     return msgs;
   };
 }]);
