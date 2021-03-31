<?php
    require_once '../app/bootstrap.php';
    require_once '../app/helpers/api_helper.php';
    
    $headers = array(
        'Cache-Control: no-store, no-cache, must-revalidate, max-age=0',
        'Content-Type: application/json'
    );
    setHeaders($headers);

    $apiController = new APIController;

    // Category must match app.js object literal property.
    $apiController->setCategory('MetaWeather');
    
    $apiController->defineRequestMethod('GET');
    $apiController->validateRequest();
    if(!$apiController->isValidRequest){
        exitWithError(400, 'There was a problem processing your request.');
    }

    $apiCall = new APICall;

    $apiCall->setEndpointHost( 'https://www.metaweather.com' );
    $apiCall->setEndpointPath( '/api/location/44418/' );
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
    $result = formatResult($result);
    $apiCall->setResult($result);

    // Important error checking.
    $apiCall->errorCheck();
    if($apiCall->hasError){
        $apiCall->end();
        exitWithError(404, 'We couldn\'t find anything for you.');
    }

    $output = outputTemplate();
    $output['result'] = $apiCall->result;
    $output['info'] = [ 'category' => $apiController->category ];
    echo json_encode($output);

    $apiCall->end();
    exit();