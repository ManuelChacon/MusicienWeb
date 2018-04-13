<!doctype html>
<html lang="es" ng-app="musicien">
  <head>
    <title>MUSICIEN - Bringing Music Back to Live</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script> -->


    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
    <link rel="stylesheet" href="css/style.css" />

    <link href="css/custom.css" rel="stylesheet">
    <link href="css/loaders.css" rel="stylesheet">
    <link href="css/swiper.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/component.css">
    <link rel="stylesheet" href="css/demo.css">
    <link rel="stylesheet" href="css/ionicons.min.css" />
    <link rel="stylesheet" href="css/font-awesome.min.css" />
    <link  rel="stylesheet" href="css/emoji.css">
    <link rel="stylesheet" href="css/jquery.mCustomScrollbar.min.css" type="text/css"/>


    <!--Google Font-->
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,700i" rel="stylesheet">
    <!--Favicon-->
    <link rel="shortcut icon" type="image/png" href="images/fav.png"/>


    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/css/bootstrap-select.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/3.4.5/select2.css">
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.8.5/css/selectize.default.css">
    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/ionicons.min.css" />
    <link rel="stylesheet" href="css/font-awesome.min.css" />
    <link  rel="stylesheet" href="css/emoji.css">
    <link rel="stylesheet" href="css/selec.css">
    <link rel="stylesheet" href="css/slider-wrapper.css">


    <!--Google Font-->
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,700i" rel="stylesheet">
    <!--Favicon-->
    <link rel="shortcut icon" type="image/png" href="images/fav.png"/>


    <script src="http://code.jquery.com/jquery-latest.js"></script>
   

   
    <script src="http://82.223.27.144/dsSignalRChat/Scripts/jquery.signalR-2.2.2.js"></script>

   

    <script>
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '290207971502502',
          cookie     : true,
          xfbml      : true,
          version    : 'v2.10'
        });

        FB.AppEvents.logPageView();

      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "https://connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    </script>
    <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
    <script type="text/javascript">
      var OneSignal = window.OneSignal || [];
      OneSignal.push(function() {
        OneSignal.init({
          appId: "a34da277-1dc3-4273-8316-09c6c7435e0a",
          autoRegister: false,
          notifyButton: {
            enable: false,
          },
        });
      });

    </script>
    <script type="text/javascript">
    OneSignal.push(function() {
      // Occurs when the user's subscription changes to a new value.
      OneSignal.on('subscriptionChange', function (isSubscribed) {
        console.log("The user's subscription state is now:", isSubscribed);
        cambioSuscripcion(isSubscribed);
      });
    });
  </script>
    <script type="text/javascript" src="apps/notifyProvider.js">

    </script>

  </head>
  <body  style="text-align:center">
<!-- <div id="loaderraro" class="loader loader-bg" onclick="eliminarLoader()"> -->

    <div></div>
    <div></div>
  </div>
</div>
    <!-- INICIO HEADER -->
  <header id="header" class="">
    <div class="container ">
     <nav class="navbar navbar-expand-lg fixed-top menu ">
      <div class="container" >
        <a class="navbar-brand" ng-click="inicio()">
            <img src="img/logo_p.png" class="m-0 p-0" height="30"> <span class="ml-1">MUSICIEN</span>
        </a>



      </div>

     </nav>
      <div class="row">
          <div class="col-6 offset-3">

          </div>
        </div>

    </div>
      </header>
<!-- FIN HEADER -->



<?php
$nombre = $_POST['nombre'];
$telefono = $_POST['telefono'];
$mail = $_POST['email'];
$mensaje = $_POST['mensaje'];

$header = 'From: ' . $mail . " \r\n";
$header .= "X-Mailer: PHP/" . phpversion() . " \r\n";
$header .= "Mime-Version: 1.0 \r\n";
$header .= "Content-Type: text/plain";

$mensaje = "Este mensaje fue enviado por " . $nombre . ", con el telefono " . $telefono . " \r\n";
$mensaje .= "Su e-mail es: " . $mail . " \r\n";
$mensaje .= "Mensaje: " . $_POST['mensaje'] . " \r\n";
$mensaje .= "Enviado el " . date('d/m/Y', time());

$para = 'musicien@musicien.es';
$asunto = 'Contacto desde Web';

mail($para, $asunto, utf8_decode($mensaje), $header);



?>

  
                <div id="page-contents">
                <div class="container">
                <div class="row ">
                <div  class="col-md-12 post-content ">
                <div class="row pt-5 text-center">
                    
                    <div class="col-12">
                         <center><h1><?php echo 'Tu formulario se ha enviado correctamente';?></h1></center>
                    </div>
                    

                </div>






                
                  <div class="container">
                    <div class="row p-5">

                        <div class="col-12 text-center">
                          
                            
                          

                        </div>

                          <div class="col-12 mt-5">
                   <img src="img/logo_p.png" class="m-0 p-0 d-block mx-auto" height="30"> <span class="ml-1">volver a <a href="http://www.musicien.es/#!/"> MUSICIEN</a> </span>

                      </div>


                      </div>
                    </div>
                      </div>
                    </div>
                  </div>
                </div>



               




    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.3/js/tether.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>

    <script src="js/jquery.scrollbar.min.js"></script>
    <script src="js/script.js"></script>

    <!--Cosas DevExpress -->
    <script type="text/javascript" src="js/dx.all.js">

    </script>
    <link rel="stylesheet" href="css/dx.common.css">
    <link rel="stylesheet" href="css/dx.contrast.css">
    <link rel="stylesheet" href="css/dx.light.css">


<!-- COSAS DEL HOME -->
  <!-- <script src="js/jquery.min.js" ></script> -->
 <!--  <script src="js/bootstrap.min.js"></script> -->
  <script src="js/scrollPosStyler.js"></script>
  <script src="js/swiper.min.js"></script>
  <script src="js/isotope.min.js"></script>
  <script src="js/nivo-lightbox.min.js"></script>
  <script src="js/wow.min.js"></script>
  <script src="js/core.js"></script>


  </body>
</html>
