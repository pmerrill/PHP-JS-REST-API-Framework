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

    $apiEndpoint = new APIEndpoint;

    $apiEndpoint->setHost( 'https://www.metaweather.com' );

    $locationID = findKeyValue($_GET, 'locationID');
    $apiEndpoint->setPath( '/api/location/' . $locationID . '/' );

    // Piece together the endpoint parts.
    $apiEndpoint->build();

    $apiCall = new APICall;

    $apiCall->start();

    // Specify options.
    $options = array(
        CURLOPT_URL => $apiEndpoint->endpoint,
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_FAILONERROR => TRUE
    );
    $apiCall->setOptions($options);

    $result = $apiCall->execute();

    // Validate the results.
    $apiCall->errorCheck();
    if($apiCall->hasError){
        $apiCall->end();
        exitWithError(404, 'We couldn\'t find anything for you.');
    }

    $apiResponse = new APIResponse;

    // Apply universal formatting.
    $result = decodeResult($result);
    $result = formatResult($result);

    $apiResponse->setResult($result);

    // The key names you choose here must be defined in the frontend source response object.
    // Otherwise, they will be ignored when the UI is built.
    $output = outputTemplate();
    $output['result'] = $apiResponse->result;

    echo json_encode($output);

    // Free resources when we're done.
    $apiCall->end();
    exit();