<?php
// api/registro_usuario.php
require_once 'conexion.php';

// Ahora recibimos los datos por POST tradicional y los archivos por FILES
if(!empty($_POST)) {
    try {
        $conexion->beginTransaction();

        // Definimos el rol: 2 para mecánico, 1 para usuario normal
        $id_rol = ($_POST['role'] === 'mecanico') ? 2 : 1;
        
        // Encriptamos la contraseña por seguridad
        $passwordHash = password_hash($_POST['password'], PASSWORD_DEFAULT);

        // 1. Guardamos los datos base en la tabla 'usuarios'
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

        // 2. Si eligió ser mecánico, guardamos su perfil extra en 'registros_mecanicos'
        if ($_POST['role'] === 'mecanico') {
            $queryMecanico = "INSERT INTO registros_mecanicos 
                             (id_usuario, anios_experiencia, calificacion_promedio, estado, foto_perfil, descripcion_servicio) 
                             VALUES (:id_usuario, :anios, :calif, :estado, :foto, :desc)";
            $stmtMec = $conexion->prepare($queryMecanico);
            $stmtMec->execute([
                ':id_usuario' => $id_usuario_nuevo,
                ':anios' => $_POST['experience'],
                ':calif' => 0,
                ':estado' => $_POST['estado'],
                ':foto' => $_POST['fotoPerfil'],
                ':desc' => $_POST['descripcionServicio']
            ]);

            $id_mecanico_nuevo = $conexion->lastInsertId();

            // 3. Procesamos los PDFs opcionales
            $queryCert = "INSERT INTO certificaciones(id_mecanico, nombre) VALUES (:id_mecanico, :nombre)";
            $stmtCert = $conexion->prepare($queryCert);
            
            // Carpeta donde se guardarán
            $carpeta_destino = 'uploads/';

            for ($i = 1; $i <= 3; $i++) {
                $campo_archivo = 'certificado' . $i;
                
                // Revisamos si subió este certificado y si no hay errores al subir
                if (isset($_FILES[$campo_archivo]) && $_FILES[$campo_archivo]['error'] === UPLOAD_ERR_OK) {
                    
                    // Le ponemos un ID único al nombre para que no choquen si se llaman igual
                    $nombre_archivo = uniqid() . '_' . basename($_FILES[$campo_archivo]['name']);
                    $ruta_final = $carpeta_destino . $nombre_archivo;
                    
                    // Movemos el PDF a la carpeta final
                    if (move_uploaded_file($_FILES[$campo_archivo]['tmp_name'], $ruta_final)) {
                        // Guardamos solo el nombre del archivo en la base de datos
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