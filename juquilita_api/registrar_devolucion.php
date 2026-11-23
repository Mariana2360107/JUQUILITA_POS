<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "error" => "No llegaron datos"
    ]);
    exit;
}

$id_ventas = $data['id_ventas'];
$id_productos = $data['id_productos'];
$cantidad = $data['cantidad'];
$motivo = $data['motivo'];
$tipo = $data['tipo'];

$sql = "INSERT INTO devoluciones (
    id_ventas,
    id_productos,
    cantidad,
    motivo,
    tipo
) VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "iiiss",
    $id_ventas,
    $id_productos,
    $cantidad,
    $motivo,
    $tipo
);

if ($stmt->execute()) {

    $sqlStock = "UPDATE productos
                 SET stock = stock + ?
                 WHERE id_producto = ?";

    $stmtStock = $conn->prepare($sqlStock);

    $stmtStock->bind_param(
        "ii",
        $cantidad,
        $id_productos
    );

    $stmtStock->execute();

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);

}