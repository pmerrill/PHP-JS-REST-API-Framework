<?php
    require_once '../bootstrap.php';
    require_once '../helpers/api_helper.php';
    
    $headers = array(
        'Cache-Control: no-store, no-cache, must-revalidate, max-age=0',
        'Content-Type: application/json'
    );
    setHeaders($headers);

    $apiController = new APIController;

    // Define then validate the request method.
    $apiController->defineRequestMethod('GET');
    $apiController->validateRequest();
    if(!$apiController->isValidRequest){
        exitWithError(400, 'There was a problem processing your search.');
    }

    $apiCall = new APICall;
    $apiCall->setEndpointHost( 'https://restcountries.eu' );

    // The search input is part of the endpoint path.
    // It isn't used in the query string.
    $country = findKeyValue($_GET, 'search');

    // Switch paths based on country length.
    $isAlphaCodeSearch = strlen($country) <= 3;
    $pathPart = $isAlphaCodeSearch ? 'alpha' : 'name';

    $apiCall->setEndpointPath( '/rest/v2/' . $pathPart . '/' . $country );

    // Optional parameters
    $parameters = [
        'fields' => findKeyValue($_GET, 'fields')
    ];
    $queryString = buildQueryString($parameters);
    $apiCall->setEndpointQueryString($queryString);

    // Piece together the endpoint parts.
    $apiCall->compileEndpoint();

    $apiCall->start();

    // Specify options.
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

    $apiCall->errorCheck();
    if($apiCall->hasError){
        $apiCall->end();
        exitWithError(404, 'We couldn\'t find anything for you.');
    }

    // Optional sorting.
    $apiCall->setSortKey('population');
    $apiCall->sort('desc');

    // The key names you choose here must be defined in source.js.
    // If they aren't then the values will be ignored by app.js when it tries to build the UI.
    $output = outputTemplate();
    $output['result'] = $apiCall->result;
    $output['info'] = [
        'countries' => count($apiCall->result),
        'regions' => countColumn($apiCall->result, 'region'),
        'subregions' => countColumn($apiCall->result, 'subregion')
    ];
    echo json_encode($output);

    // Free resources when we're done.
    $apiCall->end();
    exit();