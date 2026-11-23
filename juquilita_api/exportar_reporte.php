<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");

include 'conexion.php';

$fechaInicio = $_GET['fechaInicio'] ?? '';
$fechaFin = $_GET['fechaFin'] ?? '';

header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=reporte_ventas.xls");

echo "REPORTE DE VENTAS\n\n";

echo "Fecha Inicio:\t$fechaInicio\n";
echo "Fecha Fin:\t$fechaFin\n\n";

echo "ID Venta\tFecha\tTotal Venta\n";

$sql = "
SELECT
    id_venta,
    fecha_venta,
    total_venta
FROM ventas
WHERE DATE(fecha_venta) BETWEEN ? AND ?
ORDER BY fecha_venta DESC
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ss",
    $fechaInicio,
    $fechaFin
);

$stmt->execute();

$resultado = $stmt->get_result();

while ($fila = $resultado->fetch_assoc()) {

    echo
        $fila['id_venta'] . "\t" .
        $fila['fecha_venta'] . "\t" .
        $fila['total_venta'] . "\n";
}