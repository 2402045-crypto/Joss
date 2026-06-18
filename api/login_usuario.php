<?php
// api/login_usuario.php
require_once 'conexion.php';

$datos = json_decode(file_get_contents("php://input"));

if($datos && isset($datos->email) && isset($datos->password)) {
    try {
        // Buscamos al usuario por su correo
        $query = "SELECT id_usuario, nombre, password, id_rol FROM usuarios WHERE email = :email";
        $stmt = $conexion->prepare($query);
        $stmt->execute([':email' => $datos->email]);
        $usuario = $stmt->fetch();

        // Verificamos que el usuario exista y que la contraseña haga "match" con la encriptada
        if ($usuario && password_verify($datos->password, $usuario['password'])) {
            // Si todo está bien, le damos luz verde
            echo json_encode([
                "status" => "success", 
                "message" => "Bienvenido " . $usuario['nombre'],
                "nombre" => $usuario['nombre'],
                "rol" => $usuario['id_rol']
            ]);
        } else {
            // Si se equivocó en algo, lo rebotamos
            echo json_encode(["status" => "error", "message" => "Correo o contraseña incorrectos"]);
        }

    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error en el servidor: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Faltan datos"]);
}
?>