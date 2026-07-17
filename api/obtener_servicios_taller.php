<?php
require_once 'conexion.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

if (isset($_GET['id_taller'])) {
    $idTaller = (int)$_GET['id_taller'];

    try {
        // Cruzamos la tabla de la relación con el catálogo para traer el nombre y el precio
        $query = "SELECT s.id_servicio, so.nombre, s.precio 
                  FROM servicios s
                  INNER JOIN servicios_ofrecidos so ON s.id_servicio_ofre = so.id_servicio_ofre
                  WHERE s.id_taller = :id_taller";
        
        $stmt = $conexion->prepare($query);
        $stmt->execute([':id_taller' => $idTaller]);
        $servicios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => "success",
            "data" => $servicios
        ]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error de base de datos: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Falta el ID del taller"]);
}
?>