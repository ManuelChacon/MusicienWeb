<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title></title>
	<link rel="stylesheet" href="">




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

    <!-- <script src="http://platform.twitter.com/widgets.js"></script> -->
    <!--Google Font-->
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,700i" rel="stylesheet">
    <!--Favicon-->
    <link rel="shortcut icon" type="image/png" href="images/fav.png"/>


    <script src="http://code.jquery.com/jquery-latest.js"></script>

    <script src="http://82.223.27.144/dsSignalRChat/Scripts/jquery.signalR-2.2.2.js"></script>

  </head>
<body>
	<?php
	$params =  $_GET["Ds_MerchantParameters"];
  //var_dump($_POST);
	//echo "holi 2";
	include "tpv/apiRedsys.php";
	$miObj = new RedsysAPI;
	$decodec = $miObj->decodeMerchantParameters($params);
	//echo "holi 4";
	$jsondecode = json_decode($decodec, true);
  //var_dump($jsondecode);
	$order = $jsondecode['Ds_Order'];
	$date = $jsondecode['Ds_Date'];
	$hour = $jsondecode['Ds_Hour'];
	$card = $jsondecode['Ds_Merchant_Identifier'];
	$authorization = $jsondecode['Ds_AuthorisationCode'];
	$expirydate = $jsondecode['Ds_ExpiryDate'];
	//var_dump($jsondecode);
	$str = ltrim($order, '0');
	//var_dump($expirydate);
	$post = [
    'order' => $str,
    'date' => $date,
    'hour'   => $hour,
		'card' => $card,
		'authorization' => $authorization,
		'expirydate' => $expirydate,
	];
	//var_dump($post);
	//$ch = curl_init('http://localhost:56299/ComprasPagar');
	$ch = curl_init('http://82.223.27.144/dsWASMusic/ComprasPagar');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
	$result = curl_exec($ch);
	curl_close($ch);

	$object = json_decode($result, true);

	$planes = $object['Planes'];
	$promos = $object['Promociones'];
	$numplanes = count($planes);
	$planactual = 0;
	while ($planactual < $numplanes) {
		$plan = $planes[$planactual];
		$nombreplan = $plan['NombrePlan'];
		?>

		<?php
		$planactual++;
	}
	$numpromo = count($promos);
	$promoactual = 0;
	while ($promoactual < $numpromo) {
		$promo = $promos[$promoactual];
		$nombrepromo = $promo['NombrePromocion'];
		?>

		<?php
		$promoactual++;
	}
	?>



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
    </div>
  </header>
<!-- FIN HEADER -->

  <div id="page-contents">
        <div class="container-fluid">
                <div class="row ">
                <div  class="col post-content ">
                <div class="row pt-5 text-center">
                    <div class="col-2"></div>
                    <div class="col-8"><h3> El PAGO SE HA REALIZADO CORRECTAMENTE</h3></div>
                    <div class="col-2"></div>
                    <div class="col-12">
                         <p>Has contratado lo siguiente:</p>
                    </div>
                    <div class="col-12">
                         <center><h1 style=""><?php  echo $nombreplan; ?></h1></center>
                          <center><h1 style=""><?php echo $nombrepromo; ?> </h1></center>
                    </div>

                <div class="col-12 mt-5">
                	 <img src="img/logo_p.png" class="m-0 p-0 d-block mx-auto" height="30"> <span class="ml-1">IR A <a href="http://www.musicien.es/#!/home"> MUSICIEN</a> </span>

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
