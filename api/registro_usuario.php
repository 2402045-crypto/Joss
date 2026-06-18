<?php
// api/registro_usuario.php
require_once 'conexion.php';

// Recibimos el JSON que nos manda Vue
$datos = json_decode(file_get_contents("php://input"));

if($datos) {
    try {
        // Iniciamos la transacción segura
        $conexion->beginTransaction();

        // Definimos el rol: 2 para mecánico, 1 para usuario normal
        $id_rol = ($datos->role === 'mecanico') ? 2 : 1;
        
        // Encriptamos la contraseña por seguridad
        $passwordHash = password_hash($datos->password, PASSWORD_DEFAULT);

        // 1. Guardamos los datos base en la tabla 'usuarios'
        $queryUser = "INSERT INTO usuarios (id_rol, nombre, email, password, telefono) 
                      VALUES (:id_rol, :nombre, :email, :password, :telefono)";
        $stmtUser = $conexion->prepare($queryUser);
        $stmtUser->execute([
            ':id_rol' => $id_rol,
            ':nombre' => $datos->fullName,
            ':email' => $datos->email,
            ':password' => $passwordHash,
            ':telefono' => $datos->phone
        ]);

        // Sacamos el ID del usuario recién creado
        $id_usuario_nuevo = $conexion->lastInsertId();

        // 2. Si eligió ser mecánico, guardamos su perfil extra en 'registros_mecanicos'
        if ($datos->role === 'mecanico') {
            $queryMecanico = "INSERT INTO registros_mecanicos 
                             (id_usuario, anios_experiencia, estado, foto_perfil, certificaciones, descripcion_servicio) 
                             VALUES (:id_usuario, :anios, :estado, :foto, :cert, :desc)";
            $stmtMec = $conexion->prepare($queryMecanico);
            $stmtMec->execute([
                ':id_usuario' => $id_usuario_nuevo,
                ':anios' => $datos->experience,
                ':estado' => $datos->estado,
                ':foto' => $datos->fotoPerfil,
                ':cert' => $datos->certificaciones,
                ':desc' => $datos->descripcionServicio
            ]);
        }

        // Si no hubo errores, guardamos definitivamente en MySQL
        $conexion->commit();
        echo json_encode(["status" => "success", "message" => "Cuenta creada exitosamente"]);

    } catch (PDOException $e) {
        // Si hay error (ej. correo duplicado), deshacemos todo
        $conexion->rollBack();
        echo json_encode(["status" => "error", "message" => "Error al registrar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No se recibieron datos"]);
}
?>