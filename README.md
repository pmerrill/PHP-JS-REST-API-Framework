Thank you so much for taking the time to look at my code! :smiley:

I thoroughly enjoyed this challenge and spent a lot of time thinking about how to write my code in a way that would let it be easily extended and reused without coupling the client and server. The solution I came up with lets me easily integrate new data sources in only a couple of minutes.

Continue reading to learn more!

- [Overview](#overview)
	- [1. Scripts](#scripts)
		- [source.js](#scripts-source)
		- [app.js](#scripts-app)
		- [APIController.php](#scripts-APIController)
		- [/api folder](#scripts-api-folder)
	- [2. Terminology](#terminology)
		- ["source"](#terminology-source)
		- ["source path"](#terminology-source-path)
		- ["param"](#terminology-param)
		- ["response object"](#terminology-response-object)
	- [3. Getting Started](#getting-started)
	- [4. Documentation](#documentation)
		- [APIController](#documentation-APIController)
		- [API Endpoints](#documentation-api-endpoint)
		- [app.js](#documentation-app-js)
			- [ready](#documentation-app-js-ready)
			- [app](#documentation-app-js-app)
			- [display](#documentation-app-js-display)
		- [source.js](#documentation-source-js)
		- [UI - Data flow](#documentation-ui)
	- [5. Extending](#extending)
		- [Adding a new data source](#extending-add-new-source)
    - [Adding an internal data source](#extending-add-internal-source)

<a name="overview"></a>
## Scripts

<a name="scripts-source"></a>
**/[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**:

Contains all API "source" definitions. This includes endpoints, parameters, factories for generating UI components, and an occasional helper function.

- [Documentation](#documentation-source-js)

<br/>

<a name="scripts-app"></a>
**/[app.js](https://github.com/pmerrill/infosec/blob/master/webroot/app.js)**

Controls the UI, makes calls to source endpoints, passes data from the endpoint through **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)** and out to the UI.

- [Documentation](#documentation-app-js)

<br/>

<a name="scripts-APIController"></a>
**/[controllers/APIController.php](https://github.com/pmerrill/infosec/blob/master/webroot/controllers/APIController.php)**

Contains cURL abstractions and data processing methods.

- [Documentation](#documentation-APIController)

<br/>

<a name="scripts-api-folder"></a>
**/[api/...](https://github.com/pmerrill/infosec/tree/master/webroot/api)**

Scripts in this folder are the endpoints defined in **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**. The objects these endpoints output should be mapped to a **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)** response object. More about this below.

- [Documentation](#documentation-api-endpoint)

<br/>

## Terminology
You may see me make repeated references to a "source" or a "source path". 

Here's what that means:


<a name="terminology-source"></a>
**source** = Top-level object in **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**. In the example below **RESTCountries** would be the source.

```javascript
const source = {
	RESTCountries: {
	}
}
```

<br/>

<a name="terminology-source-path"></a>
**source path** = The path we need to take to the endpoint-specific details. This again refers to **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**. In the example below **default** would be the source path.

```javascript
const source = {
	RESTCountries: {
		path: {
			default: {
			}
		}
	}
}
```

<br/>

<a name="terminology-param"></a>
So when I say a *source path param* I mean something in the **param** object:

```javascript
const source = {
	RESTCountries: {
		path: {
			default: {
				param: {
				}
			}
		}
	}
}
```

<br/>

<a name="terminology-response-object"></a>
A **response object** could be **result** or **info** in the example below. These must match whatever you want to use from the endpoint response.

```javascript
const source = {
	RESTCountries: {
		path: {
			default: {
				response: {
					result: {
					},
					info: {
					}
				}
			}
		}
	}
}
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
http://localhost:8765/index.php  
```

<br/>

**Note**:
<br/>

There are 2 ways to make an API call with this framework.

  1. When an element with an ID of "submit" is clicked.
  2. By adding **```onload="app.call()"```** to the body element.<br/>
  	- [/reusability-examples/trivia.php](https://github.com/pmerrill/infosec/blob/master/webroot/reusability-examples/trivia.php).<br/>
  	- [Example](#extending-add-new-source)

<br/>

## Documentation

<a name="documentation-APIController"></a>
**[controllers/APIController.php](https://github.com/pmerrill/infosec/blob/master/webroot/controllers/APIController.php)**

- APIController: Mostly contains helpers for validating API calls.
- APICall: Does the dirty work. Performs/processes API calls.

```php
class APIController {
	private $requestMethod;
	public $isValidRequest;

	// Set by the API endpoint.
	// This lets us define what type of request we want to allow.
	// Helps prevent POSTing to GET endpoints.
	public function defineRequestMethod($requestMethod){}
	
	// Set the isValidRequest property based on request validation outcome.
	public function validateRequest(){}

	// Checks the server request method against what the endpoint defined.
	private function isValidRequestMethod(){}
}
```

<br/>

```php
class APICall extends APIController {
	private $endpointHost;
	private $endpointPath;
	private $endpointQueryString;
	public $endpoint;
	private $apiCall;
	public $hasError;
	public $result;
	private $sortKey;

	// Host endpoints are defined in each /api script.
	// Ex: https://restcountries.eu
	public function setEndpointHost($host){}

	// Ex: /rest/v2/alpha/USA
	public function setEndpointPath($path){}

	// source.js defines each endpoint's parameters.
	// These parameters are formatted into a key-value object in app.js and passed to the /api endpoint.
	// The /api endpoint takes the parameters and converts it into a string.
	// Ex: ?fields=name;population;region
	public function setEndpointQueryString($queryString){}

	// Constructs the endpoint we're going to hit.
	// Returns a string based on what the /api endpoint has set for the host, path, and parameters.
	// Ex: https://restcountries.eu/rest/v2/alpha/USA?fields=name;population;region
	public function compileEndpoint(){}

	// Assigns curl_init to apiCall.
	// This makes cURL accessible by this class and the /api endpoint script.
	// I encapsulated curl_init this way to give us the option to use a different method in the future.
	public function start(){}

	// Sets cURL options as defined in the /api endpoint
	// Ex: array( CURLOPT_URL = $this->endpoint );
	public function setOptions($optionsArray){}

	// Returns the results of curl_exec.
	// Data flows from this method to the /api endpoint.
	public function execute(){}

	// Performs basic error checking service.
	public function errorCheck(){}

	// Returns true if curl_errno > 0
	public function hasErrorCode(){}

	// Assign the API call response to the result property.
	// I'd rather do this than pass by reference to the sort methods below.
	public function setResult($result){}

	// Define the key that we want to use if we sort the results.
	// Nothing will happen if sort() is called and sortKey is not set.
	public function setSortKey($sortKey){}

	// Sort the results in a specific direction.
	// If sortKey is 'population' and $this->results has a 'population' key then we'll do the sort on that.
	public function sort($sortDirection){}

	// Called by sort()
	// Sort results[sortKey] in ascending order.
	private function sortAsc(){}

	// Called by sort()
	// Sort results[sortKey] in descending order.
	private function sortDesc(){}

	// curl_close
	// Close the cURL session.
	public function end(){}

}
```

<br/>
<br/>

<a name="documentation-api-endpoint"></a>
**[api/[endpoint].php](https://github.com/pmerrill/infosec/tree/master/webroot/api)**

- Implements [controllers/APIController.php](https://github.com/pmerrill/infosec/blob/master/webroot/controllers/APIController.php) and uses abstract cURL methods such as ->start(), ->execute(), ->end(). <br/>
- Uniform API response formatting. <br/>
- The output should be mapped to response property objects in **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**.
  - [More info](#ui-js)
 
 ```php
  // Require the autoloader and helper functions
  require_once '../bootstrap.php';
  require_once '../helpers/api_helper.php';
  
  // Set endpoint-specific headers
  $headers = array();
  setHeaders($headers);
  
  // Instantiate the APIController class.
  $apiController = new APIController;
  
  // Define then validate the request method.
  // Helps to prevent POSTing to GET endpoints.
  $apiController->defineRequestMethod('GET');
  $apiController->validateRequest();
  if(!$apiController->isValidRequest){
      exitWithError(400, '...');
  }
  
  // Instantiate the APICall class.
  // This gives us access to cURL abstractions and other handy methods.
  $apiCall = new APICall;
  
  // Set the host URL for the request.
  // Something like https://restcountries.eu should go here.
  $apiCall->setEndpointHost( 'https://...' );
  
  // Specify the path we need to take to the data.
  $apiCall->setEndpointPath( '/rest/v2/alpha/USA' );

  // Optional parameters array
  // Ex: fields = [ 'name;region;population' ]
  $parameters = [
      'fields' => findKeyValue($_GET, 'fields')
  ];
  
  // Convert the array to a query string.
  // The previous example now becomes ?fields=name;region;population
  $queryString = buildQueryString($parameters);
  $apiCall->setEndpointQueryString($queryString);
  
  // Piece together the endpoint we've defined above.
  // I broke URLs into chunks so that I could do logic on certain parts of the endpoint.
  // This gives me the ability to do something like switching the path based on a parameter...
  // that's passed in without making a mess.
  $apiCall->compileEndpoint();
  
  // Start the API call.
  $apiCall->start();

  // Specify cURL options such as CURLOPT_URL, CURLOPT_RETURNTRANSFER, etc.
  $options = array();
  $apiCall->setOptions($options);
  
  // Execute the call and return the results.
  $result = $apiCall->execute();
  
  // This currently converts a JSON response to an array via json_decode.
  // I did this because I don't know what decoding requirements I may have in the future.
  // See /helpers/api_helper.php
  $result = decodeResult($result);
  
  // Format the results to ensure consistency. 
  // See /helpers/api_helper.php
  $result = formatResult($result);
  
  // Pass the result to the APICall class.
  $apiCall->setResult($result);
  
  // Check the results for errors and exit if any are found.
  $apiCall->errorCheck();
  if($apiCall->hasError){
      $apiCall->end();
      exitWithError(404, '...');
  }

  // Optional sorting.
  $apiCall->setSortKey('population');
  $apiCall->sort('desc');
  
  // The key names you choose here must be defined in source.js.
  // If they aren't then the values will be ignored by app.js when it tries to build the UI.
  $output = outputTemplate();
  $output['result'] = $apiCall->result;
  
  // Convert to JSON and output.
  // This is what gets processed by app.js.
  echo json_encode($output);
  
  // Free resources now that we're done.
  $apiCall->end();
  exit();
 ```
 
 <br/>
 <br/>
 
 <a name="documentation-app-js"></a>
**[app.js](https://github.com/pmerrill/infosec/blob/master/webroot/app.js)**

- UI controller. <br/>
- Handles API calls and generates the UI based on what's in the endpoint's response. <br/>
- API calls can be made in 2 ways. <br/>
  - Through the click of a UI element with a **submit** ID. ```<button id="submit">```<br/>
  - When the page loads. Add **```onload="app.call()```"** to the ```<body>``` tag. <br/>
	  - See [/reusability-examples/trivia.php](https://github.com/pmerrill/infosec/blob/master/webroot/reusability-examples/trivia.php). <br/>
	  - ```<body onload="app.call()">```
- Relies on **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)** for API-specific definitions such as the API endpoint, parameters to use, and rules for building the UI. <br/>

<a name="documentation-app-js-ready"></a>
```javascript
$('document').ready(function(){

    // "Click" the submit button on specific keyup event.
    $('#search').keyup(function(event){});

    $('#submit').on('click', function (){
          
        // Store the submit button in the display object.
        // This lets me call it outside of this click listener...
        // and change the button to a spinner icon when needed.
        display.submitButton = $(this);

        // Set the default source path param value as defined in source.js.
        source[app.source].path[app.path].param.default.setValue();

        // Verify that the default value is valid.
        let isValid = app.checkSourceParam.isValid( source[app.source].path[app.path].param.default );
        
        if(!isValid) {
            
            // Add an error message to the UI.
            display.render.error('...error message...');
            return false;
        } else {
        
            // Perform the API call.
            // This makes a request to the source path endpoint...
            // and processes the response.
            app.call();
        }

    });

});
```

<a name="documentation-app-js-app"></a>
```javascript
const app {

  // Get the source and path set in the UI.
  // The source should match an object in source.js.
  // The path should be defined in the source object in source.js.
  source: $('#app').data('source'),
  path: $('#app').data('path'),
  
  // Contains functions for verifying the value of a source path parameter in source.js.
  // Particularly helpful when making an API call based on something the user typed.
  checkSourceParam: {
    isValid: function(param){},
    isValidLength: function(param){},
    isValidNumber: function(param){}
  }
  
  // Makes a call to the API endpoint and handles the response.
  // Add onload="app.call()" to the <body> tag to perform a call when the page is loaded (see /reusability-examples/trivia.php).
  call: function(){
        
        // Updates the UI to the loading state.
        // Adds a loading spinner on certain pages, empties any messages, clears previous results, etc.
        display.state.loading();
        
        // Perform the call to the endpoint.
        $.get( 
            // Get the endpoint for the source path as defined in source.js.
            source[app.source].path[app.path].endpoint,
            
            // Iterates over the source param object in source.js and creates a key-value object.
            this.sourceParameters()
        )
        
        // Handle endpoint failures.
        .fail(function() {
            display.render.error('...error message...');
        })
        
        // Handle a successful endpoint response.
        .done(function(response) {
            display.render.output(response);
        })
        
        // Do some clean up work.
        // Change the state to doneLoading, which will enable parts of the UI.
        .always(function() {
            display.state.doneLoading();
            return false;
        });
    },

    // Creates a key-value object from the source params as defined in source.js.
    sourceParameters: function(){
        let output = {};
        
        // Get the source parameters object.
        let sourceParams = source[app.source].path[app.path].param;
        
        // Iterate over the source's parameters and create an object that will be passed to the endpoint.
        for(const property in sourceParams){
            let name = sourceParams[property].name;
            output[name] = sourceParams[property].value;
        }

        return output;
    }

}
```
<a name="documentation-app-js-display"></a>
```javascript
// This defines what changes can be made to the UI.
const display = {

    // This should be set to the element that the user clicks...
    // if making an API call on click.
    // display.submitButton = $('#submit');
    submitButton: null,
    
    render: {
    
        // Hide endpoint data and add a message to the UI.
        error: function(message){},
        
        // Removes any endpoint data that is visible in the UI.
        emptyDisplay: function(){},
        
        // Removes messages from the UI.
        emptyMessages: function(){},
        
        // Change a UI element to a spinner icon.
        loading: function(element){},
        
        // Changes a UI element to a search icon.
        searchIcon: function(element){},
        
        // Disables editable UI elements.
        // Particularly helpful when a call is being made.
        disabledForm: function(){},
        
        // Enables editable UI elements.
        enabledForm: function(){},

        // This is where the endpoint data is generated and rendered.
        output: function(apiResponse){
        
            // Make the following logic easier to read by assigning the app source path object to a variable.
            let sourcePath = source[app.source].path[app.path];
            
            // Iterate over the response object for this source as defined in source.js.
            for(const property in sourcePath.response){
            
                // Update the value of a source response property with the...
                // corresponding endpoint response object.
                sourcePath.response[property].value = apiResponse[property];

                // Confirm that the value of the source response property is valid.
                if (sourcePath.response[property].isValid()) {
                    display.render.error('...error message...');
                } else {

                    // Builds the UI for the endpoint response object.
                    let output = sourcePath.response[property].build();
                
                    // Add to the UI and make it visible to the user.
                    // An element in the UI must have an ID that matches the name of this property.
                    // <div id="app-example" class="display"></div> will show what's in the...
                    // "example" object in the endpoint response. 
                    $('#app-' + property).append(output).removeClass('d-none');
                }

            }
        }
    },
    
    // Performs bulk updates to the UI.
    state: {
        loading: function(){
            display.render.loading(display.submitButton);
            display.render.emptyDisplay();
            display.render.emptyMessages();
            display.render.disabledForm();
        },
        doneLoading: function(){
            display.render.searchIcon(display.submitButton);
            display.render.enabledForm();
        }
    },
    
    // Standalone functions that could be used anywhere.
    helper: {
        isUndefined: function(value){},
        isNull: function(value){},
        
        // Checks if an index exists in object keys.
        hasIndex: function(object, index){},

        // Check if an object has keys.
        hasKeys: function(object){},
        
        // Converts a number like 1000 to 1,000.
        numberWithCommas: function(number){}
    }
}
```

<br/>
<br/>

<a name="documentation-source-js"></a>
**[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**

- Defines the API sources, their endpoints and parameters, and response object formatting. <br/>

```javascript
// This should match whatever is set in <div id="app" data-source"...">.
RESTCountries: {
  path: {
    
    // This should match whatever is set in <div id="app" data-path="...">.
    default: {
      endpoint: '/api/rest-countries.php',
      
      // The contents of this object are compiled by sourceParameters() in app.js
      // and are passed to the endpoint as a query string.
      param: {
      
        // Mst have a default param if a call to the endpoint is triggered on click.
        // See app.js $('#submit').on('click'... where default value gets assigned (~line 14).
        default: {
          name: 'search',
          value: '',
      
          // Required if users need to dynamically set the value of this parameter.
          // Called in app.js in the on click function.
          setValue: function(){
            this.value = $('#search').val();
          }
        },
        
        fields: {
          name: 'fields',
          value: 'name;population;region;subregion'
        }
      },
      
      // Response objects are mapped to keys in the endpoint's response.
      // Define the data from the endpoint you want the UI to render.
      response: {
        
        // You don't have to define each object in the API's response.
        // app.js will iterate over each object you add here and attempt to render it in the UI.
        // Be sure to include a build function in each object you add.
      
        // This should match a key provided by the api/[endpoint].php response.
        result: {
        
          // This is set by app.js after a call is done.
          // app.js iterates over the endpoint's response and updates all matching source.js response object values.
          value: null,
          
          // app.js uses this to build the UI for this response object.
          // It appends the output to a specific UI element, which is <div id="app-result"></div> in this case.
          build: function(){
            let output = '';
            for(const object of this.value){
                if(display.helper.hasKeys(object)){
                  output += '<h1>Example</h1>' + JSON.stringify(object);
                }
             }
             return output;
           },
          
          // Evaluate this.value and return true/false.
          // This is called by display.render.output() in app.js.
          // We check the value of this response property before calling build() above.
          isValid: function() {},
        }
      }
    }
  }
}
```

<br/>
<br/>

<a name="documentation-ui"></a>
**UI**

- Must have an **app** ID element that defines which **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)** source and path we use.
	- The example below will tell **[app.js](https://github.com/pmerrill/infosec/blob/master/webroot/app.js)** to interact with the *default* path in the *RESTCountries* object in **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**. 

```html
<div id="app" data-source="RESTCountries" data-path="default"></div>
```

- Must have an element with an ID that matches whatever API endpoint data object you want to display.
  - This element must have a **display** class and the ID must start with **app-**.
  - The ID must match an object in the **[api/[endpoint].php](https://github.com/pmerrill/infosec/tree/master/webroot/api)** response.
  - The ID must also match a response object in **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**.

```html
<div id="app-result" class="display"></div>
```

- Those 2 UI elements tell **[app.js](https://github.com/pmerrill/infosec/blob/master/webroot/app.js)** to interact with ```RESTCountries.path.default.response.result``` in **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**.

<a name="ui-js"></a>
```javascript
RESTCountries: {
  path: {
    default: {
      endpoint: '',
      response: {
        result: {
          value: null,
          build: function(){}
        }
      }
    }
  }
}
```

<br/>

- This also means that if the endpoint responds with something like the example below the ```<div id="app-result">``` UI element will be populated with what's in the ```result``` array.
  - That is as long as ```build()``` in **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)** returns an HTML output.

**[api/[endpoint].php](https://github.com/pmerrill/infosec/tree/master/webroot/api)**
```php
$output = array(
    'result' => array(
        'one' => 1,
        'two' => 2
    )
);
echo json_encode($output);
```

## Extending

This framework is modular by nature. Adding new data sources only takes a couple of minutes. See the example below!

<a name="extending-add-new-source"></a>
**Add New Data Source**

Add a new top-level property to **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**. You can paste the following template right above the last ```}``` bracket.

```javascript
CatFacts: {
  path: {
    default: {
      endpoint: '/api/cat.php',
      response: {
        result: {
          value: null,
          build: function(){
            let output = '';
            for(const object of this.value){
              if(display.helper.hasKeys(object)){
                output +=  '<p>' + object['text'] + '</p>';
              }
            }
            return output;
          },
          isValid: function() {
            let isValid = !display.helper.isNull(this.value);
            return isValid;
          }
        }
      }
    }
  }
}
```

<br/>

Create a new file in the **[/api](https://github.com/pmerrill/infosec/tree/master/webroot/api)** directory and name it **cat.php**. Be sure to check the path ```require_once``` is using.<br/>

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

    $apiCall = new APICall;
    $apiCall->setEndpointHost( 'https://cat-fact.herokuapp.com' );
    $apiCall->setEndpointPath( '/facts' );
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
    echo json_encode($output);

    $apiCall->end();
    exit();
```

<br/>

Create a new file in the **[webroot](https://github.com/pmerrill/infosec/tree/master/webroot)** directory. Let's call it **cat.html**.

Paste this template:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body class="bg-theme" onload="app.call()">

    <div class="container col-12 col-md-8 px-5 mx-auto mb-5">
          <div id="app" data-source="CatFacts" data-path="default" class="col-12"></div>
          <div id="messages" class="col-12 d-none"></div>
          <div id="app-result" class="display col-12 mt-3 d-none"></div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="app.js"></script>
    <script src="source.js"></script>
  </body>
</html>
```

<br/>

*Notice ```<body onload="app.call()">```? That tells **[app.js](https://github.com/pmerrill/infosec/blob/master/webroot/app.js)** to make the call to the ```endpoint``` we defined in the ```default path``` of the ```CatFacts``` object in **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)**.*

Now go to [localhost:8765/cat.html](http://localhost:8765/cat.html) to see some random cat facts. :smile_cat:

<br/>

<a name="extending-add-internal-source"></a>
**Add an Internal Data Source**

This framework could be easily extended to make calls to endpoints that return data from your own database.

This is a little speculative, but I would do this by creating a new class in the **[APIController](#documentation-APIController)** that extends ```APIController``` and handles communication with our database.

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

Define it in **[source.js](https://github.com/pmerrill/infosec/blob/master/webroot/source.js)** and create a page that will render your data.