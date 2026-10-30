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
$codigo = $_POST['codigo'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$categoria = $_POST['categoria'] ?? '';
$precio = $_POST['precio'] ?? 0;
$stock = $_POST['stock'] ?? 0;

$sql = "UPDATE productos
        SET
            codigo_barras = ?,
            nombre_producto = ?,
            categoria = ?,
            precio_unitario = ?,
            stock = ?
        WHERE id_producto = ?";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "sssdii",
    $codigo,
    $nombre,
    $categoria,
    $precio,
    $stock,
    $id
);

$resultado = mysqli_stmt_execute($stmt);

if ($resultado) {

    echo json_encode([
        "success" => true,
        "message" => "Producto actualizado"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar"
    ]);
}