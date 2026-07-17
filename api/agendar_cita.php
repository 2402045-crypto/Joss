<?php
require_once 'conexion.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Verificamos que traiga los datos obligatorios
    if (isset($data['id_usuario'], $data['id_taller'], $data['fecha'], $data['hora'], $data['id_servicio'])) {
        try {
            // Atrapamos la descripción (si no viene o está vacía, le ponemos null)
            $descripcion = isset($data['descripcion']) && trim($data['descripcion']) !== '' ? trim($data['descripcion']) : null;

            // Agregamos la columna 'descripcion' a la consulta
            $query = "INSERT INTO citas (id_usuario, id_taller, id_servicio, fecha, hora, descripcion, estado) 
                      VALUES (:id_usuario, :id_taller, :id_servicio, :fecha, :hora, :descripcion, 'Pendiente')";
            
            $stmt = $conexion->prepare($query);
            $stmt->execute([
                ':id_usuario'  => $data['id_usuario'],
                ':id_taller'   => $data['id_taller'],
                ':id_servicio' => $data['id_servicio'],
                ':fecha'       => $data['fecha'],
                ':hora'        => $data['hora'],
                ':descripcion' => $descripcion // Pasamos la variable aquí
            ]);

            echo json_encode(["status" => "success", "message" => "Cita guardada correctamente"]);
            
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Error al guardar la cita: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
}
?>