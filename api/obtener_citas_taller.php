<?php
require_once 'conexion.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

if (isset($_GET['id_usuario_mecanico'])) {
    $idUsuarioMecanico = (int)$_GET['id_usuario_mecanico'];

    try {
        // Agregamos el INNER JOIN con registros_mecanicos para poder filtrar por el id_usuario correcto
        $query = "SELECT c.id_cita, c.fecha, c.hora, c.estado, c.descripcion, 
                         u.nombre AS nombre_cliente, u.telefono AS telefono_cliente,
                         so.nombre AS nombre_servicio, s.precio
                  FROM citas c
                  INNER JOIN talleres t ON c.id_taller = t.id_taller
                  INNER JOIN registros_mecanicos rm ON t.id_mecanico = rm.id_mecanico
                  LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
                  LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
                  LEFT JOIN servicios_ofrecidos so ON s.id_servicio_ofre = so.id_servicio_ofre
                  WHERE rm.id_usuario = :id_usuario_mecanico
                  ORDER BY c.fecha DESC, c.hora DESC";
        
        $stmt = $conexion->prepare($query);
        $stmt->execute([':id_usuario_mecanico' => $idUsuarioMecanico]);
        $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status" => "success", "data" => $citas]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Falta el ID del mecánico"]);
}
?>