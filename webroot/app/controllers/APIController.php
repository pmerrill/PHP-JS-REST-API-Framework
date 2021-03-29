<?php
    class APIController {
        protected $contentType;
        protected $requestMethod;
        public $isValidRequest;

        public function setRequestMethod($method){
            $this->requestMethod = $method;
        }

        public function setContentType($type){
            $this->contentType = $type;
        }

        public function setHeaders(){
            header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
            header('Content-Type: ' . $this->contentType);
        }

        public function validateRequest(){
            $this->isValidRequest = $_SERVER['REQUEST_METHOD'] === $this->requestMethod;
        }

    }

    class APICall extends APIController {
        private $endpointBase;
        private $endpointPath;
        private $endpointParams;
        private $endpointParameterString;
        public $endpoint;
        public $apiCall;
        
        public function setEndpointBase($base){
            $this->endpointBase = $base;
        }

        public function setEndpointPath($path){
            $this->endpointPath = $path;
        }

        public function setEndpointParams($params){
            $this->endpointParams = $params;
        }

        public function setCompiledEndpoint(){
            $this->endpoint = $this->endpointBase . $this->endpointPath . '?' . http_build_query($this->endpointParams);
        }

        public function start(){
            $this->apiCall = curl_init();
        }

        public function setOptions(){
            $options = array(
                CURLOPT_URL => $this->endpoint,
                CURLOPT_RETURNTRANSFER => TRUE
            );
            curl_setopt_array($this->apiCall, $options);
        }

        public function execute(){
            return curl_exec($this->apiCall);
        }

        public function end(){
            curl_close($this->apiCall);
        }
    }

    class RESTCountries extends APICall {
        public $results;
        public $isValidResponse;
        public $responseCode;
        public $responseMessage;

        public function __construct($results){
            $this->results = json_decode($results, true);
        }

        public function setResponseCode(){
            $this->responseCode = isset($this->results['status']) ? $this->results['status'] : 200;
        }

        public function setResponseMessage(){
            $this->responseMessage = isset($this->results['message']) ? $this->results['message'] : 'No problems were found.';
        }

        public function validateResponse(){
            $this->isValidResponse = $this->responseCode === 200;
        }

        public function sortPopulationDesc(){
            usort($this->results, function($a, $b){
                return $b['population'] <=> $a['population'];
            });
        }
    }