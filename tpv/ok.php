<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title></title>
	<link rel="stylesheet" href="">
</head>
<body>
	<?php
	$params =  $_GET["Ds_MerchantParameters"];
	//echo "holi 2";
	include "apiRedsys.php";
	$miObj = new RedsysAPI;
	$decodec = $miObj->decodeMerchantParameters($params);
	//echo "holi 4";
	$jsondecode = json_decode($decodec, true);
	$order = $jsondecode['Ds_Order'];
	$date = $jsondecode['Ds_Date'];
	$hour = $jsondecode['Ds_Hour'];
	$card = $jsondecode['Ds_Card_Number'];
	$authorization = $jsondecode['Ds_AuthorisationCode'];
	$str = ltrim($order, '0');
	$post = [
    'order' => $str,
    'date' => $date,
    'hour'   => $hour,
		'card' => $card,
		'authorization' => $authorization,
	];
	//$uri = "http://localhost:56299/ComprasPagar";
	//$ch = curl_init();
	$ch = curl_init('http://82.223.27.144/dsWASMusic/ComprasPagar');
	//curl_setopt($ch, CURLOPT_URL, $uri);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
	$result = curl_exec($ch);
	curl_close($ch);
	//$result = file_get_contents($uri);
		// Will dump a beauty json :3
	$object = json_decode($result, true);
	//echo "holi 5";
	$planes = $object['Planes'];
	$promos = $object['Promociones'];
	$numplanes = count($planes);
	$planactual = 0;
	while ($planactual < $numplanes) {
		$plan = $planes[$planactual];
		$nombreplan = $plan['NombrePlan'];
		var_dump($plan);
		?>
			divEsto se repite tantas veces como planes haya. Puedes meter
			html aqui sin problemas

			<?php echo $nombreplan; ?> holi que tal
		<?php
		$planactual++;
	}
	$numpromo = count($promos);
	$promoactual = 0;
	while ($promoactual < $numpromo) {
		$promo = $promos[$promoactual];
		$nombrepromo = $promo['NombrePromocion'];
		?>
			Esto se repite tantas veces como promos haya. Puedes meter html aqui sin problemas <?php echo $nombrepromo; ?> holi que tal
		<?php
		$promoactual++;
	}
	?>
</body>
</html>
