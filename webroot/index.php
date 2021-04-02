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
          <div id="app" data-source="RESTCountries" data-path="default" class="col-12">
            <div class="input-group box-shadow">
              <input id="search" type="text" class="form-control p-3 fs-6" placeholder="Search by name, full name, or country code" autofocus>
              <button id="submit" class="btn text-white p-3"><i class="fas fa-search fs-6"></i></button>
            </div>
          </div>

          <div id="messages" class="col-12 d-none"></div>

          <!-- The ID of each element must be defined in source.js and the endpoint. -->
          <div id="app-result" class="display col-12 mt-3 d-none"></div>
          <div id="app-info" class="display col-12 mt-3 d-none"></div>

        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossorigin="anonymous"></script>
    <script src="app.js"></script>
    <script src="source.js"></script>
  </body>
</html>
