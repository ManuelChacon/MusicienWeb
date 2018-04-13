musicien.controller('inicio', function ($scope) {
  $scope.login = function() {
    $scope.LoginUsuario($scope.user, $scope.password)
  }
});
