var musicien = angular.module('musicien', ['ngAnimate', 'ngSanitize', 'ui.bootstrap','ngRoute', 'infinite-scroll','dx']);
musicien.directive('miniPerfil', function() {
  return {
      templateUrl: 'templates/elementos/mini-perfil.html',
      }
});
/*musicien.directive('crearPost', function() {
  return {
      templateUrl: '../templates/elementos/crear-post.html',
      controller: 'crearpost'
      }
});*/
// musicien.directive('campoPropiedad', function() {
//   return {
//       templateUrl: '../templates/elementos/campo-propiedad.html',
//       }
// });
// musicien.directive('publicacion', function() {
//   return {
//       templateUrl: '../templates/elementos/publicacion.html',
//       }
// });
musicien.directive('contenedorPropiedades', function() {
  return {
      templateUrl: '../templates/elementos/contenedor-propiedades.html',
      }
});
musicien.directive('tablaUsuarios', function() {
  return {
      templateUrl: 'templates/elementos/tabla-usuarios.html',
      }
});

musicien.directive('crearPost', function() {
  return {
      templateUrl: 'templates/elementos/crear-post.html',
      controller: 'crearpost'
      }
});
musicien.directive('campoPropiedad', function() {
  return {
      templateUrl: 'templates/elementos/campo-propiedad.html',
      }
});

musicien.directive('publicacion', function() {
  return {
      templateUrl: 'templates/elementos/publicacion.html',
      }
});
musicien.directive("filtrosBusqueda", function() {
  return {
    templateUrl:'templates/elementos/filtros-busqueda.html',
  }
})

