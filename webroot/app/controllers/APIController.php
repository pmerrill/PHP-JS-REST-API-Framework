<?php
    class APIController {
        protected $contentType;
        protected $requestMethod;
        protected $isValidRequest;
        public $apiCall;

        public function __construct($requestMethod, $contentType){
            $this->requestMethod = $requestMethod;
            $this->contentType = $contentType;
        }

        public function setHeaders(){
            header('Content-Type: ' . $this->contentType);
        }

        public function stopIfInvalidRequest(){
            $this->isValidRequest = $_SERVER['REQUEST_METHOD'] === $this->requestMethod;
            return !$this->isValidRequest ? exitWithError('Request method is invalid.') : true;
        }

        public function getValue($array, $key){
            return isset($array[$key]) ? $this->sanitizeValue($array[$key]) : '';
        }

        protected function sanitizeValue($value){
            // Remove characters with ASCII value less than 32 or greater than 127
            return filter_var($value, FILTER_SANITIZE_STRING, array('flags' => FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH));
        }

        public function exitWithError($message){
            echo json_encode([ 'error' => $message ]);
            exit();
        }

        public function startCall(){
            $this->apiCall = curl_init();
            return $this->apiCall;
        }

        public function setCallOptions($options){
            curl_setopt_array($this->apiCall, $options);
        }

        public function executeCall(){
            return curl_exec($this->apiCall);
        }

        public function endCall(){
            curl_close($this->apiCall);
        }

    }