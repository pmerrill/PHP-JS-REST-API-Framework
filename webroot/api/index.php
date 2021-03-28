<?php
    require_once '../app/bootstrap.php';
    require_once '../app/helpers/api_helper.php';
    
    $apiController = new APIController;

    $apiController->setRequestMethod('GET');
    $apiController->setContentType('application/json');
    $apiController->setHeaders();

    $apiController->setIsValidRequest();
    if(!$apiController->isValidRequest) {
        exitWithError('Request method is invalid.');
    }
    
    $searchInput = $apiController->findKeyValue($_GET, 'search');

    $apiCall = new APICall;
    $apiCall->setEndpoint('https://restcountries.eu/rest/v2/name/' . $searchInput);
    //$apiCall->setEndpointParams($searchInput);
    $apiCall->start();
    $apiCall->setOptions();
    $results = $apiCall->execute();

    echo $results;

    $apiCall->end();
    exit();