<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

require_once 'conexion.php';

if (!$conn) {

    die(json_encode([
        "success" => false,
        "message" => "Error de conexión"
    ]));
}

$sql = "SELECT
            id_cliente,
            nombre_cliente,
            tipo_cliente,
            descuento,
            telefono,
            correo
        FROM clientes
        WHERE activo = 1
        ORDER BY nombre_cliente ASC";

$resultado = mysqli_query($conn, $sql);

$clientes = [];

while ($fila = mysqli_fetch_assoc($resultado)) {

    $clientes[] = [

        "id" => $fila["id_cliente"],

        "nombre" => $fila["nombre_cliente"],

        "tipo" => $fila["tipo_cliente"],

        "descuento" => (float)$fila["descuento"],

        "telefono" => $fila["telefono"],

        "correo" => $fila["correo"]

    ];
}

echo json_encode($clientes);