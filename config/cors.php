<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // সব হেডার allowed

    'exposed_headers' => [], // কোন হেডার exposed করার দরকার নেই

    'max_age' => 0, // preflight request cache করার সময় নেই

    'supports_credentials' => true, // কুকি এবং অথেন্টিকেশন তথ্য পাঠানো যাবে

];
