<?php
    require_once '../bootstrap.php';
    require_once '../helpers/api_helper.php';
    
    $headers = array(
        'Cache-Control: no-store, no-cache, must-revalidate, max-age=0',
        'Content-Type: application/json'
    );
    setHeaders($headers);

    $apiController = new APIController;
    
    $apiController->defineRequestMethod('GET');
    $apiController->validateRequest();
    if(!$apiController->isValidRequest){
        exitWithError(400, 'There was a problem processing your request.');
    }

    $apiCall = new APICall;

    $apiCall->setEndpointHost( 'https://opentdb.com' );
    $apiCall->setEndpointPath( '/api.php' );

    // Optional parameters
    $parameters = [
        'amount' => findKeyValue($_GET, 'amount')
    ];
    $queryString = buildQueryString($parameters);
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
    $result = decodeResult($result);
    $result = formatResult($result['results']);
    $apiCall->setResult($result);

    // Important error checking.
    $apiCall->errorCheck();
    if($apiCall->hasError){
        $apiCall->end();
        exitWithError(404, 'We couldn\'t find anything for you.');
    }

    $output = outputTemplate();
    $output['result'] = $apiCall->result;
    echo json_encode($output);

    $apiCall->end();
    exit();
