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
            header('Content-Type: ' . $this->contentType);
        }

        public function setIsValidRequest(){
            $this->isValidRequest = $_SERVER['REQUEST_METHOD'] === $this->requestMethod;
        }

        public function findKeyValue($array, $key){
            return isset($array[$key]) ? sanitize($array[$key]) : '';
        }

    }

    class APICall extends APIController {
        public $apiCall;
        private $endpoint;

        public function setEndpoint($endpoint){
            $this->endpoint = $endpoint;
        }

        /*
        public function setEndpointParams($params){

        }
        */

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