musicien.controller('crearpost', function ($scope, $location, Llamada, $window, $routeParams) {
  $scope.guardando = false;
  if (NotNullNotUndefinedNotEmpty($routeParams.IDPublicacion)) {
    Llamada.http.get("PublicacionesLeerPorID?IDPublicacion=" + $routeParams.IDPublicacion + "&IDUsuarioLector=&IDIdioma=" + getIdioma())
      .then(function(respuesta) {
        $scope.publicacion = respuesta.data;
        console.log(respuesta);
        if (NotNullNotUndefinedNotEmpty($scope.publicacion.FechaDesde)) {
          $scope.publicacion.FechaDesde = new Date(TransformarFecha($scope.publicacion.FechaDesde).Fecha);
        }
        if (NotNullNotUndefinedNotEmpty($scope.publicacion.FechaHasta)) {
          $scope.publicacion.FechaHasta = new Date(TransformarFecha($scope.publicacion.FechaHasta).Fecha);
        }
        console.log($scope.publicacion);
        $scope.selectedTipo = true;
      })
  } else {
    $scope.publicacion = new Publicacion();
  }

  $scope.selectedTipo = false;
  $scope.cargarTiposPublicacion();
  $scope.selecttipopubli = function(tipopubli) {
    if (tipopubli.Checked) {
      $scope.publicacion.TipoPubli = tipopubli;
      $scope.selectedTipo = true;
    } else {
      anadirErrores($scope.lang.contratar_plan_error);
    }

  }
  $scope.quitarTipo = function() {
    $scope.selectedTipo = false;
  }
  $scope.posicionCambiada = function(esto) {
    console.log(esto.selectedPosition);
    var sel = JSON.parse(esto.selectedPosition);
    console.log(sel)
    $scope.publicacion.IDPosicionPublicidad = sel.IDPosicionPublicidad;
    $scope.publicacion.NombrePosicionPublicidad = sel.NombrePosicion;
  }
  $scope.noestipo = function(propiedad, tipo) {
    if (propiedad.TipoValor == tipo) {
      return false;
    } else {
      return true;
    }
  }
  $scope.noesfecha = function(propiedad) {
    if (!$scope.noestipo(propiedad,'Y') || !$scope.noestipo(propiedad,'D')) {
      return false;
    } else {
      return true;
    }
  }
  $scope.guardarPublicacion = function() {
    $scope.guardando = true;
    if (NotNullNotUndefinedNotEmpty($scope.publicacion.TipoPubli.Propiedades)) {
      recorrerPropiedades(0);
    } else {
      guardarPublicacion();
    }
  }
  recorrerPropiedades = function(index) {
    if (index < $scope.publicacion.TipoPubli.Propiedades.length) {
      if (NotNullNotUndefinedNotEmpty($scope.publicacion.TipoPubli.Propiedades[index].newLista)) {
        $scope.previsualizarLista($scope.publicacion.TipoPubli.Propiedades[index]);
      }
      if (NotNullNotUndefinedNotEmpty($scope.publicacion.TipoPubli.Propiedades[index].ValorFecha)) {
        $scope.publicacion.TipoPubli.Propiedades[index].Valor = TransformarFechaParaServicio($scope.publicacion.TipoPubli.Propiedades[index].ValorFecha, "23:59:00");
      }
      if (NotNullNotUndefinedNotEmpty($scope.publicacion.TipoPubli.Propiedades[index].newFile)) {
        if ($scope.publicacion.TipoPubli.Propiedades[index].TipoValor != "A") {
          var arr = []
          var y = 0;
          while (y < $scope.publicacion.TipoPubli.Propiedades[index].newFile.length) {
            var fd = new FormData();
            angular.forEach($scope.publicacion.TipoPubli.Propiedades[index].newFile, function (v, k) {
              if (k == y) {
                fd.append('file.jpg', $scope.publicacion.TipoPubli.Propiedades[index].newFile[k]);
              }
            });
            arr.push({formdata: fd});
            y++
          }
          console.log(arr);
          Llamada.http.postFile(arr[0].formdata, $scope.publicacion.TipoPubli.Propiedades[index].TipoValor)
            .then(function(respuesta) {
              console.log(respuesta);
              $scope.publicacion.TipoPubli.Propiedades[index].Valor = respuesta.Archivo;
              $scope.publicacion.TipoPubli.Propiedades[index].newFile = null;
              index++;
              recorrerPropiedades(index);
            });
        } else {
          RecorrerMultiplesImagenes(index,0);
        }
      } else {
        index++;
        recorrerPropiedades(index);
      }
    } else {
      guardarPublicacion();
    }
  }
  RecorrerMultiplesImagenes = function(index, k) {
    if (k < 1) {
      console.log("Inicializo el valor");
      $scope.publicacion.TipoPubli.Propiedades[index].Valor = "";
    } else {
      console.log("K es " + k)
    }
    if (k < $scope.publicacion.TipoPubli.Propiedades[index].newFile.length) {
      var arr = []
      var y = 0;
      var fd = new FormData();
      fd.append('file.jpg', $scope.publicacion.TipoPubli.Propiedades[index].newFile[k]);
      arr.push({formdata: fd});
      console.log(arr);
      Llamada.http.postFile(arr[0].formdata, "I")
        .then(function(respuesta) {
          console.log(respuesta);
          console.log("archivo subido")
          $scope.publicacion.TipoPubli.Propiedades[index].Valor = $scope.publicacion.TipoPubli.Propiedades[index].Valor + "#" + respuesta.Archivo;
          k++;
          RecorrerMultiplesImagenes(index, k);
        });
    } else {
      $scope.publicacion.TipoPubli.Propiedades[index].newFile = null;
      index++;
      recorrerPropiedades(index);
    }

  }
  guardarPublicacion = function() {
    console.log("Ya se puede guardar!");
    console.log($scope.publicacion);
    $scope.publicacion.IDUsuario = getIDUsuario();
    if (NotNullNotUndefinedNotEmpty($scope.publicacion.Titulo)) {
      if (NotNullNotUndefinedNotEmpty($scope.publicacion.FechaDesde)) {
        $scope.publicacion.FechaDesde = TransformarFechaParaServicio($scope.publicacion.FechaDesde, "00:00");
      }
      if (NotNullNotUndefinedNotEmpty($scope.publicacion.FechaHasta)) {
        $scope.publicacion.FechaHasta = TransformarFechaParaServicio($scope.publicacion.FechaHasta, "23:59");
      }
      if ($scope.publicacion.TipoPubli.Privado > 0) {
        if (!NotNullNotUndefinedNotEmpty($scope.publicacion.IDPosicionPublicidad)) {
          anadirErrores($scope.lang.posicion_error);
        } else {
          Llamada.http.post("PublicacionesCrearModificar", $scope.publicacion)
            .then(function(respuesta) {
              console.log(respuesta);
              console.log($scope.tempMM);
              $scope.publicacion.IDPublicacion = respuesta.ID;
              anadirPublicacion($scope.publicacion)
              if ($scope.estabamodificando !== true) {
                console.log("Borro la publi");
                $scope.publicacion = new Publicacion();
                $scope.emptys = [];
              } else {
                console.log("No la vacío")
              }
              $scope.guardando = false;
            })
        }
      } else {
        Llamada.http.post("PublicacionesCrearModificar", $scope.publicacion)
          .then(function(respuesta) {
            console.log(respuesta);
            console.log($scope.tempMM);
            $scope.publicacion.IDPublicacion = respuesta.ID;
            anadirPublicacion($scope.publicacion)
            if ($scope.estabamodificando !== true) {
              console.log("Borro la publi");
              $scope.publicacion = new Publicacion();
              $scope.emptys = [];
            } else {
              console.log("No la vacío")
            }
            $scope.guardando = false;
          })
      }

    } else {
      anadirErrores($scope.lang.poner_titulo_error);
    }

  }
  $scope.verPubli = function(){
    console.log($scope.publicacion);
  }
  window.archivoSubido = function(esto) {
    console.log("Archivo subido!!")
    console.log(esto);
    console.log(esto.id);
    index = parseInt(esto.id.split("propiedad")[1]);
    console.log(index);
    var extensionPermitida = tipoPermitido($scope.publicacion.TipoPubli.Propiedades[index].TipoValor);
    if (esto.files[0].type.indexOf(extensionPermitida) > -1) {
      $scope.$apply(function () {
        console.log(esto.files[0]);
        if ($scope.publicacion.TipoPubli.Propiedades[index].TipoValor != "A") {
          $scope.publicacion.TipoPubli.Propiedades[index].newContenidoMM = $scope.obtenerImagenInput(esto.files[0]);
          $scope.publicacion.TipoPubli.Propiedades[index].Valor = $scope.obtenerImagenInput(esto.files[0]);
          $scope.publicacion.TipoPubli.Propiedades[index].newFile = esto.files;
          $scope.publicacion.TipoPubli.Propiedades[index].fileName = esto.files[0].name;
        } else {
          $scope.publicacion.TipoPubli.Propiedades[index].newContenidoMM = [];
          for (r = 0; r < esto.files.length; r++) {
            $scope.publicacion.TipoPubli.Propiedades[index].newContenidoMM.push($scope.obtenerImagenInput(esto.files[r]));
          }
          //$scope.publicacion.TipoPubli.Propiedades[index].Valor = $scope.publicacion.TipoPubli.Propiedades[index].newContenidoMM;
          $scope.publicacion.TipoPubli.Propiedades[index].newFile = esto.files;
          $scope.publicacion.TipoPubli.Propiedades[index].fileName = esto.files[0].name;
        }
      });
    } else {
      anadirErrores($scope.lang.no_permitido_error);
    }

  }
  tipoPermitido = function(TipoValor) {
    var comp = "";
    switch (TipoValor) {
      case "I":
        comp = "image";
        break;
        case "S":
          comp = "audio";
          break;
          case "V":
            comp = "video";
            break;
            case "N":
              comp = "image";
              break;
      default:

    }
    return comp;
  }
  $scope.obtenerImagenPublicacion = function(algo) {
    if (NotNullNotUndefinedNotEmpty(algo)) {
      if (algo.ContenidoMMCargado === true) {
        return algo.DataContenidoMM;
      } else {
        if (algo.ContenidoMMCargando === true) {
          return "img/cargando.gif";
        } else {
          algo.ContenidoMMCargando = true;
          Llamada.http.getArrayByte(algo.ContenidoMM, "A")
            .then(function(respuesta) {
              algo.DataContenidoMM = respuesta.data;
              algo.ContenidoMMCargando = false;
              algo.ContenidoMMCargado = true;
            })
        }
      }
    } else {
      return "img/cargando.gif";
    }
  }
  $scope.previsualizarLista = function(propiedad) {
    var noerrors = true;
    if (NotNullNotUndefinedNotEmpty(propiedad.tipoLista)) {
      switch (propiedad.tipoLista) {
        case "SP":
          try {
            console.log(propiedad.newLista);
            var a = propiedad.newLista;
            console.log(a);
            var res = a;
            if (NotNullNotUndefinedNotEmpty(res)) {
              propiedad.Valor = "SP%%%" + res;
            } else {
              propiedad.Valor = "SP%%%" + a;
            }
          }
          catch(ex) {
            anadirErrores($scope.lang.url_spoti_error);
            noerrors = false;
          }
          break;
          case "SC":
            var res = "";
            //$scope.playlists.PlaylistSoundcloud = $scope.PlaylistSoundcloud;
            try {
              b = StringToXMLDom(propiedad.newLista);

              if (NotNullNotUndefinedNotEmpty(b.childNodes[0].attributes.src)) {

                propiedad.Valor = "SC%%%" + b.childNodes[0].attributes.src.value;
              }
              console.log(b);
            } catch (ex) {
              anadirErrores($scope.lang.soundcloud_error);
              console.log(ex);
              noerrors = false;
            }
            break;
        default:
          anadirErrores($scope.lang.tipo_lista_error);
      }
    } else {
      anadirErrores($scope.lang.tipo_lista_error);
    }
    return noerrors;
  }
  StringToXMLDom = function(string){
  	var xmlDoc=null;
    	if (window.DOMParser)
    	{
    		parser=new DOMParser();
    		xmlDoc=parser.parseFromString(string,"text/xml");
    	}
    	else // Internet Explorer
    	{
    		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    		xmlDoc.async="false";
    		xmlDoc.loadXML(string);
    	}
  	return xmlDoc;
  }
});
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
/*musicien.controller('ModalPrevisualiza', function ($scope, $uibModal, $log, $document,Publicacion) {

  $scope.animationsEnabled = false;

  $scope.open = function (size, parentSelector) {
    console.log(Publicacion)
    Publicacion.Modal.set($scope.publicacion)
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

});*/

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
