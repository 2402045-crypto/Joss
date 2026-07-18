<?php
require_once 'conexion.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id_cita'], $data['estado'])) {
    try {
        $stmt = $conexion->prepare("UPDATE citas SET estado = :estado WHERE id_cita = :id_cita");
        $stmt->execute([
            ':estado' => $data['estado'],
            ':id_cita' => $data['id_cita']
        ]);
        
        echo json_encode(["status" => "success"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>