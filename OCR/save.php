<?php

//server-side code where we save the given drawing in a PNG file
$dir = 'incorrectGuesses';

 // create new directory with 744 permissions if it does not exist yet
 // owner will be the user/group the PHP script is run under
if ( !file_exists($dir) ) {
    $oldmask = umask(0);  // helpful when used in linux server  
    mkdir ($dir, 0744);
}
$img = filter_input(INPUT_POST, 'image', FILTER_SANITIZE_URL);
$name = substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(10/strlen($x)) )),1,10);
$img = str_replace(' ', '+', str_replace('data:image/png;base64,', '', $img));
$data = base64_decode($img);
$realdata = array('image' => $data);

//create the image png file with the given name
file_put_contents(__DIR__.'/'.$dir.'/'.str_replace(' ', '_', $name) .'.png', $data);

ECHO  'Done'

?>

