<?php
    
    function sanitize($value){
        // Remove characters with ASCII value less than 32 or greater than 127
        return filter_var($value, FILTER_SANITIZE_STRING, array('flags' => FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH));
    }

    function exitWithError($message){
        echo json_encode([ 'error' => $message ]);
        exit();
    }