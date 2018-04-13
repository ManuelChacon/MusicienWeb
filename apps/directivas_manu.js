musicien.directive('cabeceraPerfilUsuario', function(){
    return {
        templateUrl: 'templates/elementos/cabecera-perfil.html',
        }
});
musicien.directive('miniPerfil', function() {
  return {
      templateUrl: 'templates/elementos/mini-perfil.html',
      }
});
musicien.directive('topMusicos', function() {
  return {
      templateUrl: 'templates/elementos/top-musicos.html',
      }
});
musicien.directive('formularioObjeto', function() {
  return {
      templateUrl: 'templates/elementos/formularios-objetos.html',
      }
});
musicien.directive('contenedorPropiedades', function() {
  return {
      templateUrl: 'templates/elementos/contenedor-propiedades.html',
      }
});
musicien.directive('spotifyPlaylist', function() {
  return {
      templateUrl: 'templates/elementos/spotify-playlist.html',
      controller: 'spotifyController'
      }
});

musicien.directive('chat', function() {
  return {
      templateUrl: 'templates/elementos/chat.html',
      }
});
musicien.directive('chatsalas', function() {
  return {
      templateUrl: 'templates/elementos/chat-salas.html',
      }
});

musicien.directive('chatsearch', function() {
  return {
      templateUrl: 'templates/elementos/chatsearch.html',
      }
});
musicien.directive('topSemanal', function() {
  return {
      templateUrl: 'templates/elementos/top-semanal.html',
      }
});

musicien.directive('publicacion', function() {
  return {
      templateUrl: 'templates/elementos/publicacion.html',
      }
});

musicien.directive('campoPropiedad', function() {
  return {
      templateUrl: 'templates/elementos/campo-propiedad.html',
      }
});
musicien.directive('encuentra', function() {
  return {
      templateUrl: 'templates/elementos/encuentra.html',
      }
});
musicien.directive('actividad', function() {
  return {
      templateUrl: 'templates/elementos/actividad.html',
      }
});
musicien.directive('publicacionVideo', function() {
  return {
      templateUrl: 'templates/publicaciones/video.html',
      }
});
musicien.directive('publicacionImagen', function() {
  return {
      templateUrl: 'templates/publicaciones/imagen.html',
      }
});
musicien.directive('publicacionTexto', function() {
  return {
      templateUrl: 'templates/publicaciones/texto.html',
      }
});
musicien.directive('publicacionSonido', function() {
  return {
      templateUrl: 'templates/publicaciones/sonido.html',
      }
});
musicien.directive('publicacionCompraventa', function() {
  return {
      templateUrl: 'templates/publicaciones/compraventa.html',
      }
});
musicien.directive('crearPost', function() {
  return {
      templateUrl: 'templates/elementos/crear-post.html',
      controller: 'crearpost'
      }
});
musicien.directive('planes', function() {
  return {
      templateUrl: 'templates/elementos/planes.html',
      controller: 'planes'
      }
});
musicien.directive("erroresPublicacion", function() {
  return {
    templateUrl: 'templates/elementos/errores-publicacion.html',
  }
})
musicien.directive("validaciones", function() {
  return {
    templateUrl: 'templates/elementos/validaciones.html',
  }
})
musicien.directive("valoracionesPublicacion", function() {
  return {
    templateUrl: 'templates/elementos/valoraciones.html',
    controller: 'valorarpublicacion'
  }
})
musicien.directive("valoracionMedia", function() {
  return {
    templateUrl: 'templates/elementos/valoracionmedia.html',
    controller: 'valoracion'
  }
})
musicien.directive("comentario", function() {
  return {
    templateUrl:'templates/elementos/comentario.html',
  }
})
musicien.directive("comentarioNorespuesta", function() {
  return {
    templateUrl:'templates/elementos/comentario-norespuesta.html',
  }
})
musicien.directive("formularioComentario", function() {
  return {
    templateUrl:'templates/elementos/formulario-comentario.html',
    controller:'formulariocomentario'
  }
})
musicien.directive("miniPerfilFollows", function() {
  return {
    templateUrl:'templates/elementos/mini-perfil-follows.html',
  }
})
musicien.directive("filtrosBusqueda", function() {
  return {
    templateUrl:'templates/elementos/filtros-busqueda.html',
  }
})
musicien.directive("objetoComplejo", function() {
  return {
    templateUrl:'templates/objetos/complejo.html',
  }
})
musicien.directive("objetoEtiqueta", function() {
  return {
    templateUrl:'templates/objetos/etiquetas.html',
  }
})
musicien.directive("sugerenciasCan", function() {
  return {
    templateUrl:'templates/elementos/sugerenciasCan.html',
  }
})

musicien.directive('selectWatcher', function ($timeout) {
    return {
        link: function (scope, element, attr) {
            var last = attr.last;
            if (last === "true") {
                $timeout(function () {
                    $(element).parent().selectpicker('val', 'any');
                    $('.selectpicker').addClass('col-lg-12').selectpicker('setStyle');
                    // $('.selectpicker').selectpicker('selectAll');
                    $(element).parent().selectpicker('refresh');
                });
            }
        }
    };
});
musicien.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                }
            });
        };
});
musicien.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});
