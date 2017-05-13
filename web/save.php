<?php

if ($_POST['image']) {
    //$data = 'data:image/png;base64,AAAFBfj42Pj4';

    list($type, $data) = explode(';', $_POST['image']);
    list(, $data) = explode(',', $data);
    $data = base64_decode($data);

    // fix for IE catching or PHP bug issue
    header('Pragma: public');
    header('Expires: 0'); // set expiration time
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    // browser must download file from server instead of cache

    // force download dialog
    header('Content-Type: application/force-download');
    header('Content-Type: image/png');
    header('Content-Type: application/download');

    // use the Content-Disposition header to supply a recommended filename and
    // force the browser to display the save dialog.
    header('Content-Disposition: attachment; filename=Image.png;');
    header('Content-Transfer-Encoding: binary');
    header('Content-Length: ' . strlen($data));

    echo $data;
}
