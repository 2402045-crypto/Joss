<?php
// api/obtener_mecanicos.php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    // 1. Buscamos SOLAMENTE a los mecánicos activos
    $queryMecanicos = "SELECT 
                u.id_usuario, u.nombre, u.email, u.telefono, u.foto_perfil,
                rm.id_mecanico, rm.edad, rm.anios_experiencia, rm.calificacion_promedio, 
                rm.estado, rm.descripcion_servicio
              FROM usuarios u
              INNER JOIN registros_mecanicos rm ON u.id_usuario = rm.id_usuario
              WHERE u.id_rol = 2 AND rm.estado = 'activo'";
              
    $stmt = $conexion->prepare($queryMecanicos);
    $stmt->execute();
    $mecanicos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Buscamos certificados y especialidades
    foreach ($mecanicos as $index => $mecanico) {
        
        // --- CERTIFICADOS ---
        $queryCert = "SELECT nombre FROM certificaciones WHERE id_mecanico = :id_mecanico";
        $stmtCert = $conexion->prepare($queryCert);
        $stmtCert->execute([':id_mecanico' => $mecanico['id_mecanico']]);
        $mecanicos[$index]['certificados'] = $stmtCert->fetchAll(PDO::FETCH_COLUMN);

        // --- ESPECIALIDADES (Cruzando con su taller) ---
        $queryEsp = "
            SELECT e.nombre 
            FROM especialidades e
            INNER JOIN taller_especialidades te ON e.id_especialidad = te.id_especialidad
            INNER JOIN talleres t ON te.id_taller = t.id_taller
            WHERE t.id_mecanico = :id_mecanico
        ";
        $stmtEsp = $conexion->prepare($queryEsp);
        $stmtEsp->execute([':id_mecanico' => $mecanico['id_mecanico']]);
        $especialidades = $stmtEsp->fetchAll(PDO::FETCH_COLUMN);
        
        // Si el mecánico aún no registra un taller o especialidad, le ponemos una por defecto
        $mecanicos[$index]['specialties'] = count($especialidades) > 0 ? $especialidades : ['Mecánica General'];
    }

    echo json_encode([
        "status" => "success", 
        "data" => $mecanicos
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al obtener datos: " . $e->getMessage()]);
}
?>