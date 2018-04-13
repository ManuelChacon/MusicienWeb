musicien.factory('Publicacion', function($http, $q) {
  var publi;
  var Modal = {
    get: function() {
      return publi
    },
    set: function(valores) {
      publi = valores
    }
  }
  return {
    Modal
  }
});
musicien.controller('ModalPrevisualiza', function ($scope, $uibModal, $log, $document,Publicacion) {

  $scope.animationsEnabled = false;

  $scope.open = function (size, parentSelector) {
    console.log("Estoy pasando por este;")
    console.log(Publicacion)
    var publicacion = JSON.parse("" + JSON.stringify($scope.publicacion));
    publicacion.Cargada = true;
    publicacion.AltCargado = true;
    publicacion.Usuario = { DataContenidoMM: 'img/defaultprofile.png' }
    for (i = 0; i < publicacion.TipoPubli.Propiedades.length; i++) {
      publicacion.TipoPubli.Propiedades[i].Cargada = true;
      publicacion.TipoPubli.Propiedades[i].AltCargado = true;
      publicacion.TipoPubli.Propiedades[i].DataValor = publicacion.TipoPubli.Propiedades[i].newContenidoMM;
    }
    Publicacion.Modal.set(publicacion)
    var parentElem = parentSelector ?
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'templates/modales/previsualizar.html',
      controller: 'previsualizar',
      size: size,
      appendTo: parentElem,

    });
  };

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
