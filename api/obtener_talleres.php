<?php
// api/obtener_talleres.php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    $queryTalleres = "
        SELECT 
            t.id_taller as id,
            t.id_taller,
            t.nombre_taller,
            t.nombre_taller as name,
            t.direccion,
            t.direccion as location,
            t.telefono,
            t.foto_taller,
            t.latitud,
            t.longitud,
            rm.anios_experiencia as experience,
            rm.calificacion_promedio as rating,
            
            /* MAGIA SQL: Calculamos el promedio de sus servicios y asignamos el símbolo automáticamente */
            COALESCE(
                (SELECT 
                    CASE 
                        WHEN AVG(precio) < 500 THEN '$'
                        WHEN AVG(precio) >= 500 AND AVG(precio) <= 1500 THEN '$$'
                        WHEN AVG(precio) > 1500 THEN '$$$'
                    END
                 FROM servicios 
                 WHERE id_taller = t.id_taller), 
                '$' /* Valor por defecto si el mecánico aún no registra ningún servicio */
            ) AS rango_precio_calculado

        FROM talleres t
        INNER JOIN registros_mecanicos rm ON t.id_mecanico = rm.id_mecanico
    ";
    
    $stmt = $conexion->query($queryTalleres);
    $talleres = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Detectar local/prod y armar URL de uploads sin romper por puerto.
    $hostActual = $_SERVER['HTTP_HOST'] ?? '';
    $hostSinPuerto = preg_replace('/:\\d+$/', '', trim($hostActual, '[]'));
    $base_url = in_array($hostSinPuerto, ['localhost', '127.0.0.1', '::1'])
                ? "http://localhost:8080/Joss/api/uploads/"
                : "https://mecanicweb.free.nf/Joss/api/uploads/";

    // 2. Para cada taller buscamos sus especialidades y normalizamos campos para frontend.
    foreach ($talleres as $index => $taller) {
        $queryEsp = "
            SELECT e.nombre 
            FROM especialidades e
            INNER JOIN taller_especialidades te ON e.id_especialidad = te.id_especialidad
            WHERE te.id_taller = :id_taller
        ";
        $stmtEsp = $conexion->prepare($queryEsp);
        $stmtEsp->execute([':id_taller' => $taller['id']]);
        
        $especialidades = $stmtEsp->fetchAll(PDO::FETCH_COLUMN);
        $talleres[$index]['specialties'] = $especialidades;
        $talleres[$index]['especialidades'] = implode(', ', $especialidades);
        
        // Imagen para tarjetas y fallback para cuando no hay foto.
        $talleres[$index]['image'] = $taller['foto_taller'] 
            ? $base_url . $taller['foto_taller'] 
            : "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=200";
        
        // Campos esperados por SearchTaller.
        // Aquí le pasamos el nuevo rango que calculó nuestra consulta SQL
        $talleres[$index]['priceRange'] = $taller['rango_precio_calculado'];
        $talleres[$index]['photosCount'] = 1;
        $talleres[$index]['reviews'] = 0; 
        $talleres[$index]['distance'] = "2.5";
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