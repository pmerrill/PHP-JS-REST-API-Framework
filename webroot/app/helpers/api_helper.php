<?php

    function setHeaders($headersArray){
        if(is_array($headersArray)){
            foreach($headersArray as $header){
                header($header);
            }
        }
    }

    function findKeyValue($array, $key){
        return isset($array[$key]) ? sanitize($array[$key]) : '';
    }
    
    function sanitize($value){
        // Remove characters with ASCII value less than 32 or greater than 127
        return filter_var($value, FILTER_SANITIZE_STRING, array('flags' => FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH));
    }

    function buildQueryString($paramsArray){
        return http_build_query($paramsArray);
    }

    // Find the number of times a value occurs.
    function findKeyValueOccurrences($array, $column) {
        $columnArray = array_column($array, $column);
        return array_count_values($columnArray);
    }

    function exitWithError($code, $message){
        $output = outputTemplate();
        $output['status'] = array('code' => $code, 'message' => $message);
        echo json_encode($output);
        exit();
    }

    function outputTemplate(){
        return array(
            'status' => [
                'code' => 200,
                'message' => ''
            ],
            'result' => []
        );
    }