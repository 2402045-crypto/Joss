<?php
// api/obtener_mecanicos.php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    // 1. Buscamos a todos los usuarios que tengan el rol de mecánico (rol 2)
    $queryMecanicos = "SELECT 
                u.id_usuario, u.nombre, u.email, u.telefono,
                rm.id_mecanico, rm.anios_experiencia, rm.calificacion_promedio, 
                rm.estado, rm.foto_perfil, rm.descripcion_servicio
              FROM usuarios u
              INNER JOIN registros_mecanicos rm ON u.id_usuario = rm.id_usuario
              WHERE u.id_rol = 2";
              
    $stmt = $conexion->prepare($queryMecanicos);
    $stmt->execute();
    $mecanicos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Por cada mecánico, buscamos si tiene certificados (PDFs) en la base de datos
    foreach ($mecanicos as $index => $mecanico) {
        $queryCert = "SELECT nombre FROM certificaciones WHERE id_mecanico = :id_mecanico";
        $stmtCert = $conexion->prepare($queryCert);
        $stmtCert->execute([':id_mecanico' => $mecanico['id_mecanico']]);
        
        // Le agregamos un arreglo de "certificados" a la información de este mecánico
        $mecanicos[$index]['certificados'] = $stmtCert->fetchAll(PDO::FETCH_COLUMN);
    }

    // Devolvemos todo a Vue
    echo json_encode([
        "status" => "success", 
        "data" => $mecanicos
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al obtener datos: " . $e->getMessage()]);
}
?>