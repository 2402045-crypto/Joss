<?php
// api/registro_taller.php
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

function normalize_day_name(string $day): string
{
    $day = trim($day);
    $day = strtr($day, [
        'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
        'Á' => 'A', 'É' => 'E', 'Í' => 'I', 'Ó' => 'O', 'Ú' => 'U',
    ]);
    return mb_strtolower($day, 'UTF-8');
}

function parse_schedule_entry(string $entry): ?array
{
    $pattern = '/^\s*([^:]+)\s*:\s*([0-2][0-9]:[0-5][0-9])\s*a\s*([0-2][0-9]:[0-5][0-9])\s*$/u';
    if (!preg_match($pattern, $entry, $matches)) {
        return null;
    }

    return [
        'day' => trim($matches[1]),
        'start' => $matches[2] . ':00',
        'end' => $matches[3] . ':00',
    ];
}

try {
    $conexion->beginTransaction();

    $nombre = trim($_POST['shopName'] ?? '');
    $telefono = trim($_POST['shopPhone'] ?? '');
    $email = trim($_POST['shopEmail'] ?? '');
    $direccion = trim($_POST['shopLocation'] ?? '');
    $codigoPostal = trim($_POST['postalCode'] ?? '');
    $latitud = $_POST['latitud'] ?? null;
    $longitud = $_POST['longitud'] ?? null;
    $direccionGeocodificada = trim($_POST['direccion_geocodificada'] ?? '');
    $scheduleList = $_POST['scheduleList'] ?? '[]';
    $specialties = $_POST['specialties'] ?? '[]';
    
    // Nueva variable para atrapar los servicios
    $services = $_POST['services'] ?? '[]';

    if ($nombre === '' || $email === '' || $direccion === '' || $codigoPostal === '') {
        throw new InvalidArgumentException('Faltan campos obligatorios');
    }

    $direccionFinal = $direccionGeocodificada !== '' ? $direccionGeocodificada : $direccion;
    $codigoPostalInt = (int)preg_replace('/\D+/', '', $codigoPostal);
    $latitudValue = is_numeric($latitud) ? (float)$latitud : null;
    $longitudValue = is_numeric($longitud) ? (float)$longitud : null;

    $scheduleArray = json_decode($scheduleList, true);
    if (!is_array($scheduleArray)) {
        $scheduleArray = [];
    }

    $specialtiesArray = json_decode($specialties, true);
    if (!is_array($specialtiesArray)) {
        $specialtiesArray = [];
    }

    // Decodificamos el arreglo de servicios
    $servicesArray = json_decode($services, true);
    if (!is_array($servicesArray)) {
        $servicesArray = [];
    }

    $fotoFinal = null;
    $carpetaDestino = 'uploads/';

    if (isset($_FILES['locationPhoto']) && $_FILES['locationPhoto']['error'] === UPLOAD_ERR_OK) {
        $nombreFoto = uniqid() . '_ubicacion_' . basename($_FILES['locationPhoto']['name']);
        $rutaFoto = $carpetaDestino . $nombreFoto;

        if (move_uploaded_file($_FILES['locationPhoto']['tmp_name'], $rutaFoto)) {
            $fotoFinal = $nombreFoto;
        }
    }

    $stmtMecanico = $conexion->prepare(
        "SELECT rm.id_mecanico
         FROM registros_mecanicos rm
         INNER JOIN usuarios u ON u.id_usuario = rm.id_usuario
         WHERE u.email = :email
         LIMIT 1"
    );
    $stmtMecanico->execute([':email' => $email]);
    $idMecanico = $stmtMecanico->fetchColumn();

    if (!$idMecanico) {
        throw new InvalidArgumentException('No se encontró un mecánico asociado al correo proporcionado');
    }

    $stmtTaller = $conexion->prepare(
        "INSERT INTO talleres
        (id_mecanico, nombre_taller, telefono, email, direccion, code_postal, foto_taller, latitud, longitud, rango_precio)
        VALUES
        (:id_mecanico, :nombre_taller, :telefono, :email, :direccion, :code_postal, :foto_taller, :latitud, :longitud, :rango_precio)"
    );

    $stmtTaller->execute([
        ':id_mecanico' => (int)$idMecanico,
        ':nombre_taller' => $nombre,
        ':telefono' => $telefono,
        ':email' => $email,
        ':direccion' => $direccionFinal,
        ':code_postal' => $codigoPostalInt,
        ':foto_taller' => $fotoFinal,
        ':latitud' => $latitudValue,
        ':longitud' => $longitudValue,
        ':rango_precio' => null,
    ]);

    $idTaller = (int)$conexion->lastInsertId();

    // Guardar Horarios
    $stmtDias = $conexion->query("SELECT id_dia, nombre FROM dias_semana");
    $dias = $stmtDias->fetchAll(PDO::FETCH_ASSOC);
    $diasMap = [];
    foreach ($dias as $dia) {
        $diasMap[normalize_day_name($dia['nombre'])] = (int)$dia['id_dia'];
    }

    $stmtHorario = $conexion->prepare(
        "INSERT INTO horarios_taller (id_taller, id_dia, hora_inicio, hora_fin)
         VALUES (:id_taller, :id_dia, :hora_inicio, :hora_fin)"
    );

    foreach ($scheduleArray as $entry) {
        $parsed = parse_schedule_entry($entry);
        if (!$parsed) continue;

        $dayKey = normalize_day_name($parsed['day']);
        if (!isset($diasMap[$dayKey])) continue;

        $stmtHorario->execute([
            ':id_taller' => $idTaller,
            ':id_dia' => $diasMap[$dayKey],
            ':hora_inicio' => $parsed['start'],
            ':hora_fin' => $parsed['end'],
        ]);
    }

    // Guardar Especialidades
    $stmtFindEspecialidad = $conexion->prepare("SELECT id_especialidad FROM especialidades WHERE nombre = :nombre LIMIT 1");
    $stmtInsertEspecialidad = $conexion->prepare("INSERT INTO especialidades (nombre) VALUES (:nombre)");
    $stmtLinkEspecialidad = $conexion->prepare(
        "INSERT IGNORE INTO taller_especialidades (id_taller, id_especialidad)
         VALUES (:id_taller, :id_especialidad)"
    );

    foreach ($specialtiesArray as $specialtyName) {
        $specialtyName = trim((string)$specialtyName);
        if ($specialtyName === '') continue;

        $stmtFindEspecialidad->execute([':nombre' => $specialtyName]);
        $idEspecialidad = $stmtFindEspecialidad->fetchColumn();

        if (!$idEspecialidad) {
            $stmtInsertEspecialidad->execute([':nombre' => $specialtyName]);
            $idEspecialidad = (int)$conexion->lastInsertId();
        }

        $stmtLinkEspecialidad->execute([
            ':id_taller' => $idTaller,
            ':id_especialidad' => (int)$idEspecialidad,
        ]);
    }

   // --- NUEVO: GUARDAR SERVICIOS CON PRECIO INCLUIDO ---
    
    $stmtFindServicio = $conexion->prepare("SELECT id_servicio_ofre FROM servicios_ofrecidos WHERE nombre = :nombre LIMIT 1");
    
    $stmtInsertServicioCat = $conexion->prepare("INSERT INTO servicios_ofrecidos (nombre) VALUES (:nombre)");
    
    // Aquí cambiamos el NULL por :precio
    $stmtLinkServicio = $conexion->prepare(
        "INSERT INTO servicios (id_taller, id_servicio_ofre, precio)
         VALUES (:id_taller, :id_servicio_ofre, :precio)"
    );

    // Ahora $servicesArray trae arreglos con 'name' y 'price'
    foreach ($servicesArray as $serviceData) {
        // Extraemos el nombre
        $serviceName = trim((string)($serviceData['name'] ?? ''));
        if ($serviceName === '') continue;

        // Extraemos el precio y nos aseguramos de que sea un número válido. Si no, queda como null.
        $precio = (isset($serviceData['price']) && is_numeric($serviceData['price'])) 
                  ? (float)$serviceData['price'] 
                  : null;

        $stmtFindServicio->execute([':nombre' => $serviceName]);
        $idServicioOfre = $stmtFindServicio->fetchColumn();

        if (!$idServicioOfre) {
            $stmtInsertServicioCat->execute([':nombre' => $serviceName]);
            $idServicioOfre = (int)$conexion->lastInsertId();
        }

        // Insertamos usando el precio que puso el mecánico
        $stmtLinkServicio->execute([
            ':id_taller' => $idTaller,
            ':id_servicio_ofre' => (int)$idServicioOfre,
            ':precio' => $precio,
        ]);
    }

    $conexion->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Taller registrado correctamente",
        "id_taller" => $idTaller
    ]);
} catch (Exception $e) {
    if ($conexion->inTransaction()) {
        $conexion->rollBack();
    }
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>