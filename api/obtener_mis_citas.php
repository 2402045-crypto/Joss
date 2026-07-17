<?php
require_once 'conexion.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

if (isset($_GET['id_usuario'])) {
    $idUsuario = (int)$_GET['id_usuario'];

    try {
        // Ajusta "t.nombre_taller", "t.direccion" y "t.telefono" si tus columnas en la tabla talleres se llaman diferente
        $query = "SELECT c.id_cita, c.fecha, c.hora, c.estado, c.descripcion, 
                         t.nombre_taller AS nombre_taller, t.direccion, t.telefono,
                         so.nombre AS nombre_servicio, s.precio
                  FROM citas c
                  INNER JOIN talleres t ON c.id_taller = t.id_taller
                  INNER JOIN servicios s ON c.id_servicio = s.id_servicio
                  INNER JOIN servicios_ofrecidos so ON s.id_servicio_ofre = so.id_servicio_ofre
                  WHERE c.id_usuario = :id_usuario
                  ORDER BY c.fecha DESC, c.hora DESC";
        
        $stmt = $conexion->prepare($query);
        $stmt->execute([':id_usuario' => $idUsuario]);
        $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status" => "success", "data" => $citas]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Falta el ID del usuario"]);
}
?>