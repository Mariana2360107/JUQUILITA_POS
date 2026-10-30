<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

require_once 'conexion.php';

if (!$conn) {
    die(json_encode([
        "success" => false,
        "message" => "Error de conexión"
    ]));
}

$usuario = $_POST['usuario'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$turno = $_POST['turno'] ?? '';
$password = $_POST['password'] ?? '';

$sql = "INSERT INTO empleados (
            nombre,
            apellido,
            usuario,
            contraseña,
            rol,
            turno,
            telefono,
            activo,
            fecha_registro
        )
        VALUES (
            ?,
            ?,
            ?,
            ?,
            'CAJERO',
            ?,
            ?,
            1,
            NOW()
        )";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "ssssss",
    $nombre,
    $apellido,
    $usuario,
    $password,
    $turno,
    $telefono
);

if (mysqli_stmt_execute($stmt)) {

    echo json_encode([
        "success" => true,
        "message" => "Cajero creado"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al crear cajero"
    ]);
}
?>