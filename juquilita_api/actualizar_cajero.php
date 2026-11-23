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

$id = $_POST['id'] ?? '';
$usuario = $_POST['usuario'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$turno = $_POST['turno'] ?? '';

$sql = "UPDATE empleados
        SET
            usuario = ?,
            nombre = ?,
            apellido = ?,
            telefono = ?,
            turno = ?
        WHERE id_empleado = ?";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "sssssi",
    $usuario,
    $nombre,
    $apellido,
    $telefono,
    $turno,
    $id
);

$resultado = mysqli_stmt_execute($stmt);

if ($resultado) {
    echo json_encode([
        "success" => true,
        "message" => "Cajero actualizado"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar"
    ]);
}