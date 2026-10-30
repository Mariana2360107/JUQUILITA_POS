<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'conexion.php';

if (!$conn) {
    die(json_encode([
        "success" => false,
        "message" => "Error de conexión"
    ]));
}

$usuario = $_POST['usuario'] ?? '';
$password = $_POST['password'] ?? '';
$rol = $_POST['rol'] ?? '';

$sql = "SELECT * FROM empleados 
        WHERE usuario = ?
        AND contraseña = ?
        AND rol = ?
        AND activo = 1";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "sss",
    $usuario,
    $password,
    $rol
);

mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($resultado) > 0) {
    $empleado = mysqli_fetch_assoc($resultado);
    echo json_encode([
        "success" => true,
        "nombre" => $empleado['nombre'],
        "rol" => $empleado['rol']
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Credenciales incorrectas"
    ]);
}
?>