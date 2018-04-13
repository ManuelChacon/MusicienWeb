<!doctype html>
<html lang="es" ng-app="musicien">
  <head>
    <title>MUSICIEN - Bringing Music Back to Live</title>
    <?php

              $idpub = $_GET['Pb'];
              $USER_AGENT = $_SERVER['HTTP_USER_AGENT'];
              $api_url = "http://82.223.27.144/dsWASMusic/";
              $uri = $api_url."PublicacionesLeerPorID?IDPublicacion=$idpub&IDUsuarioLector=";
              $ch = curl_init();
              curl_setopt($ch, CURLOPT_URL, $uri);
              curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
              $result = curl_exec($ch);

              curl_close($ch);
              //$result = file_get_contents($uri);
                // Will dump a beauty json :3
              $object = json_decode($result, true);
              $idpub = $object['IDPublicacion'];
              $titulo = $object['Titulo'];
              $tipoCMM = $object['Tipo'];
              $rutacontenido = $object['ContenidoMM'];
              $contenidoMM = $api_url."DescargarImagen?fileName=$rutacontenido";
              $contenidoMMAlt = $object['ContenidoMMAlt'];
              $tipoPubli = $object['TipoPubli'];
              $nombreTipo = $tipoPubli['NombreTipo'];
              $propiedades = $tipoPubli['Propiedades'];
              $usuario = $object['Usuario'];
              $nombreUsuario = $usuario['Nombre'];
              $contenidoMMUsuario = "";
              if ($usuario['ContenidoMMServidor'] > 0) {
                $contenidoMMUsuario = $api_url."DescargarImagen?fileName=".$usuario['ContenidoMM'];
              } else {
                $contenidoMMUsuario = $usuario['ContenidoMM'];
              }

              echo "<meta property='og:url' content='http://musicien.es/sharer.php?Pb=$idpub' />";
              echo "<meta property='og:title' content='$titulo' />";
              echo "<meta property='og:description' content='Musicien: Bringing Music Back To Live' />";
              echo "<meta property='og:site_name' content='Musicien: Bringing Music Back To Live' />";
              echo "<meta name='twitter:card' content='summary_large_image' />";
              echo "<meta name='twitter:site' content='http://musicien.es' />";
              echo "<meta name='twitter:title' content='$titulo' />";
              echo "<meta name='twitter:description' content='Musicien: Bringing Music Back To Live' />";
              echo "<meta property='og:image' itemprop='image' content='$contenidoMM'>";
              echo "<link itemprop='thumbnailUrl' href='$contenidoMM'>";
              echo "<meta property='og:locale' content='es_ES' />";
              echo "<meta property='og:image:type' content='image/jpeg'>";

     ?>
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

    <script src="http://platform.twitter.com/widgets.js"></script>
    <!--Google Font-->
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,700i" rel="stylesheet">
    <!--Favicon-->
    <link rel="shortcut icon" type="image/png" href="images/fav.png"/>
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script type="text/javascript" src="js/selec.js">
    </script>
    <script type="text/javascript" src="js/jquery.scrollbar.js"></script>
    <script src="js/sticky.js"></script>

    <script src="js/angular-slide-wrapper.js"></script>

    <script src="js/anchor-scroll.js" type="text/javascript"></script>
     <script src="js/jquery.mCustomScrollbar.concat.min.js"></script>
    <script src="js/scrollbars.min.js"></script>

  </head>
  <body >
    <div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v2.12';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
    <?php
      echo "<link itemprop='thumbnailUrl' href='url_image'>
            <span itemprop='thumbnail' itemscope itemtype='http://schema.org/ImageObject'>
            <link itemprop='url' href='url_image'>
            </span>";
            ?>
    <!-- INICIO HEADER -->
  <header id="header" class="">
    <div class="container ">
     <nav class="navbar navbar-expand-lg fixed-top menu ">
      <div class="container" >
        <a class="navbar-brand" href="http://musicien.es/#!/publicacion/<?php echo $idpub; ?>/publicacion">
            <img src="img/logo_p.png" class="m-0 p-0" height="30"> <span class="ml-1" >MUSICIEN</span>
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
<div class="page-contents">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
            <div class="post-content">
            <div class="row p-2">
              <div class="col-12">
                <img alt="user" class="profile-photo-md pull-left" src="<?php echo "$contenidoMMUsuario";?>">
                <div class="row">
                  <div class="col-9">

                      <a class="profile-link "><?php echo "$nombreUsuario"; ?></a>
                      <small class="d-block" style="margin-top:-10px; ">subio un  <?php echo "$nombreTipo"; ?>  <?php $t = strtotime($object['Creacion']);
echo date('d/m/y H:i:s',$t);?></small>
                       <h3  class="profile-link text-justify " style="font-size: 18px; "><a href="http://musicien.es/#!/publicacion/<?php echo $idpub; ?>/publicacion"><?php echo $object['Titulo'] ?></a></h3>
                   </div>
                  <div class="col-3 text-right">
                     <p style="color:#6d6e71; font-size: 12px"> <i class="ion-compose "></i> <?php echo "$nombreTipo"; ?> </p>
                  </div>
                </div>
              </div>
            </div>
            <div>

            <div class="post-container">
              <?php
                $countPropiedades = count($propiedades);
                $indice = 0;
                while ($indice < $countPropiedades) {
                  $propiedad = $propiedades[$indice];
                  switch ($propiedad['TipoValor']) {
                    case 'I':
                    $valor = $api_url."DescargarImagen?fileName=".$propiedad['Valor'];
                      ?>
                      <div class="row">
                     <!--  IMAGEN -->
                        <div class="col-12 ">

                           <img class="img-fluid d-block mx-auto" src="<?php echo $valor;?>">
                        </div>
                      <!-- /IMAGEN -->

                      <!-- SONIDO -->
                      </div>

                      <?php
                      break;
                      case 'S':
                        $valor = $api_url."ObtenerSonido?filename=".$propiedad['Valor'];
                        ?>
                        <div class="row">
                        <!-- SONIDO -->
                        <audio controls="" loop="" src="<?php echo $valor;?>">
                        <p>Tu navegador no implementa el elemento audio</p>
                      </audio>
                      <!-- /SONIDO -->
                        </div>
                        <?php
                        break;
                        case 'V':
                          $valor = $api_url."VerVideo?filename=".$propiedad['Valor'];
                          ?>
                          <div class="row">
                        <video controlslist="nodownload" class="post-video ng-scope" controls="" style=""> <source  type="video/mp4" src="<?php echo $valor;?>"> </video>
                        <!-- /VIDEO -->

                          </div>
                          <?php
                          break;
                          case 'T':
                            ?>
                            <div class="post-text">
                            <!-- COMENTARIO -->
                               <p class="coment-post"><strong><?php echo $propiedad['Valor']; ?></strong></p>
                            <!-- /COMENTARIO -->
                             </div>
                            <?php
                            break;
                            case 'R':
                            $valor = $propiedad['Valor'];
                            //echo $valor;
                              $url = substr($valor,5);
                              $fuente = substr($valor,0,2);
                              if ($fuente == "SP") {
                                ?>
                                <iframe src="https://open.spotify.com/embed?uri=spotify:album:<?php echo $url; ?>" width="100%" height="300" scrolling="no" allowtransparency="true" frameborder="no"></iframe>
                                <?php
                              } else {
                                ?>

                                <iframe src="<?php echo $url; ?>" width="100%" height="166" scrolling="no" frameborder="no"></iframe>
                                <?php
                              }


                              break;
                              case 'M':
                                ?>
                                <div class="post-text">
                                <!-- COMENTARIO -->
                                   <p class="coment-post"><strong><?php echo $propiedad['Valor']; ?>€</strong></p>
                                <!-- /COMENTARIO -->
                                 </div>
                                <?php
                                break;
                                case 'Y':
                                case 'D':
                                  ?>
                                  <div class="post-text">
                                  <!-- COMENTARIO -->
                                    <p class="coment-post"><strong><?php $t = strtotime($propiedad['Valor']);
                                     echo date('d/m/y H:i:s',$t);?></strong></p>
                                  <!-- /COMENTARIO -->
                                   </div>
                                  <?php
                                  break;

                    default:
                      # code...
                      break;
                  }
                  $indice++;
                }
              ?>


            </div>
  <div class="row">
        <div class="col-12">
        <div class="line-divider"></div>
  <div class="reaction">
    
    <div class="row ">
             <div class="col-12 p-4">

              <!--<div class="mb-2" ng-hide="usuario.Login!==true">
                <div class="row ">
                  <div class="col-12 col-sm-12 col-md-12 col-lg-10 col-xl-10">
                    <input class="form-control form-control-sm ng-pristine ng-valid ng-empty ng-touched" type="text" name="" value="" ng-model="newComentario.Descripcion" placeholder="deja un comentario" style="">
                  </div>
                  <div class="col-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 ">
                    <input type="submit" name="" value="Enviar" class=" form-control form-control-sm pull-right" ng-click="enviarComentario()">
                  </div>
                </div>
              </div>-->



             </div>
             <div class="col-12 m-3">

             <div class="fb-share-button" data-href="<?php echo "http://musicien.es/sharer.php?Pb=$idpub"; ?>" data-layout="button_count" data-size="small" data-mobile-iframe="true"><a class="fb-xfbml-parse-ignore" target="_blank" href="<?php echo "http://musicien.es/sharer.php?Pb=$idpub"; ?>">Compartir</a></div>
                 <span id="twitterbuttonnoticia" class=""><iframe id="twitter-widget-1" scrolling="no" frameborder="0" allowtransparency="true" class="twitter-share-button twitter-share-button-rendered twitter-tweet-button" title="Twitter Tweet Button" src="https://platform.twitter.com/widgets/tweet_button.83d5793f6ebbe2046330abda6016ae93.en.html#dnt=false&amp;id=twitter-widget-1&amp;lang=en&amp;original_referer=http%3A%2F%2Flocalhost%2Fmusicien%2F%23!%2Fpublicacion%2F225%2Fla_musica_es___&amp;size=m&amp;text=La%20M%C3%BAsica%20es...&amp;time=1517327803225&amp;type=share&amp;url=http%3A%2F%2Fmusicien.es%2Fsharer.php%3FPb%3D225" style="position: static; visibility: visible; width: 60px; height: 20px;" data-url="<?php echo "http://musicien.es/sharer.php?Pb=$idpub"; ?>"></iframe></span>
                <span id="botonwhatsapp" ></span>



              </div>

             </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</div>
</div>






    <!-- Footer
    ================================================= -->



    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.3/js/tether.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>

    <script src="js/jquery.scrollbar.min.js"></script>
    <script src="js/script.js"></script>


    <script type="text/javascript" src="js/dx.all.js">

    </script>
    <link rel="stylesheet" href="css/dx.common.css">
    <link rel="stylesheet" href="css/dx.contrast.css">
    <link rel="stylesheet" href="css/dx.light.css">





  <script src="js/scrollPosStyler.js"></script>
  <script src="js/swiper.min.js"></script>
  <script src="js/isotope.min.js"></script>
  <script src="js/nivo-lightbox.min.js"></script>
  <script src="js/wow.min.js"></script>
  <script src="js/core.js"></script>


  </body>
</html>
