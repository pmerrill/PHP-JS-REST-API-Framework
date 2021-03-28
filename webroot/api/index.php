<?php
    require_once '../app/bootstrap.php';
    
    $apiController = new APIController('GET', 'application/json');
    $apiController->setHeaders();
    $apiController->stopIfInvalidRequest();
    
    $searchInput = $apiController->getValue($_GET, 'search');

    $apiController->startCall();

    $callOptions = array(
        CURLOPT_URL => 'https://restcountries.eu/rest/v2/all',
        CURLOPT_RETURNTRANSFER => TRUE
    );
    $apiController->setCallOptions($callOptions);
    
    $results = $apiController->executeCall();
    echo $results;

    $apiController->endCall();
    exit();