<?php

$url = $_POST['url'];
$postcode = $_POST['postcode'];
$area_code = $_POST['area_code'];
$business_type = $_POST['business_type'];
$local_area = $_POST['local_area'];
$existing_markets = $_POST['existing_markets'];

$data = array();

if ($postcode != '') {
  $data['postcode'] = $postcode;
} else if ($area_code != '') {
  $data['area_code'] = $area_code;
}

if ($postcode != '' || $area_code != '') {
  $data['business_type'] = $business_type;
  $data['local_area'] = $local_area;
  $data['existing_markets'] = $existing_markets;

  $data = json_encode($data);

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Content-Length: ' . strlen($data)));
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  $api_request = curl_exec($ch);
  curl_close($ch);
  
  print $api_request;
} else {
  print '{"error":{"message":"Select region or enter postcode"}}';
}

?>