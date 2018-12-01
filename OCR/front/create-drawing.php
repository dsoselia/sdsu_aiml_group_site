<?php
set_time_limit(5);
//server-side code where we save the given drawing in a PNG file
$dir = 'images';

 // create new directory with 744 permissions if it does not exist yet
 // owner will be the user/group the PHP script is run under
 if ( !file_exists($dir) ) {
     $oldmask = umask(0);  // helpful when used in linux server  
     mkdir ($dir, 0744);
 }
for ($i = 1; $i <= 33; $i++) {


}
$chars = array("ა"=>"1", "ბ"=>"2", "გ"=>"3", "დ"=>"4", "ე"=>"5", "ვ"=>"6", "ზ"=>"7", "თ"=>"8", "ი"=>"9","კ"=>"10", "ლ"=>"11", "მ"=>"12", "ნ"=>"13", "ო"=>"14", "პ"=>"15", "ჟ"=>"16", "რ"=>"17", "ს"=>"18", "ტ"=>"19", "უ"=>"20", "ფ"=>"21","ქ"=>"22", "ღ"=>"23", "ყ"=>"24", "შ"=>"25", "ჩ"=>"26", "ც"=>"27","ძ"=>"28",  "წ"=>"29", "ჭ"=>"30", "ხ"=>"31", "ჯ"=>"32", "ჰ"=>"33");

#$answer = $_POST['character'];
#$answer = $chars[$answer];
$img = filter_input(INPUT_POST, 'image', FILTER_SANITIZE_URL);
$name = substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(10/strlen($x)) )),1,10);
$img = str_replace(' ', '+', str_replace('data:image/png;base64,', '', $img));
$data = $img;
$name  = "test1";
$realdata = array('image' => $data);

//create the image png file with the given name
//file_put_contents(__DIR__.'/images/'. str_replace(' ', '_', $name) .'.png', $data);

$url = 'http://188.169.148.191:88/getresults';

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

