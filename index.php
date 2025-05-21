<?php
// กำหนดค่า headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$request = $_SERVER['REQUEST_URI'];
$file_path = __DIR__ . '/dist' . $request;

if (file_exists($file_path) && !is_dir($file_path)) {
    // ตรวจสอบ file extension และกำหนด content type
    $ext = pathinfo($file_path, PATHINFO_EXTENSION);
    $content_types = [
        'js' => 'application/javascript',
        'css' => 'text/css',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'svg' => 'image/svg+xml'
    ];
    
    if (isset($content_types[$ext])) {
        header('Content-Type: ' . $content_types[$ext]);
    }
    
    readfile($file_path);
    exit;
}

// ถ้าไม่เจอไฟล์ ให้ส่งกลับไปที่ index.html
readfile(__DIR__ . '/dist/index.html');
