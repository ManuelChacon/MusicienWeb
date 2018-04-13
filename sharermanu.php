<!DOCTYPE html>
<html>
    <head>
        <title><?php echo 'Musicien'; ?></title>
        <?php

                  $idpub = $_GET['Pb'];
                  $USER_AGENT = $_SERVER['HTTP_USER_AGENT'];
                  $uri = "http://82.223.49.59/dsWASMusic/PublicacionesLeerPorID?IDPublicacion=$idpub&IDUsuarioLector=";
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
                  $contenidoMM = $object['ContenidoMM'];
                  $contenidoMMAlt = $object['ContenidoMMAlt'];


                  echo "<meta property='og:url' content='http://musicien.es/sharer.php?Pb=$idpub' />";
                  echo "<meta property='og:title' content='$titulo' />";
                  echo "<meta property='og:description' content='Musicien: Bringing Music Back To Live' />";
                  echo "<meta property='og:site_name' content='Musicien: Bringing Music Back To Live' />";
                  echo "<meta name='twitter:card' content='summary_large_image' />";
                  echo "<meta name='twitter:site' content='http://musicien.es' />";
                  echo "<meta name='twitter:title' content='$titulo' />";
                  echo "<meta name='twitter:description' content='Musicien: Bringing Music Back To Live' />";

                  echo "<meta property='twitter:image' itemprop='image' content='http://82.223.49.59/dsWASMusic/DownloadFile?fileName=$contenidoMM&Tipo=I'>";
                  echo "<meta property='og:image' itemprop='image' content='http://82.223.49.59/dsWASMusic/DownloadFile?fileName=$contenidoMM&Tipo=I'>";
                  echo "<link itemprop='thumbnailUrl' href='http://82.223.49.59/dsWASMusic/DownloadFile?fileName=$contenidoMM&Tipo=I'>";
                  /*echo "<meta property='og:description' content='$USER_AGENT' />";
                  echo "<meta property='og:site_name' content='$USER_AGENT' />";*/
                  /*if ($tipoCMM == 'I' || $tipoCMM = 'N') {
                    echo "<meta property='twitter:image' itemprop='image' content='http://82.223.49.59/dsWASMusic/DownloadFile?fileName=$contenidoMM&Tipo=$tipoCMM'>";
                    echo "<meta property='og:image' itemprop='image' content='http://82.223.49.59/dsWASMusic/DownloadFile?fileName=$contenidoMM&Tipo=$tipoCMM'>";
                    echo "<link itemprop='thumbnailUrl' href='http://82.223.49.59/dsWASMusic/DownloadFile?fileName=$contenidoMM&Tipo=$tipoCMM'>";
                  } else if ($tipoCMM == 'V' || $tipoCMM == 'S') {
                    echo "<meta property='twitter:image' itemprop='image' content='http://82.223.49.59/dsWASMusic/DownloadFile?fileName=$contenidoMMAlt&Tipo=I'>";
                    echo "<meta property='og:image' itemprop='image' content='http://82.223.49.59/dsWASMusic/DownloadFile?fileName=$contenidoMMAlt&Tipo=I'>";
                    echo "<link itemprop='thumbnailUrl' href='http://82.223.49.59/dsWASMusic/DownloadFile?fileName=$contenidoMMAlt&Tipo=I'>";
                  }*/
                  echo "<meta property='og:locale' content='es_ES' />";
                  echo "<meta property='og:image:type' content='image/jpeg'>";

                  /*if (strpos($USER_AGENT,"HeadlessChrome") || strpos($user_AGENT, "WhatsApp") || strpos($user_AGENT, "Twitterbot")) {
                  } else {
                    echo '<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
                    <script type="text/javascript">
                    miAppAngular = angular.module("navegacion", [] );
                   miAppAngular.controller("appAPIFacebook", function($scope, $http, $location, $window) {
                     $window.location.href = "http://musicien.es/#!/publicacion/" + $location.absUrl().split("?Pb=")[1] + "/publicacion";

                   });
                    </script>';
                  }*/

         ?>

     </head>
            <body ng-app="navegacion" ng-controller="appAPIFacebook">

<?php
  echo "<link itemprop='thumbnailUrl' href='url_image'>
        <span itemprop='thumbnail' itemscope itemtype='http://schema.org/ImageObject'>
        <link itemprop='url' href='url_image'>
        </span>";
        echo "$USER_AGENT";
        var_dump($contenidoMM);
        var_dump($object);
        echo "Hola";
        ?>
            </body>
</html>
