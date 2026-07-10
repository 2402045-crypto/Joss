<?php
// api/registro_taller.php
require_once 'conexion.php';

if (!empty($_POST)) {
    try {
        $conexion->beginTransaction();

        // 1. Encontrar el id_mecanico asociado al usuario logueado
        $queryMec = "SELECT id_mecanico FROM registros_mecanicos WHERE id_usuario = :id_usuario";
        $stmtMec = $conexion->prepare($queryMec);
        $stmtMec->execute([':id_usuario' => $_POST['id_usuario']]);
        $id_mecanico = $stmtMec->fetchColumn();

        if (!$id_mecanico) {
            throw new Exception("No se encontró un perfil de mecánico válido para este usuario.");
        }

        // 2. Procesar la foto del taller
        $foto_taller = null;
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $carpeta_destino = 'uploads/';
            $nombre_foto = uniqid() . '_taller_' . basename($_FILES['photo']['name']);
            $ruta_foto = $carpeta_destino . $nombre_foto;
            
            if (move_uploaded_file($_FILES['photo']['tmp_name'], $ruta_foto)) {
                $foto_taller = $nombre_foto;
            }
        }

        // 3. Registrar los datos base del taller
        $queryTaller = "INSERT INTO talleres (id_mecanico, nombre_taller, telefono, email, direccion, code_postal, foto_taller) 
                        VALUES (:id_mecanico, :nombre, :telefono, :email, :direccion, :cp, :foto)";
        $stmtTaller = $conexion->prepare($queryTaller);
        $stmtTaller->execute([
            ':id_mecanico' => $id_mecanico,
            ':nombre'      => $_POST['shopName'],
            ':telefono'    => $_POST['shopPhone'],
            ':email'       => $_POST['shopEmail'],
            ':direccion'   => $_POST['shopLocation'],
            ':cp'          => $_POST['postalCode'],
            ':foto'        => $foto_taller
        ]);

        $id_taller_nuevo = $conexion->lastInsertId();

        // 4. Registrar los horarios por día
        $horarios = json_decode($_POST['scheduleList'], true);
        
        // Mapa para alinear los días de Vue con los de tu BD ('Miércoles' -> 'Miercoles')
        $mapaDias = [
            'Lunes' => 'Lunes', 'Martes' => 'Martes', 'Miércoles' => 'Miercoles',
            'Jueves' => 'Jueves', 'Viernes' => 'Viernes', 'Sábado' => 'Sabado', 'Domingo' => 'Domingo'
        ];

        $queryBusquedaDia = "SELECT id_dia FROM dias_semana WHERE nombre = :nombre";
        $stmtBusquedaDia = $conexion->prepare($queryBusquedaDia);
        
        $queryInsertHorario = "INSERT INTO horarios_taller (id_taller, id_dia, hora_inicio, hora_fin) VALUES (:taller, :dia, :inicio, :fin)";
        $stmtInsertHorario = $conexion->prepare($queryInsertHorario);

        foreach ($horarios as $horario) {
            $diaDb = $mapaDias[$horario['day']];
            
            $stmtBusquedaDia->execute([':nombre' => $diaDb]);
            $id_dia = $stmtBusquedaDia->fetchColumn();

            if ($id_dia) {
                $stmtInsertHorario->execute([
                    ':taller' => $id_taller_nuevo,
                    ':dia'    => $id_dia,
                    ':inicio' => $horario['start'],
                    ':fin'    => $horario['end']
                ]);
            }
        }

        // 5. Registrar Especialidades
        $especialidades = json_decode($_POST['specialties'], true);
        
        $queryBusquedaEsp = "SELECT id_especialidad FROM especialidades WHERE nombre = :nombre";
        $stmtBusquedaEsp = $conexion->prepare($queryBusquedaEsp);
        
        $queryCrearEsp = "INSERT INTO especialidades (nombre) VALUES (:nombre)";
        $stmtCrearEsp = $conexion->prepare($queryCrearEsp);

        $queryRelacionEsp = "INSERT INTO taller_especialidades (id_taller, id_especialidad) VALUES (:taller, :especialidad)";
        $stmtRelacionEsp = $conexion->prepare($queryRelacionEsp);

        foreach ($especialidades as $esp_nombre) {
            $stmtBusquedaEsp->execute([':nombre' => $esp_nombre]);
            $id_especialidad = $stmtBusquedaEsp->fetchColumn();

            // Si es una especialidad "Otra" y no existe en BD, la creamos al vuelo
            if (!$id_especialidad) {
                $stmtCrearEsp->execute([':nombre' => $esp_nombre]);
                $id_especialidad = $conexion->lastInsertId();
            }

            $stmtRelacionEsp->execute([
                ':taller' => $id_taller_nuevo,
                ':especialidad' => $id_especialidad
            ]);
        }

        $conexion->commit();
        echo json_encode(["status" => "success", "message" => "Taller creado correctamente con todas sus relaciones."]);

    } catch (PDOException $e) {
        $conexion->rollBack();
        echo json_encode(["status" => "error", "message" => "Error de base de datos: " . $e->getMessage()]);
    } catch (Exception $ex) {
        $conexion->rollBack();
        echo json_encode(["status" => "error", "message" => $ex->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No se recibieron datos."]);
}
?>