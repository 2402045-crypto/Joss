<?php
// api/registro_usuario.php
require_once 'conexion.php';

if(!empty($_POST)) {
    try {
        $conexion->beginTransaction();

        $id_rol = ($_POST['role'] === 'mecanico') ? 2 : 1;
        
        $passwordHash = password_hash($_POST['password'], PASSWORD_DEFAULT);

        // 1. Guardamos usuario base
        $queryUser = "INSERT INTO usuarios (id_rol, nombre, email, password, telefono) 
                      VALUES (:id_rol, :nombre, :email, :password, :telefono)";
        $stmtUser = $conexion->prepare($queryUser);
        $stmtUser->execute([
            ':id_rol' => $id_rol,
            ':nombre' => $_POST['fullName'],
            ':email' => $_POST['email'],
            ':password' => $passwordHash,
            ':telefono' => $_POST['phone']
        ]);

        $id_usuario_nuevo = $conexion->lastInsertId();

        // 2. Guardamos perfil de mecánico (AQUÍ SE AGREGÓ LA EDAD)
        if ($_POST['role'] === 'mecanico') {
            $queryMecanico = "INSERT INTO registros_mecanicos 
                             (id_usuario, edad, anios_experiencia, calificacion_promedio, estado, foto_perfil, descripcion_servicio) 
                             VALUES (:id_usuario, :edad, :anios, :calif, :estado, :foto, :desc)";
            $stmtMec = $conexion->prepare($queryMecanico);
            $stmtMec->execute([
                ':id_usuario' => $id_usuario_nuevo,
                ':edad' => $_POST['edad'], // Se guarda la edad enviada desde Vue
                ':anios' => $_POST['experience'],
                ':calif' => 0,
                ':estado' => $_POST['estado'],
                ':foto' => $_POST['fotoPerfil'],
                ':desc' => $_POST['descripcionServicio']
            ]);

            $id_mecanico_nuevo = $conexion->lastInsertId();

            // 3. PDFs opcionales
            $queryCert = "INSERT INTO certificaciones(id_mecanico, nombre) VALUES (:id_mecanico, :nombre)";
            $stmtCert = $conexion->prepare($queryCert);
            
            $carpeta_destino = 'uploads/';

            for ($i = 1; $i <= 3; $i++) {
                $campo_archivo = 'certificado' . $i;
                
                if (isset($_FILES[$campo_archivo]) && $_FILES[$campo_archivo]['error'] === UPLOAD_ERR_OK) {
                    $nombre_archivo = uniqid() . '_' . basename($_FILES[$campo_archivo]['name']);
                    $ruta_final = $carpeta_destino . $nombre_archivo;
                    
                    if (move_uploaded_file($_FILES[$campo_archivo]['tmp_name'], $ruta_final)) {
                        $stmtCert->execute([
                            ':id_mecanico' => $id_mecanico_nuevo,
                            ':nombre' => $nombre_archivo
                        ]);
                    }
                }
            }
        }

        $conexion->commit();
        echo json_encode(["status" => "success", "message" => "Cuenta creada exitosamente"]);

    } catch (PDOException $e) {
        $conexion->rollBack();
        echo json_encode(["status" => "error", "message" => "Error al registrar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No se recibieron datos"]);
}
?>