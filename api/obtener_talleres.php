<?php
// api/obtener_talleres.php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
  // Trae talleres con coordenadas y concatena sus especialidades para mostrarlas en el mapa.
    $query = "SELECT
                t.id_taller,
                t.nombre_taller,
                t.telefono,
                t.email,
                t.direccion,
                t.code_postal,
                t.latitud,
                t.longitud,
                GROUP_CONCAT(DISTINCT e.nombre ORDER BY e.nombre SEPARATOR ', ') AS especialidades
              FROM talleres t
              LEFT JOIN taller_especialidades te ON te.id_taller = t.id_taller
              LEFT JOIN especialidades e ON e.id_especialidad = te.id_especialidad
              WHERE t.latitud IS NOT NULL
                AND t.longitud IS NOT NULL
              GROUP BY
                t.id_taller,
                t.nombre_taller,
                t.telefono,
                t.email,
                t.direccion,
                t.code_postal,
                t.latitud,
                t.longitud
              ORDER BY t.id_taller DESC";

          // Ejecuta consulta y devuelve un arreglo listo para el frontend.
    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $talleres = $stmt->fetchAll(PDO::FETCH_ASSOC);

          // Respuesta estandarizada para consumo en useMapSearch.
    echo json_encode([
        'status' => 'success',
        'data' => $talleres,
    ]);
} catch (PDOException $e) {
          // Error controlado para facilitar debug si falla la consulta.
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al obtener talleres: ' . $e->getMessage(),
    ]);
}
?>
