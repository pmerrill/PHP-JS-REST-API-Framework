This modular framework makes it easy to build a website using almost any REST API. :rocket:

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

**Note**:
<br/>

There are 2 ways to make an API call with this framework.

  1. When an element with an ID of "submit" is clicked.
  2. By adding **```onload="app.call()"```** to the body element.<br/>

**Important**:
<br/>
- /controller.js: Performs API calls and renders the response according to rules defind in source.js.
- /source.js: Contains API sources. Defines the endpoint, required parameters, and how the API response is built.
- /backend/api/...: Endpoints that source.js uses should be put here. These endpoints get the data and format it.

## Extending

This framework is modular by nature. Adding new data sources only takes a couple of minutes. See the example below!

<a name="extending-add-new-source"></a>
**Add New Data Source**

Add a new top-level property to **source.js**. You can paste the following template right above the last ```}``` bracket.

```javascript
CatFacts: {
  path: {
    default: {
      endpoint: '/backend/api/cat.php',
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

Create a new file in the **/backend/api** directory and name it **cat.php**. Be sure to check the path ```require_once``` is using.<br/>

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

Create a new file in the **webroot** directory. Let's call it **cat.html**.

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
    <script src="controller.js"></script>
    <script src="source.js"></script>
  </body>
</html>
```

<br/>

*Notice ```<body onload="app.call()">```? That tells **controller.js** to make the call to the ```endpoint``` we defined in the ```default path``` of the ```CatFacts``` object in **source.js**.*

Now go to [localhost:8765/cat.html](http://localhost:8765/cat.html) to see some random cat facts. :smile_cat:

<br/>

<a name="extending-add-internal-source"></a>
**Add an Internal Data Source**

This framework could be easily extended to make calls to endpoints that return data from your own database.

This is a little speculative, but I would do this by creating a new class in the **APIController** that extends ```APIController``` and handles communication with our database.

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

Define it in **source.js** and create a page that will render your data.
