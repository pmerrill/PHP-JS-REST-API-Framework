<?php
    require_once '../app/bootstrap.php';
    require_once '../app/helpers/api_helper.php';
    
    $apiController = new APIController;

    $apiController->setRequestMethod('GET');
    $apiController->setContentType('application/json');
    $apiController->setHeaders();

    $apiController->validateRequest();
    if(!$apiController->isValidRequest){
        exitWithError(400, 'There was a problem processing your search.');
    }

    $searchInput = findKeyValue($_GET, 'search');
    
    // Important endpoint switcher.
    $endpointPath = strlen($searchInput) <= 3 ? '/alpha/' : '/name/';

    $apiCall = new APICall;
    $apiCall->setEndpointBase( 'https://restcountries.eu/rest/v2' );
    $apiCall->setEndpointPath( $endpointPath . $searchInput );
    $apiCall->setEndpointParams( ['fields' => 'alpha2Code;alpha3Code;flag;languages;name;population;region;subregion'] );
    $apiCall->compileEndpoint();

    $apiCall->start();

    // Specify API call requirements.
    $options = array(
        CURLOPT_URL => $apiCall->endpoint,
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_FAILONERROR => TRUE
    );
    $apiCall->setOptions($options);

    $result = $apiCall->execute();
    $apiCall->setResult($result);

    $apiCall->setHasError();
    if($apiCall->hasError){
        $apiCall->end();
        exitWithError(404, 'We couldn\'t find anything for you.');
    }

    // Set a sort key before sorting the results.
    $apiCall->setSortKey('population');

    // Sort the results if sort key was set and exists.
    $apiCall->sortDesc();

    $restCountries = new RestCountries($apiCall->result);
    $restCountries->setResponseCode();
    $restCountries->setResponseMessage();
    
    $restCountries->validateResponse();
    if(!$restCountries->isValidResponse){
        $apiCall->end();
        exitWithError($restCountries->responseCode, $restCountries->responseMessage);
    }

    $output = array(
        'result' => $restCountries->result,
        'total' => [],
        'status' => array(
            'code' => $restCountries->responseCode,
            'message' => $restCountries->responseMessage
        )
    );
    echo json_encode($output);

    $apiCall->end();
    exit();