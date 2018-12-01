<?php


//set_time_limit(5);

if(isset($_FILES['file']))
{
    $errors=array();
    $allowed_ext= array('jpg','jpeg','png','gif');
    $file_name =$_FILES['file']['name'];
    $file_name =$_FILES['file']['tmp_name'];
    $tmp = explode('.',$file_name);
    $file_ext = strtolower(end($tmp)	);
    $file_size=$_FILES['file']['size'];
    $file_tmp= $_FILES['file']['tmp_name'];
    $type = pathinfo($file_tmp, PATHINFO_EXTENSION);
    $data = file_get_contents($file_tmp);
    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
    //echo "<img style='display:block;' id='base64image' src='".$base64."'/>";
    $img = str_replace(' ', '+', str_replace('data:image/tmp;base64,', '', $base64));
    $data = $img;
    $realdata = array('image' => $data);
    //echo $img;
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
    ECHO $result;

}
?>
