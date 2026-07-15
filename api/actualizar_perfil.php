<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id_usuario'];
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'] ?? ''; 
    $password = $_POST['password'] ?? '';

    // Preparamos los datos base
    $query_parts = ["nombre = :nombre", "email = :email", "telefono = :telefono"];
    $params = [
        ':nombre' => $nombre,
        ':email' => $email,
        ':telefono' => $telefono,
        ':id' => $id
    ];

    // Si subió una foto nueva, la guardamos
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $nombre_foto = uniqid() . '_perfil_' . basename($_FILES['foto']['name']);
        if (move_uploaded_file($_FILES['foto']['tmp_name'], 'uploads/' . $nombre_foto)) {
            $query_parts[] = "foto_perfil = :foto";
            $params[':foto'] = $nombre_foto;
        }
    }

    // Si escribió una contraseña nueva, la encriptamos y la actualizamos
    if (!empty($password)) {
        $query_parts[] = "password = :password";
        $params[':password'] = password_hash($password, PASSWORD_DEFAULT);
    }

    // Unimos todo y ejecutamos
    $sql = "UPDATE usuarios SET " . implode(", ", $query_parts) . " WHERE id_usuario = :id";
    $stmt = $conexion->prepare($sql);
    
    try {
        $stmt->execute($params);
        echo json_encode(["status" => "success", "message" => "Perfil actualizado"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>