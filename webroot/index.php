<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Countries Search</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.2/css/all.css" integrity="sha384-vSIIfh2YWi9wW0r9iZe7RJPrKwp6bG+s9QZMoITbCckVJqGCCRhc+ccxNcdpHuYu" crossorigin="anonymous">
    <link rel="stylesheet/less" type="text/css" href="main.css">
    <script src="//cdn.jsdelivr.net/npm/less@3.13" ></script>
  </head>
  <body class="bg-theme">

    <?php require_once('includes/navigation.html'); ?>

    <div class="container col-12 col-md-8 px-5 mx-auto mb-5">
        <h2 class="fw-bold mb-3"><i class="fas fa-atlas"></i> Countries Search</h2>
        <div class="row bg-white box-shadow rounded p-4">
          
          <!-- Map to an API source in source.js by entering a source and endpoint data attribute. -->
          <div id="app" data-source="RESTCountries" data-endpoint="default" class="col-12">
            <div class="input-group box-shadow">
              <input id="search" type="text" class="form-control p-3 fs-6" placeholder="Search by name, full name, or country code" autofocus>
              <button id="submit" class="btn text-white p-3"><i class="fas fa-search fs-6"></i></button>
            </div>
          </div>

          <!-- Display API response and error handling messages. -->
          <div id="messages" class="col-12 d-none"></div>

          <!-- Display API results. -->
          <div id="result" class="display col-12 mt-3 d-none"></div>

          <!-- Display any extra info included in the API response. -->
          <div id="info" class="col-12 mt-3 d-none"></div>
          
          <div id="details" class="col-12 mt-4">
            <h5 class="fw-bold">Info</h5>
            <p>This example uses the <a href="https://restcountries.eu/" target="_blank">REST Countries API</a>.</p>

            <h5 class="fw-bold">source.js</h5>
            <p><code>RESTCountries</code> was added to the <code>source</code> object in source.js. This is where the endpoint and parameters are defined as well as how the output is compiled and rendered.</p>
            <p>The #api element's endpoint data attribute defines which RESTCountries path we use. This example defines the path as <code>default</code>, which means that we'll use what's defined in the <code>source/RESTCountries/path/default</code> object in source.js.</p>
            <p>The <code>default</code> path sets the endpoint to <code>/api/rest-countries.php</code>, creates the parameter(s), sets up the <code>resultsFactory</code>, and sets up the <code>infoFactory</code>.</p>
            <p>When we render the results of the API call we use the <code>resultsFactory</code>. This lets us set a template for how the data gets compiled and rendered.</p>
            <p>The display that shows the number of countries, a list of regions, and a list of subregions is generated by the <code>infoFactory</code>.</p>

            <h5 class="fw-bold">/api/rest-countries.php</h5>
            <p>This is the endpoint the <code>default</code> RESTCountries path sets in source.js. It performs a curl request through a series of object-oriented abstractions.</p>
            <p><code>/api/rest-countries.php</code> uses the <code>APIController</code> class and its subclasses to make curl requests, process the results, and output them in a universal format.</p>
            <p>The <code>APIController</code> class exists in <code>controllers/APIController.php</code> and has handy <code>$apiCall</code> methods such as <code>->start()</code>, <code>->setOptions()</code>, <code>->execute()</code>, <code>->end()</code>, <code>->errorCheck()</code>, and more.</p>
        </div>

        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossorigin="anonymous"></script>
    <script src="app.js"></script>
    <script src="source.js"></script>
  </body>
</html>
