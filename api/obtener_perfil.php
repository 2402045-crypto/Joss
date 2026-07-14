<?php
require_once 'conexion.php';

if (isset($_GET['id_usuario'])) {
    $id = $_GET['id_usuario'];
    
    // Buscamos los datos del usuario
    $query = "SELECT nombre, email, telefono, foto_perfil FROM usuarios WHERE id_usuario = :id";
    $stmt = $conexion->prepare($query);
    $stmt->execute([':id' => $id]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        echo json_encode(["status" => "success", "data" => $usuario]);
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    }
}
?>