<?php
// api/obtener_talleres.php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    // 1. Obtenemos los talleres base con info de los mecánicos
    $queryTalleres = "
        SELECT 
            t.id_taller as id, 
            t.nombre_taller as name, 
            t.direccion as location, 
            t.foto_taller,
            t.rango_precio,
            rm.anios_experiencia as experience,
            rm.calificacion_promedio as rating
        FROM talleres t
        INNER JOIN registros_mecanicos rm ON t.id_mecanico = rm.id_mecanico
    ";
    
    $stmt = $conexion->query($queryTalleres);
    $talleres = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Detectar si estamos en local o en InfinityFree para armar la URL de la foto
    $host = $_SERVER['HTTP_HOST'];
    $base_url = ($host === 'localhost' || $host === '127.0.0.1') 
                ? "http://localhost:8080/Joss/api/uploads/" 
                : "https://mecanicweb.free.nf/api/uploads/";

    // 2. Para cada taller buscamos sus especialidades y rellenamos datos
    foreach ($talleres as $index => $taller) {
        $queryEsp = "
            SELECT e.nombre 
            FROM especialidades e
            INNER JOIN taller_especialidades te ON e.id_especialidad = te.id_especialidad
            WHERE te.id_taller = :id_taller
        ";
        $stmtEsp = $conexion->prepare($queryEsp);
        $stmtEsp->execute([':id_taller' => $taller['id']]);
        
        // Empaquetamos las especialidades en un arreglo
        $talleres[$index]['specialties'] = $stmtEsp->fetchAll(PDO::FETCH_COLUMN);
        
        // Asignamos la foto real o una de repuesto si no subieron nada
        $talleres[$index]['image'] = $taller['foto_taller'] 
            ? $base_url . $taller['foto_taller'] 
            : "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=200";
        
        // Rellenamos los campos que el frontend de Vue espera para funcionar
        $talleres[$index]['priceRange'] = $taller['rango_precio'] ?? '$$';
        $talleres[$index]['photosCount'] = 1;
        $talleres[$index]['reviews'] = 0; 
        $talleres[$index]['distance'] = "2.5"; // Fijo por ahora hasta integrar el mapa
        $talleres[$index]['availability'] = 'Disponible hoy';
        $talleres[$index]['isAvailableToday'] = true;
        $talleres[$index]['isOpen'] = true;
        $talleres[$index]['schedule'] = 'Ver horarios en perfil';
        $talleres[$index]['verified'] = true;
    }

    echo json_encode(["status" => "success", "data" => $talleres]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al obtener talleres: " . $e->getMessage()]);
}
?>