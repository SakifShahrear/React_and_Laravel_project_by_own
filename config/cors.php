<?php

return [

    'paths' => ['api/*', 'oauth/*', '/sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], //সব HTTP methods (GET, POST, PUT, DELETE) allowed।

    'allowed_origins' => ['*'], // Allow all origins for development

    'allowed_origins_patterns' => [], // কোন প্যাটার্ন মেলানোর দরকার নেই

    'allowed_headers' => ['*'], // সব হেডার allowed

    'exposed_headers' => [], // কোন হেডার exposed করার দরকার নেই

    'max_age' => 0, // preflight request cache করার সময় নেই

    'supports_credentials' => true, // কুকি এবং অথেন্টিকেশন তথ্য পাঠানো যাবে

];
