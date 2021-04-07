<?php

    class APIController {
        private $requestMethod;
        public $isValidRequest;

        public function defineRequestMethod($requestMethod){
            $this->requestMethod = $requestMethod;
        }

        public function validateRequest(){
            $this->isValidRequest = $this->isValidRequestMethod();
        }

        private function isValidRequestMethod(){
            return $_SERVER['REQUEST_METHOD'] === $this->requestMethod;
        }

    }

    class APIEndpoint extends APIController {
        private $host;
        private $path;
        private $queryString;
        public $endpoint;
        
        public function setHost($host){
            $this->host = $host;
        }

        public function setPath($path){
            $this->path = $path;
        }

        public function setQueryString($queryString){
            $this->queryString = $queryString;
        }

        public function build(){
            $this->endpoint = $this->host . $this->path . $this->queryString;
        }
    }

    class APICall extends APIEndpoint {
        private $apiCall;
        public $hasError;

        public function start(){
            $this->apiCall = curl_init();
        }

        public function setOptions($optionsArray){
            curl_setopt_array($this->apiCall, $optionsArray);
        }

        public function execute(){
            return curl_exec($this->apiCall);
        }

        public function errorCheck(){
            $this->hasError = $this->hasErrorCode();
        }

        public function hasErrorCode(){
            return curl_errno($this->apiCall) > 0;
        }

        public function end(){
            curl_close($this->apiCall);
        }

    }

    class APIResponse extends APICall {
        public $result;
        private $sortKey;

        public function setResult($result){
            $this->result = $result;
        }

        public function setSortKey($sortKey){
            $this->sortKey = $sortKey;
        }

        public function sort($sortDirection){
            $sortDirection === 'asc' ? $this->sortAsc() : $this->sortDesc();
        }

        private function sortAsc(){
            usort($this->result, function($a, $b){
                return isset($a[$this->sortKey]) ? $a[$this->sortKey] <=> $b[$this->sortKey] : false;
            });
        }

        private function sortDesc(){
            usort($this->result, function($a, $b){
                return isset($b[$this->sortKey]) ? $b[$this->sortKey] <=> $a[$this->sortKey] : false;
            });
        }
    }