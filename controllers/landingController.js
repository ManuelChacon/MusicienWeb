musicien.controller('landing', function ($scope, $location, Llamada, $window) {
  var credenciales = JSON.parse(localStorage.getItem("musicienCreds"));
  if (credenciales !== null) {
    console.log("Hay credenciales");
    console.log(credenciales);
    $scope.oldusuario = credenciales
  }
  $scope.registrarUsuario = function() {
    console.log($scope.newusuario)
    Llamada.http.post("UsuariosCrear", $scope.newusuario)
      .then(function(respuesta) {
        console.log(respuesta);
        if (respuesta.ID > 0) {
          $scope.LoginUsuario($scope.newusuario.Email, $scope.newusuario.Contrasena);
        }
      })
  }
  $scope.LoginUsuario = function(email, contrasena) {
    Llamada.http.getAuthGetToken(email, contrasena)
      .then(function(respuesta) {
        console.log(respuesta);
        if (respuesta.IDUsuario > 0) {
          console.log($location.absUrl().split("/home.html")[0]);
          $window.location.href = $location.absUrl().split("/home.html")[0];
        }
      })
  }
  $scope.iniciarSesUsuario = function() {
    var credenciales = { Email: $scope.oldusuario.Email, Contrasena: $scope.oldusuario.Contrasena }
    localStorage.setItem("musicienCreds", JSON.stringify(credenciales));
    $scope.LoginUsuario($scope.oldusuario.Email, $scope.oldusuario.Contrasena);
  }
  recargarTops();
  
});
