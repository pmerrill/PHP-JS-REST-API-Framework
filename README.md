This lightweight REST API framework makes it easy to build a website using almost any REST API. :rocket:

- [Overview](#overview)
  - [source.js](#overview-source)
  - [controller.js](#overview-controller)
  - [APIController.php](#overview-APIController)
  - [/api](#overview-api-directory) directory
- [Getting Started](#getting-started)
- [Using This Framework](#using-this-framework)
  - [Example](#using-this-framework-example)
- [Extending](#extending)
  - [Adding a new data source](#extending-add-new-source)
  - [Adding an internal data source](#extending-add-internal-source)

## Overview

<a name="overview-source"></a>
**/frontend/[source.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/source.js)**: Define API sources, their endpoints and parameters, and generate HTML for the UI.

```javascript
const source = {

  SOURCE_NAME : {
    path: {
      
      ENDPOINT_NAME: {
        
        endpoint: '_ENDPOINT_URL_',
        
        // The parameters that we want to pass along with each API call.
        parameters: {
        
          // The name and value of each parameter is used in an object
          // that gets passed along with each API call.
          PARAM_NAME: {
            name: '_PARAM_NAME_',
            value: '_PARAM_VALUE_'
          }
        
        },
        
        // This is where you define which items in the API's response you want to use.
        response: {
          
          // Add an object named after an item in the API's response.
          RESPONSE_NAME: {
            
            // Updated to be whatever is in the "RESPONSE_NAME" item in the API's response.
            // This happens after the API call finishes.
            value: null,
            
            isValid: function(){},

            // Returns HTML to the UI.
            // Build the HTML using the contents of the "RESPONSE_NAME" item in the API's response.
            generateHTML: function(){}
          }

        }

      }

    }
  }

}
```

<br/>

<a name="overview-controller"></a>
**/frontend/[controller.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/controller.js)**: Makes API calls and manipulates the UI. Draws from **[source.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/source.js)** to provide details about an API endpoint and how to handle the endpoint's response.

```javascript
$('document').ready(function(){

  // Handles API calls triggered by an enter key, or a submit button click.
  $('#search').keyup(function(event){});
  $('#submit').on('click', function (){});

});

const api = {

  // Get the API source and endpoint set in the UI.
  source: $('body').data('source'),
  path: $('body').data('path'),

  // Perform the API call.
  // Handle any errors/build the UI.
  call: function(){},

  // Access the parameters we defined for this source.
  // Generate a parameters object that we can pass with the API call.
  getSourceParameters: function(){}

}

const ui = {

  // This gets set to whatever element triggered the API call.
  // Storing it here lets us change it to a loading spinner, etc.
  submitButton: null,

  // Performs bulk changes to the UI (loading, error, done loading, etc.)
  state: {},

  // Access the response objects we defined for this source.
  // Build the UI based on what the API response contains and the HTML that we wrote for this source.
  build: function(apiResponse){}

}
```

<br/>

<a name="overview-APIController"></a>
**/backend/controllers/[APIController.php](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/backend/controllers/APIController.php)**: Contains methods for validating and performing API calls as well as formatting and returning the API's response.

```php
// Contains methods for validating the API call.
class APIController {}

// Contains methods for compiling the API endpoint we're about to use.
class APIEndpoint extends APIController {}

// Contains helpful cURL encapsulation methods.
// These methods make cURL more readable and give us the option to use a cURL alternative in the future.
class APICall extends APIEndpoint {}

// Contains methods for handling the API's response.
// This is where we can perform actions such as sorting.
class APIResponse extends APICall {}
```

<br/>

<a name="overview-api-directory"></a>
**/backend/[api/](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/backend/api) directory**: This directory is where you can find the API endpoints that are referenced in **[source.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/source.js)**. The response from these endpoints should be mapped to a **[source.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/source.js)** response object.

```php
require_once '../bootstrap.php';
require_once '../helpers/api_helper.php';

// Specify this endpoint's headers.
$headers = array();
setHeaders($headers);

$apiController = new APIController;

$apiController->defineRequestMethod('GET');

$apiController->validateRequest();
if(!$apiController->isValidRequest){
    exitWithError(400, '_ERROR_MESSAGE_');
}

$apiEndpoint = new APIEndpoint;

$apiEndpoint->setHost( '_API_HOST_' );
$apiEndpoint->setPath( '_API_HOST_PATH_' );

$parameters = [];
$queryString = buildQueryString($parameters);
$apiEndpoint->setQueryString($queryString);

// Piece together the endpoint parts.
$apiEndpoint->build();

$apiCall = new APICall;

$apiCall->start();

// Specify cURL options.
$options = array();
$apiCall->setOptions($options);

$result = $apiCall->execute();

// Validate the results.
$apiCall->errorCheck();
if($apiCall->hasError){
    $apiCall->end();
    exitWithError(404, '_ERROR_MESSAGE_');
}

$apiResponse = new APIResponse;

// Apply universal formatting.
$result = decodeResult($result);
$result = formatResult($result);

$apiResponse->setResult($result);

// Optional sorting by key.
$apiResponse->setSortKey('population');
$apiResponse->sort('desc');

// The key names you choose here must be defined in the frontend source response object.
// Otherwise, they will be ignored when the UI is built.
$output = outputTemplate();
$output['result'] = $apiResponse->result;
$output['info'] = [
    'countries' => count($apiResponse->result),
    'regions' => countColumn($apiResponse->result, 'region'),
    'subregions' => countColumn($apiResponse->result, 'subregion')
];

echo json_encode($output);

// Free resources when we're done.
$apiCall->end();
exit();
```

<br/>

## Getting Started

To start the server open a terminal window on unix/linux based systems and change
directory to the project root. Then execute this command:

```
  ./server
```

The command assumes you have a PHP binary in your system path. If you don't you
will get an error and the server will not start.

After starting the server go to:

```
http://localhost:8765/index.html  
```

<br/>

**Note**: There are 3 ways to make an API call with this framework.

  1. When an element with an ID of "submit" is clicked.
  2. When the the "search" input receives a specific keyup event.
  3. By adding **```onload="api.call()"```** to the body tag of your page.<br/>
  	- [/trivia.html](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/trivia.html).<br/>
  	- [Example](#extending-add-new-source)

<br/>

## Using This Framework

There are a few things that need to be remembered when using this framework.

**1**. Every page's ```body``` tag must define which **[source.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/source.js)** source and path we're going to use. The example below will tell **[controller.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/controller.js)** to interact with the *default* path in the *RESTCountries* object in **[source.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/source.js)**. 

```html
<body data-source="RESTCountries" data-path="default">
```

<br/>

**2**. Every page must have an HTML element that is named after the API endpoint response item you want to display to the user.

  - **You must add an HTML element to the UI that has a specific structure.**
    - ```id="app-"``` is required. What you put after ```-``` must be the name of a property in the source path's response object. 
    - ```class="display"``` is required. The ```ui``` constant in **[controller.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/controller.js)** looks for the ```display``` class to identify dynamically generated content.
  - Dynamically generated content is appended to the HTML element with the same ID as the property that's being generated.

```html
<div id="api-result" class="display d-none"></div>
```

<br/>

**3**. The ```generateHTML``` function in **[source.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/source.js)** gets called by **[controller.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/controller.js)** and the HTML that's returned is appended to the element.

<br/>

<a name="using-this-framework-example"></a>
**Example**

API endpoint
```php
$output = array(
    'result' => 'Hi'
);
echo json_encode($output);
```

<br/>

controller.js
```javascript
build: function(apiResponse){
  let property = 'result';

  // Access the source response object.
  let sourcePathResponse = source[api.source].path[api.path].response;

  // Store the API's response in the appropriate source response object.
  sourcePathResponse[property].value = apiResponse[property];

  // Build the UI by calling generateHTML().
  $('#api-' + property).append( sourcePathResponse[property].generateHTML() );
  $('#api-' + property).removeClass('d-none');

}
```

<br/>

source.js
```javascript
response: {
  
  // Named after "result" in the API endpoint's response.
  result: {
    value: null,
    generateHTML(){
      return '<h1>' + this.value + '</h1>; 
    }
  }

}
```

<br/>

index.html
```html
<body data-source="RESTCountries" data-path="default">
  
  <div id="api-result" class="display">
    <h1>Hi</h1>
  </div>
  
</body>
```

<br/>

## Extending

Adding new data sources only takes a couple of minutes. See the example below!

<a name="extending-add-new-source"></a>
**Add New Data Source**

Add a new top-level property to **[source.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/source.js)**. You can paste the following template right above the last ```}``` bracket in the ```source``` constant.

```javascript
CatFacts: {
  path: {
    default: {
      endpoint: '/backend/api/cat.php',
      response: {
        result: {
          value: null,
          isValid: function() {
            let isValid = !helper.isNull(this.value);
            return isValid;
          },
          generateHTML: function(){
            let output = '';
            for(const object of this.value){
              if(helper.hasKeys(object)){
                output +=  '<p>' + object['text'] + '</p>';
              }
            }
            return output;
          }
        }
      }
    }
  }
}
```

<br/>

Create a new file in the **/backend[/api](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/backend/api)** directory and name it **cat.php**.

<br/>

You can paste this example:

```php
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
    $apiEndpoint->setHost( 'https://cat-fact.herokuapp.com' );
    $apiEndpoint->setPath( '/facts' );
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
```

<br/>

Create a new file in the **[webroot](https://github.com/pmerrill/PHP-JS-REST-API-Framework/tree/master/webroot)** directory. Let's call it **cat.html**.

Paste this template:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body data-source="CatFacts" data-path="default" onload="api.call()" class="bg-theme">

    <div class="container col-12 col-md-8 px-5 mx-auto mb-5">
      <div id="messages" class="col-12 d-none"></div>
      <div id="api-result" class="display col-12 mt-3 d-none"></div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="/frontend/controller.js"></script>
    <script src="/frontend/source.js"></script>
  </body>
</html>
```

<br/>

*Notice ```<body onload="api.call()">```? That tells **[controller.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/controller.js)** to make the call to the ```endpoint``` we defined in the ```default path``` of the ```CatFacts``` object in **[source.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/source.js)**.*

Now go to [localhost:8765/cat.html](http://localhost:8765/cat.html) to see some random cat facts. :smile_cat:

<br/>

<a name="extending-add-internal-source"></a>
**Add an Internal Data Source**

This framework could be easily extended to make calls to endpoints that return data from your own database.

This is a little speculative, but I would do this by creating a new class in the **[APIController](#overview-APIController)** that extends ```APIController``` and handles communication with our database.

This class would probably look something like this:

```php
class DatabaseQuery extends APIController {
  // Properties...

  public function connect(){}

  // Database communication methods.
  // I would likely use PDO to prepare my statements.
  public function select($query, $params){}
  public function insert($query, $params){}

}
```

<br/>

Then in the endpoint you use to retrieve internal data you could do something like this:

```php
$database = new DatabaseQuery;

$query = 'SELECT * FROM user WHERE name = :name';
$params = array(
  'name' => 'Peter',
);
$result = $database->select($query, $params);

echo json_encode($result);
exit();
```

<br/>

Once you have an output you could add this API similarly to how you'd add any other API.

Define it in **[source.js](https://github.com/pmerrill/PHP-JS-REST-API-Framework/blob/master/webroot/frontend/source.js)** and create a page that will render your data.