musicien.controller('valorarpublicacion', function ($scope, $location, Llamada, $window, $sce) {
  /*$scope.valorarPublicacion = function(IDPublicacion, IDUsuario, Valoracion, Tipo) {
  Llamada.http.get(IDPublicacion, IDUsuario, Valoracion, Tipo)
    .then(function(respuesta) {
    })
  }*/
  $scope.valorar = function(valor, tipo) {
    if (getIDUsuario() < 1) {
      anadirErrores($scope.lang.poder_valorar_err);
    } else {
      Llamada.http.get("ValoracionesPublicacionCrear?IDPublicacion=" + $scope.publicacion.IDPublicacion + "&IDUsuario=" + getIDUsuario() + "&Valoracion=" + valor + "&Tipo=" + tipo + "&IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.publicacion.Likes = respuesta.data.Likes;
          $scope.publicacion.NoLikes = respuesta.data.NoLikes;
          $scope.publicacion.Valoracion = respuesta.data.Valoracion;
          $scope.publicacion.Liked = respuesta.data.Liked;
          $scope.publicacion.NoLiked = respuesta.data.NoLiked;
          $scope.publicacion.Valorada = respuesta.data.Valorada;
          $scope.publicacion.NumRemusiqueos = respuesta.data.NumRemusiqueos;
        })
    }
  }
  $scope.changeColor = function(propiedad,color) {
    if (propiedad > 0) {
      return "color:" + color;
    } else {
      "";
    }
  }
});

musicien.controller('valoracion', function ($scope, $location, Llamada, $window, $sce) {
  $scope.init = function(valoracion) {
    $scope.valoracion = valoracion;
    $scope.checkValoracion($scope.valoracion);
  }
  $scope.notamusic = [
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
  ]
  $scope.checkValoracion = function(val) {
    for (i = 0; i < $scope.notamusic.length; i++) {
      $scope.notamusic[i].url = 'img/start_2.png';
    }
    for (i = 0; i < (val/2); i++) {
      $scope.notamusic[i].url = 'img/start_1.png';
    }
    if (val/2 > parseInt(val/2)) {
      $scope.notamusic[parseInt((val/2))].url = 'img/start_3.png';
    }
  }

  $scope.changeclass = function(index) {
    val = (+(index) +1)*2
    $scope.checkValoracion(val);
  }
  $scope.changeoutclass = function(val) {
    $scope.checkValoracion($scope.valoracion);
  }
  $scope.valoraryanotar = function(valor, tipo) {
    $scope.valoracion = valor;
    $scope.valorar(valor, tipo)
  }
  $scope.reMusiquear = function(publi) {
    if (getIDUsuario() < 1) {
      anadirErrores($scope.lang.remusiquear_error);
    } else {
      Llamada.http.get("PublicacionesRemusiquear?IDPublicacion=" + publi.IDPublicacion + "&IDUsuario=" + getIDUsuario() + "&IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.publicacion.Likes = respuesta.data.Likes;
          $scope.publicacion.NoLikes = respuesta.data.NoLikes;
          $scope.publicacion.Valoracion = respuesta.data.Valoracion;
          $scope.publicacion.Liked = respuesta.data.Liked;
          $scope.publicacion.NoLiked = respuesta.data.NoLiked;
          $scope.publicacion.Valorada = respuesta.data.Valorada;
          $scope.publicacion.NumRemusiqueos = respuesta.data.NumRemusiqueos;
          $scope.publicacion.IDMiRePublicacion = respuesta.data.IDMiRePublicacion;
          mensajeExito($scope.lang.remusiquear_exito);
        })
    }

  }
});
musicien.controller('valorarpublicacion', function ($scope, $location, Llamada, $window, $sce) {
  /*$scope.valorarPublicacion = function(IDPublicacion, IDUsuario, Valoracion, Tipo) {
  Llamada.http.get(IDPublicacion, IDUsuario, Valoracion, Tipo)
    .then(function(respuesta) {
    })
  }*/
  $scope.valorar = function(valor, tipo) {
    if (getIDUsuario() < 1) {
      anadirErrores($scope.lang.poder_valorar_err);
    } else {
      Llamada.http.get("ValoracionesPublicacionCrear?IDPublicacion=" + $scope.publicacion.IDPublicacion + "&IDUsuario=" + getIDUsuario() + "&Valoracion=" + valor + "&Tipo=" + tipo + "&IDIdioma=" + getIdioma())
        .then(function(respuesta) {
          $scope.publicacion.Likes = respuesta.data.Likes;
          $scope.publicacion.NoLikes = respuesta.data.NoLikes;
          $scope.publicacion.Valoracion = respuesta.data.Valoracion;
          $scope.publicacion.Liked = respuesta.data.Liked;
          $scope.publicacion.NoLiked = respuesta.data.NoLiked;
          $scope.publicacion.Valorada = respuesta.data.Valorada;
          $scope.publicacion.NumRemusiqueos = respuesta.data.NumRemusiqueos;
        })
    }
  }
  $scope.changeColor = function(propiedad,color) {
    if (propiedad > 0) {
      return "color:" + color;
    } else {
      "";
    }
  }
});

musicien.controller('valorarusuario', function ($scope, $location, Llamada, $window, $sce) {
  $scope.init = function(musico) {
    $scope.valoracion = musico.Valoracion;
    $scope.musico = musico;
    $scope.checkValoracion($scope.valoracion);
  }
  $scope.notamusic = [
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
  ]
  $scope.checkValoracion = function(val) {
    for (i = 0; i < $scope.notamusic.length; i++) {
      $scope.notamusic[i].url = 'img/start_2.png';
    }
    for (i = 0; i < (val/2); i++) {
      $scope.notamusic[i].url = 'img/start_1.png';
    }
    if (val/2 > parseInt(val/2)) {
      $scope.notamusic[parseInt((val/2))].url = 'img/start_3.png';
    }
  }

  $scope.changeclass = function(index) {
    val = (+(index) +1)*2
    $scope.checkValoracion(val);
  }
  $scope.changeoutclass = function(val) {
    $scope.checkValoracion($scope.valoracion);
  }
  $scope.valoraryanotar = function(valor, tipo, musico) {
    console.log(valor, tipo, musico)
    $scope.valoracion = valor;
    if (NotNullNotUndefinedNotEmpty(musico)) {
      $scope.valorarusertop(valor, tipo, musico)
    } else {
      $scope.valorarusertop(valor, tipo, $scope.musico)
    }

  }
});
musicien.controller('valorarusuariodos', function ($scope, $location, Llamada, $window, $sce) {
  $scope.init = function(musico) {
    $scope.valoracion = musico.Valoracion;
    $scope.musico = musico;
    $scope.valorada = musico.Valorada;
    $scope.checkValoracion($scope.valoracion);
    $scope.checkValoracion2($scope.valorada);
    console.log("Estoy en el nuevo");
  }
  $scope.logintrueynosoyyo = function() {
    if (NotNullNotUndefinedNotEmpty($scope.musico)) {
      if ($scope.checkLoginStatus()) {
        if ($scope.usuario.IDUsuario != $scope.musico.IDUsuario) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  $scope.notamusic = [
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
  ]
  $scope.notamusic2 = [
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
    { url: 'img/start_2.png' },
  ]
  $scope.checkValoracion = function(val) {
    for (i = 0; i < $scope.notamusic.length; i++) {
      $scope.notamusic[i].url = 'img/start_2.png';
    }
    for (i = 0; i < (val/2); i++) {
      $scope.notamusic[i].url = 'img/start_1.png';
    }
    if (val/2 > parseInt(val/2)) {
      $scope.notamusic[parseInt((val/2))].url = 'img/start_3.png';
    }
  }
  $scope.checkValoracion2 = function(val) {
    for (i = 0; i < $scope.notamusic2.length; i++) {
      $scope.notamusic2[i].url = 'img/start_2.png';
    }
    for (i = 0; i < (val/2); i++) {
      $scope.notamusic2[i].url = 'img/start_1.png';
    }
    if (val/2 > parseInt(val/2)) {
      $scope.notamusic2[parseInt((val/2))].url = 'img/start_3.png';
    }
  }

  $scope.changeclass = function(index) {
    val = (+(index) +1)*2
    $scope.checkValoracion2(val);
  }
  $scope.changeoutclass = function(val) {
    $scope.checkValoracion2($scope.valorada);
  }
  $scope.valoraryanotar = function(valor, tipo, musico) {
    console.log(valor, tipo, musico)
    $scope.valorada = valor;
    if ($scope.valoracion < 1) {
      $scope.valoracion = valor;
    }
    if (NotNullNotUndefinedNotEmpty(musico)) {
      $scope.valorarusertop(valor, tipo, musico)
    } else {
      $scope.valorarusertop(valor, tipo, $scope.musico)
    }

  }
});
