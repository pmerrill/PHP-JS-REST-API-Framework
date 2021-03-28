<?php
    class APIController {
        public $contentType;

        public function setContentType($contentType){
            $this->contentType = $contentType;
        }

        public function isDesiredRequestMethod($method){
            return $_SERVER['REQUEST_METHOD'] === 'GET';
        }

        public function getArrayKeyValue($array, $key){
            if(isset($array[$key])){
                return $this->sanitizeValue($array[$key]);
            } else {
                echo 'error';
                exit();
            }
        }

        protected function sanitizeValue($value){
            return filter_var($value, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
        }

    }