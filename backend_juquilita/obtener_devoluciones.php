<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'conexion.php';

$sql = "SELECT 
            d.id_devolucion,
            d.id_ventas,
            d.fecha,
            p.nombre_producto,
            d.cantidad,
            d.motivo,
            d.tipo
        FROM devoluciones d
        INNER JOIN productos p
        ON d.id_productos = p.id_producto
        ORDER BY d.fecha DESC";

$resultado = $conn->query($sql);

$devoluciones = [];

while($fila = $resultado->fetch_assoc()) {

    $devoluciones[] = [
        "id" => $fila["id_devolucion"],
        "ventaId" => $fila["id_ventas"],
        "fecha" => $fila["fecha"],
        "producto" => $fila["nombre_producto"],
        "cantidad" => $fila["cantidad"],
        "motivo" => $fila["motivo"],
        "tipo" => $fila["tipo"]
    ];

}

echo json_encode($devoluciones);