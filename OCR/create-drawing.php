<?php
set_time_limit(5);
$img = filter_input(INPUT_POST, 'image', FILTER_SANITIZE_URL);
$img = str_replace(' ', '+', str_replace('data:image/png;base64,', '', $img));
$data = $img;
$realdata = array('image' => $data);


$url = 'http://ec2-18-188-206-62.us-east-2.compute.amazonaws.com:5000/getresults';

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($realdata)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { 
	$result = "The server is temporarily down, please try again later";
}

ECHO $result

?>

