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
  $scope.newusuario = {}
  $scope.registrarUsuario2 = function() {
    if (NotNullNotUndefinedNotEmpty($scope.newusuario.Email) && NotNullNotUndefinedNotEmpty($scope.newusuario.Contrasena) && NotNullNotUndefinedNotEmpty($scope.newusuario.Nombre)) {
      Llamada.http.post("UsuariosCrear", $scope.newusuario)
        .then(function(respuesta) {
          if (respuesta.ID > 0) {
            mensajeExito("El registro se ha completado con éxito, verifica tu correo para validar tu cuenta y empezar a utilizar Musicien.")
            $scope.newusuario = {}
            //$scope.LoginUsuario($scope.newusuario.Email, $scope.newusuario.Contrasena);
          } else {
            anadirErrores(respuesta.Resultado);
          }
          $scope.newusuario = {}
        })
    } else {
      anadirErrores($scope.lang.rellenar_todo_error);
    }
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

  $scope.CerrarParaSocial = function (red) {

      $scope.LoginSocial(red);
  }


  $scope.iniciarSesUsuario = function() {
    var credenciales = { Email: $scope.oldusuario.Email, Contrasena: $scope.oldusuario.Contrasena }
    localStorage.setItem("musicienCreds", JSON.stringify(credenciales));
    $scope.LoginUsuario($scope.oldusuario.Email, $scope.oldusuario.Contrasena);
  }
  recargarTops();
  
});
