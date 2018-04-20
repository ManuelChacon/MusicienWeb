musicien.controller('publicidad', function ($scope, $location, Llamada, $window, $sce, $timeout, configuracionGlobal) {
  $scope.init = function(val) {
    Llamada.http.get("PublicacionesLeerPorIDPosicionPublicidad?IDPosicionPublicidad=" + val + "&IDUsuarioLector=" + getIDUsuario())
      .then(function(respuesta) {
        console.log(respuesta.data);
        $scope.publipubli = respuesta.data;
        $scope.galeria = {
						        dataSource: $scope.publipubli,
						        height: 300,
						        itemTemplate: 'item',
						        bindingOptions: {
						            slideshowDelay: "slideshowDelay",
						            loop: "loop",
						            showNavButtons: "showNavButtons",
						            showIndicator: "showIndicator"
						        }   

						    }
      })
  }
  	$scope.loop = true;
    $scope.slideShow = true;    
    $scope.showNavButtons = false;
    $scope.showIndicator = true;
    $scope.slideshowDelay = 5000;
});
