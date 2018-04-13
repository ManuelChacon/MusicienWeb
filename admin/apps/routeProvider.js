musicien.config(['$routeProvider', function ($routeProvider) {
  //$locationProvider
  $routeProvider.when('/', {
    templateUrl: 'templates/inicio.html',
    controller: 'inicio'
  })
  .when('/home', {
    templateUrl: 'templates/home.html',
    controller: 'home'
  })
  .when('/perfiles', {
    templateUrl: 'templates/perfiles.html',
    controller: 'perfiles'
  })
  .when('/modificarPerfil/:IDCategoria', {
    templateUrl: 'templates/modificarPerfil.html',
    controller: 'modificarPerfil'
  })
  .when('/crearPerfil', {
    templateUrl: 'templates/modificarPerfil.html',
    controller: 'modificarPerfil'
  })
  .when('/usuario', {
    templateUrl: 'templates/usuario.html',
    controller: 'modificarUsuario'
  })
  .when('/modificarCaracteristica/:IDTipoObjeto', {
    templateUrl: 'templates/modificarTipoObjeto.html',
    controller: 'modificarTipoObjeto'
  })
  .when('/crearCaracteristica', {
    templateUrl: 'templates/modificarTipoObjeto.html',
    controller: 'modificarTipoObjeto'
  })
  .when('/caracteristicas', {
    templateUrl: 'templates/tiposObjeto.html',
    controller: 'tiposObjeto'
  })
  .when('/modificarPlan/:IDPlan', {
    templateUrl: 'templates/modificarPlan.html',
    controller: 'modificarPlan'
  })
  .when('/crearPromocion', {
    templateUrl: 'templates/modificarPromocion.html',
    controller: 'modificarPromocion'
  })
  .when('/planes', {
    templateUrl: 'templates/planes.html',
    controller: 'planes'
  })
  .when('/modificarPromocion/:IDPromocion', {
    templateUrl: 'templates/modificarPromocion.html',
    controller: 'modificarPromocion'
  })
  .when('/crearPlan', {
    templateUrl: 'templates/modificarPlan.html',
    controller: 'modificarPlan'
  })
  .when('/promociones', {
    templateUrl: 'templates/promociones.html',
    controller: 'promociones'
  })
  .when('/404', {
    templateUrl: 'templates/404.html',
  })
  .when('/modificarPublicacion/:IDTipoPublicacion', {
    templateUrl: 'templates/modificarPublicacion.html',
    controller: 'modificarPublicaciones'
  })
  .when('/crearPublicacion', {
    templateUrl: 'templates/modificarPublicacion.html',
    controller: 'modificarPublicaciones'
  })
  .when('/publicaciones', {
    templateUrl: 'templates/publicaciones.html',
    controller: 'publicaciones'
  })
  .when('/cupones', {
    templateUrl: 'templates/cupones.html',
    controller: 'cupones'
  })
  .when('/modificarCupon/:IDCupon', {
    templateUrl: 'templates/modificarCupon.html',
    controller: 'modificarcupon'
  })
  .when('/crearCupon', {
    templateUrl: 'templates/modificarCupon.html',
    controller: 'modificarcupon'
  })
  .when('/playlists', {
    templateUrl: 'templates/playlists.html',
    controller: 'playlists'
  })
  .when('/filtros', {
    templateUrl: 'templates/filtros.html',
    controller: 'filtros'
  })
  .when('/crearFiltro', {
    templateUrl: 'templates/modificarFiltro.html',
    controller: 'modificarFiltro'
  })
  .when('/modificarFiltro/:IDFiltroPrehecho', {
    templateUrl: 'templates/modificarFiltro.html',
    controller: 'modificarFiltro'
  })
  .when('/publicar', {
    templateUrl: 'templates/crear-post.html',
    controller: 'crearpostadmin'
  })
  .when('/publicar/:IDPublicacion', {
    templateUrl: 'templates/crear-post.html',
    controller: 'crearpostadmin'
  })
  .when('/verUsuariosAdmin', {
    templateUrl: 'templates/usuarios.html',
    controller: 'usuarios'
  })
  .when('/modificarUsuario/:IDUsuario', {
    templateUrl: 'templates/modificarUsuario.html',
    controller: 'modificarusuarios'
  })
  .when('/crearUsuario', {
    templateUrl: 'templates/modificarUsuario.html',
    controller: 'modificarusuarios'
  })
  .when('/listapublicaciones', {
    templateUrl: 'templates/listadoPublicaciones.html',
    controller: 'listadopublicaciones'
  })
  .when('/listapublicaciones/usuarios', {
    templateUrl: 'templates/listadoPublicacionesusuarios.html',
    controller: 'listadopublicacionesusuarios'
  })
  .when('/usuario/:IDUsuario', {
    templateUrl: 'templates/perfilUsuario.html',
    controller: 'perfilUsuario'
  })
  .otherwise({
    redirectTo: '/404'
  });
}]);

