musicien.controller('playlists', function ($scope, $location, Llamada, $window, $sce, $routeParams) {
  if ($scope.protectedRoute()) {
    Llamada.http.get("PlaylistCompartidasLeer")
      .then(function(respuesta) {
        $scope.playlists = respuesta.data;

        playlistspotify = document.createElement("iframe");
        playlistspotify.src = "https://open.spotify.com/embed?uri=" + $scope.playlists.PlaylistSpotify;
        playlistspotify.width = "100%";
        playlistspotify.height = "150";
        playlistspotify.frameborder = "0";
        playlistspotify.allowtransparency = "true";
        document.getElementById("spotifyplaylists").appendChild(playlistspotify);

        soundcloud = document.createElement("iframe");
        soundcloud.width = "100%";
        soundcloud.height = "166";
        soundcloud.scrolling="no";
        soundcloud.frameborder="no";
        soundcloud.src = $scope.playlists.PlaylistSoundcloud;
        document.getElementById("soundcloudplaylist").appendChild(soundcloud);
      })
  }
  $scope.recargarPlaylists = function() {
    var noerrors = true;
    $scope.playlists.PlaylistSpotify = $scope.PlaylistSpotify;
    /*if (NotNullNotUndefinedNotEmpty()) {
      var res = "";
      try {
        var a = $scope.PlaylistSpotify.split("/album/");
        var res = a[1];
        if (NotNullNotUndefinedNotEmpty(res)) {
          $scope.playlists.PlaylistSpotify = res;
        }
      }
      catch(ex) {
        anadirErorres("La URL de spotify introducida no es válida");
        noerrors = false;
      }

    }*/
    if (NotNullNotUndefinedNotEmpty($scope.PlaylistSoundcloud)) {
      var res = "";
      //$scope.playlists.PlaylistSoundcloud = $scope.PlaylistSoundcloud;
      try {
        b = StringToXMLDom($scope.PlaylistSoundcloud);

        if (NotNullNotUndefinedNotEmpty(b.childNodes[0].attributes.src)) {

          $scope.playlists.PlaylistSoundcloud = b.childNodes[0].attributes.src.value;
          b = $scope.playlists.PlaylistSoundcloud
        }
      } catch (ex) {
        anadirErrores($scope.lang.soundcloud_error);
        noerrors = false;
      }

    }
    document.getElementById("spotifyplaylists").innerHTML = "";
    document.getElementById("soundcloudplaylist").innerHTML = "";
    playlistspotify = document.createElement("iframe");
    playlistspotify.src = "https://open.spotify.com/embed?uri=" + $scope.playlists.PlaylistSpotify;
    playlistspotify.width = "100%";
    playlistspotify.height = "150";
    playlistspotify.frameborder = "0";
    playlistspotify.allowtransparency = "true";
    document.getElementById("spotifyplaylists").appendChild(playlistspotify);

    soundcloud = document.createElement("iframe");
    soundcloud.width = "100%";
    soundcloud.height = "166";
    soundcloud.scrolling="no";
    soundcloud.frameborder="no";
    soundcloud.src = $scope.playlists.PlaylistSoundcloud;
    document.getElementById("soundcloudplaylist").appendChild(soundcloud);
    return noerrors;
  }
  $scope.guardarCambios = function() {
    if ($scope.recargarPlaylists()) {
      Llamada.http.post("PlaylistsCompartidasModificar", $scope.playlists)
        .then(function(respuesta) {
          $scope.playlists = respuesta.data;
          mensajeExito("Los cambios se han guardado exitosamente")
          //$scope.recargarPlaylists();
        })
    }
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
