musicien.factory('Redes', function($http, $q, configuracionGlobal, $location, Llamada, $window) {
  //var configuracionGlobal.api_url = "http://localhost:56299/";
  var scopes = 'email, public_profile, user_friends';
  var ClientInstagramID = 'ca3e2447503f4d58932f5eb3048f9261';
  var Sociales = {
    Facebook: {
      Login: function() {
         checkLoginState(function(data) {
           if (data.status !== 'connected') {
             FB.login(function(response) {
               FBStatusLogin.status = response.status;
               FBStatusLogin.authResponse = response.authResponse;
               if (response.status === 'connected')
                 getFacebookData();
             }, {scope: scopes});
           } else {
             FBStatusLogin.status = data.status;
             FBStatusLogin.authResponse = data.authResponse;
             getFacebookData();
           }
         })
       },
       SharePubli: function(IDPublicacion) {
         console.log(configuracionGlobal.url_sitio + "/sharer.php?Pb=" + IDPublicacion)
         FB.ui({ method: 'share',
          href: configuracionGlobal.url_sitio + "/sharer.php?Pb=" + IDPublicacion,
          })
       }
     },
     Twitter: {
       AuthURL: function() {
         Llamada.http.get("UsuariosTwitterObtenerURL")
          .then(function(respuesta) {
            $window.location.href = respuesta.data;
          })
       },
       Callback: function(params) {
         Llamada.http.get("UsuariosTwitterVerificar?" + params)
          .then(function(respuesta) {
            sessionStorage.setItem("musicienLogin", JSON.stringify({IDUsuario: respuesta.data.ID }));
            $location.path("/new");
          })
       },
       ObtenerBoton: function(Titulo, IDPublicacion) {
         try {
           twttr.widgets.createShareButton(
                                  configuracionGlobal.url_sitio + "/sharer.php?Pb=" + IDPublicacion,
                                   document.getElementById("twitterbuttonnoticia"),
                                   function(el) {}, {
                                       count: 'none',
                                       text: Titulo
                                   }
                               );
         }
         catch (ex) {
         }

       }
     },
     Instagram: {
       AuthURL: function() {
         //alert("https://instagram.com/oauth/authorize/?client_id=" + ClientInstagramID + "&redirect_uri=http://musicien.es/authInstagram.html" + "&response_type=token", "_self");
         window.open("https://instagram.com/oauth/authorize/?client_id=" + ClientInstagramID + "&redirect_uri=http://musicien.es/authInstagram.html" + "&response_type=token", "_self");
       },
       Login: function(token) {
         $.ajax({
         url: "https://api.instagram.com/v1/users/self/?access_token=" + token,
         type: "GET",
         crossDomain: true,
         dataType: "jsonp",
         success: function(respuesta){
           datosInstagram = {full_name: respuesta.data.full_name , id: respuesta.data.id, profile_picture: respuesta.data.profile_picture, username: respuesta.data.username, website: respuesta.data.website, token: token }
           IniciarSesionUsuario(datosInstagram, 'InstagramID');
        }
      });
     }
   },
   Whatsapp: {
     ObtenerBoton: function(Titulo, IDPublicacion) {
       buttonwhatsapp = document.createElement("A");
       buttonwhatsapp.href = "whatsapp://send?text=" + Titulo + " || " + configuracionGlobal.url_sitio + "/sharer.php?Pb=" + IDPublicacion;
       buttonwhatsapp.innerHTML = "";
       buttonwhatsapp.className = "btn-whatsapp";
       return buttonwhatsapp
     }
   }
  }
  var checkLoginState = function(callback) {
       FB.getLoginStatus(function(response) {
          callback(response);
       });
     }
  var getFacebookData =  function() {
          FB.api('/me', function(response) {
            datosFB = response;
            IniciarSesionUsuario(datosFB, 'FacebookID');
          });
        }
  var FBStatusLogin = {status: "unknown", authResponse: null}
  var IniciarSesionUsuario = function(Usuario, redSocial) {
        var api_inicio = "UsuariosLoginSocial?Nombre=";
       switch (redSocial) {
         case 'FacebookID':
           NombreUsuario = Usuario.name;
           ID = Usuario.id;
           Imagen = "http://graph.facebook.com/" + Usuario.id + "/picture?type=large";
           cadena = api_inicio + Usuario.name + "&Identificador=" + Usuario.id + "&redSocial=" + redSocial + "&Imagen=" + Imagen;
           break;
           case 'InstagramID':
           NombreUsuario = Usuario.full_name;
           ID = Usuario.id;
           Imagen = Usuario.profile_picture;
           cadena = api_inicio + Usuario.full_name + "&Identificador=" + Usuario.id + "&redSocial=" + redSocial + "&Imagen=" + Imagen;
           break;
           case 'GoogleID':
           NombreUsuario = Usuario.full_name;
           ID = Usuario.id;
           Imagen = Usuario.profile_picture;
           cadena = api_inicio + Usuario.full_name + "&Identificador=" + Usuario.id + "&redSocial=" + redSocial + "&Imagen=" + Imagen;
           break;
           case 'LinkedIn':
           NombreUsuario = Usuario.firstName + " " + Usuario.lastName;
           ID = Usuario.id;
           if (Usuario.pictureUrl !== undefined && Usuario.pictureUrl !== null) {
             Imagen = Usuario.pictureUrl;
           } else {
             Imagen = "";
           }
           cadena = api_inicio + NombreUsuario + "&Identificador=" + Usuario.id + "&redSocial=" + redSocial + "&Imagen=" + Imagen;
           break;
         default:
           cadena = "";
       }
       Llamada.http.get(cadena)
        .then(function(respuesta) {
          sessionStorage.setItem("musicienLogin", JSON.stringify({IDUsuario: respuesta.data.ID }));
          $location.path("/new");
        })
      };
  return {
    Sociales
  }
});
