musicien.config(['$routeProvider', function ($routeProvider) {
  //$locationProvider
  $routeProvider.when('/', {
    templateUrl: 'templates/inicio.html',
    controller: 'inicio'
  })
  .when('/datosregistro', {
    templateUrl:'templates/datosregistro.html',
    controller:'inicio'
  })
  .when('/perfil/:IDUsuario/:Nombre', {
    templateUrl:'templates/perfil.html',
    controller:'perfilusuario'
  })
  .when('/perfil/:IDUsuario/:Nombre/:tabnum', {
    templateUrl:'templates/perfil.html',
    controller:'perfilusuario'
  })
  .when('/perfil/:IDUsuario', {
    templateUrl:'templates/perfil.html',
    controller:'perfilusuario'
  })
  .when('/404', {
    templateUrl: 'templates/404.html',
  })
  .when('/preferencias', {
    templateUrl: 'templates/preferencias.html',
    controller: 'preferencias'
  })
   .when('/contratar', {
    templateUrl: 'templates/contratar.html',
    controller: 'verplanes'
  })
  .when('/preferencias/:Perfiles', {
    templateUrl: 'templates/preferencias.html',
    controller: 'preferencias'
  })
  .when('/landing', {
    templateUrl: 'templates/landing.html',
  })
  .when('/publicacion/:IDPublicacion/:texto', {
    templateUrl: 'templates/post.html',
    controller:'publicacion'
  })
  .when('/new', {
    templateUrl: 'templates/inicio.html',
    controller: 'inicio'
  })
  .when('/authInstagram/:access_token', {
    templateUrl: 'templates/inicio.html',
    controller: 'inicio'
  })
  .when('/notificaciones', {
    templateUrl: 'templates/notificaciones.html',
    controller: 'notificaciones'
  })
  .when('/planes', {
    templateUrl: 'templates/planes.html',
    controller: 'verplanes'
  })
  .when('/planes/plan/:IDPlan', {
    templateUrl: 'templates/planes.html',
    controller: 'verplanes'
  })
  .when('/planes/promo/:IDPromo', {
    templateUrl: 'templates/planes.html',
    controller: 'verplanes'
  })
  .when('/perfiles', {
    templateUrl: 'templates/perfiles.html',
    controller: 'verperfiles'
  })
  .when('/perfiles/:IDCategoria', {
    templateUrl: 'templates/perfilesusuarios.html',
    controller: 'verusuariosperfil'
  })
  .when('/carrito', {
    templateUrl: 'templates/carrito.html',
    controller: 'verCarrito'
  })
  .otherwise({
    redirectTo: '/404'
  });
  //$locationProvider.html5Mode(true);
}]);
