<?php
    
    // Autoload a controller based on an anonymous function
    spl_autoload_register(function($className){
        require_once 'controllers/' . $className . '.php';
    });