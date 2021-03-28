<?php
    
    // Autoload controllers from anonymous function
    spl_autoload_register(function($className){
        require_once 'controllers/' . $className . '.php';
    });