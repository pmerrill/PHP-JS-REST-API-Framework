<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Random Trivia</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.2/css/all.css" integrity="sha384-vSIIfh2YWi9wW0r9iZe7RJPrKwp6bG+s9QZMoITbCckVJqGCCRhc+ccxNcdpHuYu" crossorigin="anonymous">
    <link rel="stylesheet/less" type="text/css" href="../main.css">
    <script src="//cdn.jsdelivr.net/npm/less@3.13" ></script>
  </head>
  <body class="bg-theme" onload="app.call()">

    <?php require_once('../includes/navigation.html'); ?>

    <div class="container col-12 col-md-8 px-5 mx-auto mb-5">
        <h2 class="fw-bold mb-3"><i class="fas fa-dice-d20"></i> Open Trivia Database</h2>
        <div class="row bg-white box-shadow rounded p-4">
          
          <!-- Map to an API source in source.js by entering a source and endpoint data attribute. -->
          <div id="app" data-source="OpenTrivia" data-path="default" class="col-12"></div>

          <!-- Display API response and error handling messages. -->
          <div id="messages" class="col-12 d-none"></div>

          <!-- The ID of each element must be defined in source.js and the endpoint. -->
          <div id="app-result" class="display col-12 mt-3 d-none"></div>
          
          <div id="details" class="col-12 mt-4">
            <h5 class="fw-bold">Random Trivia</h5>
            <p>This example uses the <a href="https://opentdb.com/api_config.php" target="_blank">Open Trivia Database API</a> and retrieves 3 random trivia questions. The endpoint accepts a total <code>amount</code> parameter, which is set in the <code>source.js</code> definition. Refresh the page to get a new set of random trivia questions.</p>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">This page defines which source we are going to use through data attributes. <code>&lt;div id="app" data-source="OpenTrivia" data-path="default"&gt;</code>.
              <li class="list-group-item"><code>onload="app.call()"</code> was added to the body tag of this page. This tells <code>/app.js</code> to immediately make a call to the source endpoint when the page loads.</li>
              <li class="list-group-item"><code>/source.js</code> defines the <code>OpenTrivia</code> object, which includes the endpoint, any parameters we want to use, and a <code>build</code> function that tells <code>/app.js</code> how to render the UI.</li>
              <li class="list-group-item"><code>/app.js</code> uses what's defined in <code>source.js</code> and makes a call to <code>/api/bonus-work/trivia.php</code>.</li>
              <li class="list-group-item"><code>/api/bonus-work/trivia.php</code> retrieves and formats the data.</li>
              <li class="list-group-item"><code>/app.js</code> will then iterate over the endpoint's response and <i>build</i> the UI by rendering the output of the <code>build</code> function in the <code>source.js OpenTrivia default path</code> response object.</li>
              <li class="list-group-item">Read the documentation on <a href="https://github.com/pmerrill/infosec" target="_blank">GitHub</a>.</li>
            </ul>
          </div>

        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossorigin="anonymous"></script>
    <script src="../app.js"></script>
    <script src="../source.js"></script>
  </body>
</html>