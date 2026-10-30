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

$codigo = $_POST['codigo'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$categoria = $_POST['categoria'] ?? '';
$precio = $_POST['precio'] ?? 0;
$stock = $_POST['stock'] ?? 0;

$sql = "INSERT INTO productos (
            codigo_barras,
            nombre_producto,
            categoria,
            precio_unitario,
            stock,
            activo,
            fecha_registro
        )
        VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            1,
            NOW()
        )";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "sssdi",
    $codigo,
    $nombre,
    $categoria,
    $precio,
    $stock
);

$resultado = mysqli_stmt_execute($stmt);

if ($resultado) {

    echo json_encode([
        "success" => true,
        "message" => "Producto agregado"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Error al agregar producto"
    ]);
}