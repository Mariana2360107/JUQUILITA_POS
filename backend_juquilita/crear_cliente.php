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

$nombre = $_POST['nombre'] ?? '';
$tipo = $_POST['tipo'] ?? 'GENERAL';
$descuento = $_POST['descuento'] ?? 0;
$telefono = $_POST['telefono'] ?? '';
$correo = $_POST['correo'] ?? '';

$sql = "INSERT INTO clientes (

            nombre_cliente,
            tipo_cliente,
            descuento,
            telefono,
            correo

        )
        VALUES (?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "ssdss",
    $nombre,
    $tipo,
    $descuento,
    $telefono,
    $correo
);

$resultado = mysqli_stmt_execute($stmt);

if ($resultado) {

    echo json_encode([
        "success" => true,
        "message" => "Cliente creado"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Error al crear cliente"
    ]);
}