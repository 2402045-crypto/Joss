<?php
// api/conexion.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Detectamos dónde está corriendo el código (sin puerto)
$host_actual = $_SERVER['HTTP_HOST'] ?? '';

// Quita corchetes de IPv6 y remueve puerto si existe (ej: localhost:5173, [::1]:8000)
$host_sin_puerto = preg_replace('/:\d+$/', '', trim($host_actual, '[]'));

//considera localhost IPV4 e IPV6
if (in_array($host_sin_puerto, ['localhost', '127.0.0.1', '::1'])) {
    // Entorno de Desarrollo (Local / Compañeras)
    $host = '127.0.0.1';
    $puerto = '3306';
    $dbname = 'prueba'; 
    $username = 'root';
    $password = '';
} else {
    // Entorno de Producción (InfinityFree)
    $host = 'sql101.infinityfree.com';
    $puerto = '3306'; 
    $dbname = 'if0_42265800_MecanicWeb';
    $username = 'if0_42265800'; 
    $password = 'Mecos6969'; 
}

try {
    $dsn = "mysql:host=$host;port=$puerto;dbname=$dbname;charset=utf8mb4";
    $opciones = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $conexion = new PDO($dsn, $username, $password, $opciones);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Fallo de conexión: " . $e->getMessage()]);
    exit;
}
?>