# Fullstack evaluation template

## How to use
The files included in this repository are here to get you started by giving
you an idea on how you might start the project.

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

## Information
There are 2 ways to make an API call with this framework.
    1. When an element with an ID of "submit" is clicked.
    2. By adding onload="app.call()" to the body element.
        /reusability-examples/trivia.php.

## api/[endpoint].php

- Implements controllers/APIController.php.<br/>
  - Abstract CURL methods such as ->start(), ->execute(), ->end(). <br/>
  - Uniform API response formatting. <br/>
 <br/>
 
## app.js

- UI controller. <br/>
- Handles API calls and generates the UI based on the response. <br/>
- API calls can be made through the click of a UI element with a "submit" ID. <br/>
- Perform an API call when the page loads by adding **onload="app.call()"** to the ```<body>``` tag. <br/>
-  - See /reusability-examples/trivia.php. <br/>
- Relies on source.js for API-specifics. <br/>

**Documentation**
```javascript
const app {

  // Get the source and endpoint set in the UI.
  // The source should match an object in ***source.js***.
  // The endpoint should be defined in the source object in ***source.js***.
  source: $('#app').data('source'),
  endpoint: $('#app').data('endpoint'),
  
  // Subfunctions can be used to validate the value of a parameter in the source object in ***source.js***.
  // Particularly helpful when making an API call based on something the user typed.
  checkSourceParam: {
    // Returns true or false depending how the param value gets evaluated. 
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
            source[app.source].path[app.endpoint].endpoint,
            
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
        })
    },

    // Creates a key-value object from the source params as defined in source.js.
    sourceParameters: function(){
        let output = {};
        
        // Get the source parameters object.
        let sourceParams = source[app.source].path[app.endpoint].param;
        
        // Iterate over the source's parameters and create an object...
        // that will be passed to the endpoint.
        for(const property in sourceParams){
            let name = sourceParams[property].name;
            output[name] = sourceParams[property].value;
        }

        return output;
    }

}
```

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
        emptyResults: function(){},
        
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
        output: function(response){
        
            // Make the following logic easier to read by assigning the app source path object to a variable.
            let appSourcePath = source[app.source].path[app.endpoint];
            
            // Iterate over the response object for this source as defined in source.js.
            for(const property in appSource.response){
            
                // Update the value of a source response property with the...
                // corresponding endpoint response object.
                appSource.response[property].value = response[property];

                // Confirm that the value of the source response property is valid.
                if (appSource.response[property].isInvalid()) {
                    display.render.error('...error message...');
                } else {

                    // Builds the UI for the endpoint response object.
                    let interface = appSourcePath.response[property].build();
                
                    // Add to the UI and make it visible to the user.
                    // An element in the UI must have an ID that matches the name of this property.
                    // <div id="example" class="display"></div> will show what's in the...
                    // "example" object in the endpoint response. 
                    $('#' + property).append(interface).removeClass('d-none');
                }

            }
        }
    },
    
    // Performs bulk updates to the UI based on what the user is doing.
    state: {
        loading: function(){
            display.render.loading(display.submitButton);
            display.render.emptyResults();
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
        
        // Converts a number like 1000 to 1,000.
        numberWithCommas: function(number){}
    }
}
```

## source.js

- Defines the API sources, their endpoints and parameters, and response object formatting. <br/>

**Documentation**
```javascript
// This should match whatever is set in <div id="app" data-source"...">.
RESTCountries: {
  path: {
    
    // This should match whatever is set in <div id="app" data-path="...">.
    default: {
      endpoint: '/api/rest-countries.php',
      
      // Compiled by app.js and passed to the endpoint as a query string.
      param: {
      
        // Every source must have a default param.
        default: {
          name: 'search',
          value: '',
          
          // Optional function for letting users dynamically set the value of this parameter.
          setValue: function(){
            this.value = $('#search').val();
          }
        },
        
        // Optional parameter
        // Will get passed to the endpoint as fields=name;population;region;subregion.
        fields: {
          name: 'fields',
          'value': 'name;population;region;subregion'
        }
      },
      
      // Response objects are mapped to keys in the endpoint's response.
      response: {
      
        // This should match a key provided by the api/[endpoint].php response.
        result: {
        
          // The default value should be null.
          // app.js updates this from app.call(), which if $get is done calls display.render.output(response).
          // display.render.output(response) iterates over the source's response objects and updates each...
          // one that is found in the endpoint's response.
          value: null,
          
          // Iterate over this.value and return an output.
          // display.render.ouput() in app.js calls this function.
          // The output is appended to the UI element with the same ID...
          // as the name of the parent object. <div id="result"></div>
          build: function(){
            let output = '';
            for(const element of this.value){
                if(Object.keys(element).length > 0){
                  output += '<h1>Example</h1>' + JSON.stringify(element);
                }
             }
             return output;
           },
          
          // Evaluate this.value and return true/false.
          // This is called by display.render.output() in app.js.
          // We check the value of this response property before calling build() above.
          isInvalid: function() {},
        }
      }
    }
  }
}
```

## UI
- Must have an **app** ID element that defines the which **source.js** source and path we use.

```html
<div id="app" data-source="RESTCountries" data-path="default"></div>
```

- Must have an element with an ID that matches whatever data object you want to display. This is case-sensitive and must match an object in the **api/[endpoint].php** response as well as a response object in **source.js**.

```html
<div id="result" class="display"></div>
```

**source.js**

- **RESTCountries**.path.**default**.response.**result**

```javascript
RESTCountries: {
  path: {
    default: {
      endpoint: '',
      response {
        result {
          value: null,
          build: function(){}
          // other functions...
        }
      }
    }
  }
}
```

**api/[endpoint].php**
```php
  $output = array(
      'result' => array(
          'one' => 1,
          'two' => 2
      )
  );
  echo json_encode($output);
```
			