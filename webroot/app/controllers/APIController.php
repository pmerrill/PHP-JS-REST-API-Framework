<?php

    class APIController {
        public $category;
        private $requestMethod;
        public $isValidRequest;

        public function setCategory($category){
            $this->category = $category;
        }

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

    class APICall extends APIController {
        private $endpointHost;
        private $endpointPath;
        private $endpointQueryString;
        public $endpoint;
        private $apiCall;
        public $hasError;
        public $result;
        private $sortKey;
        
        public function setEndpointHost($host){
            $this->endpointHost = $host;
        }

        public function setEndpointPath($path){
            $this->endpointPath = $path;
        }

        public function setEndpointQueryString($queryString){
            $this->endpointQueryString = $queryString;
        }

        public function compileEndpoint(){
            $this->endpoint = $this->endpointHost . $this->endpointPath . $this->endpointQueryString;
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

        public function errorCheck(){
            $this->hasError = $this->hasErrorCode();
        }

        public function hasErrorCode(){
            return curl_errno($this->apiCall) > 0;
        }

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

        public function end(){
            curl_close($this->apiCall);
        }

    }