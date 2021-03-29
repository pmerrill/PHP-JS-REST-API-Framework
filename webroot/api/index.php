<?php
    require_once '../app/bootstrap.php';
    require_once '../app/helpers/api_helper.php';
    
    $apiController = new APIController;

    $apiController->setRequestMethod('GET');
    $apiController->setContentType('application/json');
    $apiController->setHeaders();

    $apiController->validateRequest();
    if(!$apiController->isValidRequest) {
        exitWithError(400, 'Request method is invalid.');
    }

    $apiCall = new APICall;
    $apiCall->setEndpointBase('https://restcountries.eu/rest/v2');
    $apiCall->setEndpointPath('/name/' . findKeyValue($_GET, 'search'));
    $apiCall->setEndpointParams( ['fields' => 'alpha2Code;alpha3Code;flag;languages;name;population;region;subregion'] );
    $apiCall->setCompiledEndpoint();
    $apiCall->start();
    $apiCall->setOptions();

    $results = $apiCall->execute();

    $restCountries = new RESTCountries($results);
    $restCountries->setResponseCode();
    $restCountries->setResponseMessage();
    $restCountries->validateResponse();
    if(!$restCountries->isValidResponse) {
        exitWithError($restCountries->responseCode, $restCountries->responseMessage);
    }

    // Handle rest countries error (check for status and message)
    $restCountries->sortPopulationDesc();
    
    echo json_encode($restCountries->results);

    $apiCall->end();
    exit();