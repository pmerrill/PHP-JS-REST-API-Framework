<?php
    require_once '../app/bootstrap.php';
    require_once '../app/helpers/api_helper.php';
    
    $headers = array(
        'Cache-Control: no-store, no-cache, must-revalidate, max-age=0',
        'Content-Type: application/json'
    );
    setHeaders($headers);

    $apiController = new APIController;
    $apiController->setRequestMethod('GET');

    $apiController->validateRequest();
    if(!$apiController->isValidRequest){
        exitWithError(400, 'There was a problem processing your search.');
    }

    $apiCall = new APICall;
    $apiCall->setEndpointHost( 'https://restcountries.eu' );

    // Determine the endpoint path.
    $country = findKeyValue($_GET, 'search');
    $endpointPath = strlen($country) <= 3 ? '/rest/v2/alpha/' : '/rest/v2/name/';
    $apiCall->setEndpointPath( $endpointPath . $country );

    // Translate parameters into a usable query string.
    $paramsArray = ['fields' => 'alpha2Code;alpha3Code;flag;languages;name;population;region;subregion'];
    $queryString = buildQueryString($paramsArray);
    $apiCall->setEndpointQueryString($queryString);

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
    $result = json_decode($result, true);
    $apiCall->setResult($result);

    // Perform error checks before continuing.
    $apiCall->setHasError();
    if($apiCall->hasError){
        $apiCall->end();
        exitWithError(404, 'We couldn\'t find anything for you.');
    }

    // Set a sort key before sorting the results.
    $apiCall->setSortKey('population');
    $apiCall->sort('desc');

    $output = outputTemplate();
    $output['result'] = $apiCall->result;
    echo json_encode($output);

    $apiCall->end();
    exit();