<?php
// conexion a la DB MySQL de XAMPP para la API de mecanicweb

// 1. Cabeceras CORS obligatorias para que Vue pueda consumir la API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Si la petición es OPTIONS (pre-flight de seguridad de Vue), salimos con éxito
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// 2. Parámetro de conexión DB
$host = '127.0.0.1';
$puerto = '3306'; 
$dbname = 'mecanicweb';
$username = 'root'; 
$password = ''; 

// 3. Intento de conexión a MySQL usando PDO
try {
    $dsn = "mysql:host=$host;port=$puerto;dbname=$dbname;charset=utf8mb4";
    $opciones = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $conexion = new PDO($dsn, $username, $password, $opciones);
    
    // Mensaje de éxito para confirmar que la conexión fue exitosa
    echo json_encode(["status" => "success", "message" => "¡Conexión exitosa a mecanicweb!"]);

} catch (PDOException $e) {
    // Si falla (ej. MySQL está apagado), devuelve el error en formato JSON
    echo json_encode(["status" => "error", "message" => "Fallo de conexión: " . $e->getMessage()]);
    exit;
}
?>