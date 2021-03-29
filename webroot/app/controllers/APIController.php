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
        public $hasError;
        public $result;
        protected $sortKey;
        
        public function setEndpointBase($base){
            $this->endpointBase = $base;
        }

        public function setEndpointPath($path){
            $this->endpointPath = $path;
        }

        public function setEndpointParams($paramsArray){
            $this->endpointParams = $paramsArray;
        }

        public function compileEndpoint(){
            $this->endpoint = $this->endpointBase . $this->endpointPath . '?' . http_build_query($this->endpointParams);
        }

        public function start(){
            $this->apiCall = curl_init();
        }

        public function setOptions($optionsArray){
            curl_setopt_array($this->apiCall, $optionsArray);
        }

        public function execute(){
            return curl_exec($this->apiCall);
        }

        public function setResult($resultObject){
            $this->result = json_decode($resultObject, true);
        }

        public function setHasError(){
            $this->hasError = $this->hasErrorCode() || $this->hasEmptyResult();
        }

        protected function hasErrorCode(){
            return curl_errno($this->apiCall) > 0;
        }

        protected function hasEmptyResult(){
            return empty($this->result);
        }

        public function setSortKey($key){
            $this->sortKey = $key;
        }

        public function sortDesc(){
            usort($this->result, function($a, $b){
                return isset($b[$this->sortKey]) ? $b[$this->sortKey] <=> $a[$this->sortKey] : false;
            });
        }

        public function end(){
            curl_close($this->apiCall);
        }

    }

    class RestCountries extends APICall {
        public $result;
        public $isValidResponse;
        public $responseCode;
        public $responseMessage;

        public function __construct($result){
            $this->result = $result;
        }

        public function setResponseCode(){
            $this->responseCode = isset($this->result['status']) ? $this->result['status'] : 200;
        }

        public function setResponseMessage(){
            $this->responseMessage = isset($this->result['message']) ? $this->result['message'] : '';
        }

        public function validateResponse(){
            $this->isValidResponse = $this->responseCode === 200;
        }

    }