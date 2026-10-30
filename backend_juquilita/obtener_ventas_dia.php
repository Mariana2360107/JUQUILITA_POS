<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

require_once 'conexion.php';

if (!$conn) {

    die(json_encode([
        "success" => false
    ]));
}

$sql = "SELECT
            id_venta,
            fecha_venta,
            total_productos,
            total_venta
        FROM ventas
        WHERE DATE(fecha_venta) = CURDATE()
        ORDER BY fecha_venta DESC";

$resultado = mysqli_query($conn, $sql);

$ventas = [];

while ($fila = mysqli_fetch_assoc($resultado)) {

    $ventas[] = [

        "id" => $fila["id_venta"],

        "fecha" => date(
            "Y-m-d",
            strtotime($fila["fecha_venta"])
        ),

        "hora" => date(
            "H:i",
            strtotime($fila["fecha_venta"])
        ),

        "items" => (int)$fila["total_productos"],

        "total" => (float)$fila["total_venta"]

    ];
}

echo json_encode($ventas);