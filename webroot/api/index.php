<?php
    require_once '../app/bootstrap.php';
    
    $apiCall = new APIController;
    $apiCall->setContentType('application/json');

    header('Content-Type: ' . $apiCall->contentType);

    if(!$apiCall->isDesiredRequestMethod('GET')) {
        echo 'wrong.';
        exit();
    }

    $search = $apiCall->getArrayKeyValue($_GET, 'search');
    //echo $search;

    $curlHandle = curl_init();
    curl_setopt($curlHandle, CURLOPT_URL, 'https://restcountries.eu/rest/v2/all');
    curl_setopt($curlHandle, CURLOPT_RETURNTRANSFER, 1);

    $output = curl_exec($curlHandle);
    
    if(curl_error($curlHandle)) {
        echo 'ERROR!';
    } else {
        echo $output;
    }
    
    curl_close($curlHandle);

    exit();