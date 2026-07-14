<?php
// api/obtener_mecanicos.php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    // 1. Buscamos a los mecánicos (AQUÍ CAMBIAMOS rm.foto_perfil a u.foto_perfil)
    $queryMecanicos = "SELECT 
                u.id_usuario, u.nombre, u.email, u.telefono, u.foto_perfil,
                rm.id_mecanico, rm.edad, rm.anios_experiencia, rm.calificacion_promedio, 
                rm.estado, rm.descripcion_servicio
              FROM usuarios u
              INNER JOIN registros_mecanicos rm ON u.id_usuario = rm.id_usuario
              WHERE u.id_rol = 2";
              
    $stmt = $conexion->prepare($queryMecanicos);
    $stmt->execute();
    $mecanicos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Buscamos certificados
    foreach ($mecanicos as $index => $mecanico) {
        $queryCert = "SELECT nombre FROM certificaciones WHERE id_mecanico = :id_mecanico";
        $stmtCert = $conexion->prepare($queryCert);
        $stmtCert->execute([':id_mecanico' => $mecanico['id_mecanico']]);
        
        $mecanicos[$index]['certificados'] = $stmtCert->fetchAll(PDO::FETCH_COLUMN);
    }

    echo json_encode([
        "status" => "success", 
        "data" => $mecanicos
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al obtener datos: " . $e->getMessage()]);
}
?>