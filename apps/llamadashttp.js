musicien.factory('Llamada', function($http, $q, configuracionGlobal) {
  var api_url = configuracionGlobal.api_url;
  var usuario;
  var http = {
    get: function(url) {
      var deferred = $q.defer();
      $http.get(api_url + url)
        .then(function(respuesta) {
          deferred.resolve(respuesta);
        }, function(response) {
          str = 'error';
          console.log(response);
          if (NotNullNotUndefinedNotEmpty(response.statusText)) {
            console.log(response);
          } else {
            console.log("Ha ocurrido un error")
          }
        })
        return deferred.promise;
    },
    post: function(url, body) {
      var deferred = $q.defer();
      $.ajax({
              data:  body,
              url:   api_url + url,
              type:  'post',
              success:  function (response) {
                deferred.resolve(response);
              },
              error: function (request, status, error) {
                console.log(request, status, error);
                DevExpress.ui.notify(request.responseJSON.Message, "error", 2000);
              }
      });
      return deferred.promise;
    },
    getArrayByte: function(URLImagen, Tipo, pos) {
      var deferred = $q.defer();
      deferred.resolve({data: api_url + "DownloadFile?fileName=" + URLImagen + "&Tipo=" + Tipo, posi:pos});
       /*var cargadoprevio = servirImagenCargada(URLImagen,Tipo);
       if (cargadoprevio.estado) {
         deferred.resolve({data:cargadoprevio.datosbin.imagen,posi:pos});
       } else {
         if (URLImagen == "" || URLImagen === null || URLImagen === undefined) {
           deferred.resolve({data:null, posi: pos})
         } else {
           $http({
             method: 'GET',
             url: api_url + "DownloadFile?fileName=" + URLImagen + "&Tipo=" + Tipo,
             responseType: 'arraybuffer'
           }).then(function(response) {
             anadirMultimediaAListado(URLImagen, "data:image/png;base64," + _arrayBufferToBase64(response.data), Tipo);
             deferred.resolve({data:"data:image/png;base64," + _arrayBufferToBase64(response.data), posi:pos});
           }, function(response) {
             str = 'error';
             console.log(response.statusText);
           });
         }
       }*/
       return deferred.promise;
    },
    /*getArrayByte: function(URLImagen, Tipo, pos) {
      var deferred = $q.defer();
       var cargadoprevio = servirImagenCargada(URLImagen,Tipo);
       if (cargadoprevio.estado) {
         deferred.resolve({data:cargadoprevio.datosbin.imagen,posi:pos});
       } else {
         if (URLImagen == "" || URLImagen === null || URLImagen === undefined) {
           deferred.resolve({data:null, posi: pos})
         } else {
           $http({
             method: 'GET',
             url: api_url + "DownloadFile?fileName=" + URLImagen + "&Tipo=" + Tipo,
             responseType: 'arraybuffer'
           }).then(function(response) {
             anadirMultimediaAListado(URLImagen, "data:image/png;base64," + _arrayBufferToBase64(response.data), Tipo);
             deferred.resolve({data:"data:image/png;base64," + _arrayBufferToBase64(response.data), posi:pos});
           }, function(response) {
             str = 'error';
             console.log(response.statusText);
           });
         }
       }
       return deferred.promise;
    },*/
    postFileInput: function(input, tipo) {
      var fd = new FormData();
      fd.append('file.jpg', input);
      var deferred = $q.defer();
      $.ajax({
          type: 'POST',
          //url: 'http://82.223.27.144/dsWASNoticias/Enviar?overWrite=false',
          url: api_url + "UploadFile?overwrite=true&Tipo=" + tipo,
          //url: configuracionGlobal.api_url + configuracionGlobal.api_subir_imagen_flickr + $scope.usuario.IDAutor + "&nombre=" + $scope.imagenasubir.Titulo + "&titulo=" + $scope.imagenasubir.Titulo + "&descripcion=" + $scope.imagenasubir.descripcion + "&tags=" + $scope.imagenasubir.Etiquetas,
          data: fd,
          async: true,
          cache: false,
          contentType: false,
          processData: false
      }).done(function (d) {
          deferred.resolve(d);
          // callback function in the controller
          //$scope.myCallback(d);
      }).fail(function (x) {
          deferred.resolve(x);
      });
      return deferred.promise;
    },
    postFile: function(fd, tipo) {
      var deferred = $q.defer();
      $.ajax({
          type: 'POST',
          //url: 'http://82.223.27.144/dsWASNoticias/Enviar?overWrite=false',
          url: api_url + "UploadFile?overwrite=true&Tipo=" + tipo,
          //url: configuracionGlobal.api_url + configuracionGlobal.api_subir_imagen_flickr + $scope.usuario.IDAutor + "&nombre=" + $scope.imagenasubir.Titulo + "&titulo=" + $scope.imagenasubir.Titulo + "&descripcion=" + $scope.imagenasubir.descripcion + "&tags=" + $scope.imagenasubir.Etiquetas,
          data: fd,
          async: true,
          cache: false,
          contentType: false,
          processData: false
      }).done(function (d) {
          deferred.resolve(d);
          // callback function in the controller
          //$scope.myCallback(d);
      }).fail(function (x) {
          deferred.resolve(x);
      });
      return deferred.promise;
    },
    getAuthGetToken: function(email, contrasena) {
      var deferred = $q.defer();
      var login = email + ":" + contrasena;
      var header = {
        "Authorization": 'Basic ' + btoa(login)
      };
      $http.get(
        api_url + "UsuariosLogin?Auth=" + btoa(login))
          .then(function(respuesta) {
          //$scope.usuario.IdUsuario = respuesta.headers("user");
          //$scope.usuario.Token = respuesta.headers("token");
          //$scope.usuario.TokenExpiry = respuesta.headers("tokenexpiry");
          //console.log($scope.usuario);
          usuario = respuesta.data;
          sessionStorage.setItem("musicienLogin", JSON.stringify(usuario));
          deferred.resolve(usuario);
        }, function(err) {
          deferred.resolve(err);
        });
      return deferred.promise;
    },
    getAuthGetAdminToken: function(email, contrasena) {
      var deferred = $q.defer();
      var login = email + ":" + contrasena;
      var header = {
        "Authorization": 'Basic ' + btoa(login)
      };
      $http.get(
        api_url + "AdminLogin?Auth=" + btoa(login))
          .then(function(respuesta) {
          //$scope.usuario.IdUsuario = respuesta.headers("user");
          //$scope.usuario.Token = respuesta.headers("token");
          //$scope.usuario.TokenExpiry = respuesta.headers("tokenexpiry");
          //console.log($scope.usuario);
          usuario = respuesta.data;
          sessionStorage.setItem("musicienLogin", JSON.stringify(usuario));
          deferred.resolve(usuario);
        }, function(err) {
          deferred.resolve(err);
        });
      return deferred.promise;
    },
    getUsuario: function() {
      return usuario;
    }
  }
  var ImagenesServidas = [];
  var anadirMultimediaAListado = function(url, datosbin, tipo) {
    var nuevaimagen = {
      url: url,
      imagen: datosbin,
      Tipo: tipo,
    }
    ImagenesServidas.push(nuevaimagen);
  }
  var buscarImagenServida = function(url, tipo) {
    posi = -1;
    for (h = 0; h < ImagenesServidas.length; h++) {
      if (ImagenesServidas[h].url == url && ImagenesServidas[h].Tipo == tipo) {
        posi = h;
      }
    }
    return posi;
  }
  var servirImagenCargada = function(url, tipo) {
      var resultado = { estado: false, datosbin: undefined }
      var posicion = buscarImagenServida(url, tipo);
      if (posicion > -1) {
        resultado.estado = true;
        resultado.datosbin = ImagenesServidas[posicion];
      }
      return resultado;
  }
  var _arrayBufferToBase64 = function(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  return {
    http
  }
});
