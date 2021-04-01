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
        exitWithError(400, 'There was a problem processing your search.');
    }

    $apiCall = new APICall;
    $apiCall->setEndpointHost( 'https://restcountries.eu' );

    // Process form input.
    $country = findKeyValue($_GET, 'search');

    $isAlphaCodeSearch = strlen($country) <= 3;
    $pathPart = $isAlphaCodeSearch ? 'alpha' : 'name';
    $apiCall->setEndpointPath( '/rest/v2/' . $pathPart . '/' . $country );

    // Optional parameters
    $parameters = [
        'fields' => findKeyValue($_GET, 'fields')
    ];
    $queryString = buildQueryString($parameters);
    $apiCall->setEndpointQueryString($queryString);

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

    $output = outputTemplate();
    $output['result'] = $apiCall->result;
    $output['info'] = [
        'items' => count($apiCall->result),
        'regions' => countColumn($apiCall->result, 'region'),
        'subregions' => countColumn($apiCall->result, 'subregion')
    ];
    echo json_encode($output);

    $apiCall->end();
    exit();