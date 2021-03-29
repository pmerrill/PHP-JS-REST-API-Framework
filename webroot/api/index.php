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

    // Configure the call
    $options = array(
        CURLOPT_URL => $apiCall->endpoint,
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_FAILONERROR => TRUE
    );
    $apiCall->setOptions($options);

    $result = $apiCall->execute();
    
    // TODO: Handle API call errors

    if(empty($result)){
        $apiCall->end();
        exitWithError(404, 'The endpoint didn\'t return anything.');
    }

    $apiCall->setResult($result);

    // Required if sorting the results
    $apiCall->setSortByKey('population');

    // Will only sort if sortByKey was
    // set and exists in the response.
    $apiCall->sortKeyValueDesc();

    $restCountries = new RESTCountries($apiCall->result);
    $restCountries->setResponseCode();
    $restCountries->setResponseMessage();
    
    // The REST Countries API will respond
    // with an error message if there was a problem.
    $restCountries->validateResponse();
    if(!$restCountries->isValidResponse) {
        $apiCall->end();
        exitWithError($restCountries->responseCode, $restCountries->responseMessage);
    }

    echo json_encode($apiCall->result);

    $apiCall->end();
    exit();