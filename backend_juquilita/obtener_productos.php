<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

$conn = mysqli_connect(
    "localhost",
    "root",
    "",
    "juquilita_puntodeventa");

if (!$conn) {
    die(json_encode([
        "success" => false,
        "message" => "Error de conexión"  ]));}

$sql = "SELECT
            id_producto,
            codigo_barras,
            nombre_producto,
            categoria,
            precio_unitario,
            stock
        FROM productos
        WHERE activo = 1
        ORDER BY nombre_producto";

$resultado = mysqli_query($conn, $sql);

$productos = [];

while ($fila = mysqli_fetch_assoc($resultado)) {
    $productos[] = [
        "id" => $fila["id_producto"],
        "codigo" => $fila["codigo_barras"],
        "nombre" => $fila["nombre_producto"],
        "categoria" => $fila["categoria"],
        "precio" => (float)$fila["precio_unitario"],
        "stock" => (int)$fila["stock"]   ];}

echo json_encode($productos);