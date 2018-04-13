musicien.controller('publicidad', function ($scope, $location, Llamada, $window, $sce, $timeout, configuracionGlobal) {
  console.log("Holiii")
  $scope.init = function(val) {
    console.log("En la publiciadd con " + val);
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
