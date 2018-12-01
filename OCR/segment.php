<?php
$dir = 'data';
if ( !file_exists($dir) ) {
	$oldmask = umask(0);  // helpful when used in linux server  
	mkdir ($dir, 0744);
}
$chars = array("ა"=>"1", "ბ"=>"2", "გ"=>"3", "დ"=>"4", "ე"=>"5", "ვ"=>"6", "ზ"=>"7", "თ"=>"8", "ი"=>"9","კ"=>"10", "ლ"=>"11", "მ"=>"12", "ნ"=>"13", "ო"=>"14", "პ"=>"15", "ჟ"=>"16", "რ"=>"17", "ს"=>"18", "ტ"=>"19", "უ"=>"20", "ფ"=>"21","ქ"=>"22", "ღ"=>"23", "ყ"=>"24", "შ"=>"25", "ჩ"=>"26", "ც"=>"27","ძ"=>"28",  "წ"=>"29", "ჭ"=>"30", "ხ"=>"31", "ჯ"=>"32", "ჰ"=>"33");

for ($i = 1; $i <= 33; $i++) {
	$tmpdir = $chars[i];
	if ( !file_exists($dir.'/'.$tmpdir) ) {
		$oldmask = umask(0);  // helpful when used in linux server  
		mkdir($dir.'/'.$tmpdir, 0744);
	}
}

$img = filter_input(INPUT_POST, 'image', FILTER_SANITIZE_URL);
$name = substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(10/strlen($x)) )),1,10);
$img = str_replace(' ', '+', str_replace('data:image/png;base64,', '', $img));
$data = $img;
$realdata = array('image' => $data,
		  'chars' => $_POST["chars"]);

$url = 'http://ec2-18-188-206-62.us-east-2.compute.amazonaws.com:5000/segm';

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($realdata)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */ }

ECHO $result

?>

