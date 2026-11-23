<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include 'conexion.php';

$fechaInicio = $_GET['fechaInicio'] ?? '';
$fechaFin = $_GET['fechaFin'] ?? '';
if (!$fechaInicio || !$fechaFin) {
    echo json_encode([
        "success" => false,
        "message" => "Fechas incompletas"
    ]);
    exit;
}

$sqlVentasDia = "
SELECT 
    DATE(fecha_venta) as dia,
    SUM(total_venta) as total
FROM ventas
WHERE DATE(fecha_venta) BETWEEN ? AND ?
GROUP BY DATE(fecha_venta)
ORDER BY DATE(fecha_venta)
";

$stmtVentas = $conn->prepare($sqlVentasDia);
$stmtVentas->bind_param(
    "ss",
    $fechaInicio,
    $fechaFin
);
$stmtVentas->execute();
$resultVentas = $stmtVentas->get_result();
$ventasPorDia = [];
while ($row = $resultVentas->fetch_assoc()) {
    $ventasPorDia[] = [
        "dia" => date("d/m", strtotime($row['dia'])),
        "total" => (float)$row['total']
    ];
}

$sqlTotal = "
SELECT 
    SUM(total_venta) as totalVentas,
    COUNT(*) as totalRegistros
FROM ventas
WHERE DATE(fecha_venta) BETWEEN ? AND ?
";

$stmtTotal = $conn->prepare($sqlTotal);
$stmtTotal->bind_param(
    "ss",
    $fechaInicio,
    $fechaFin
);

$stmtTotal->execute();
$resultTotal = $stmtTotal->get_result();
$dataTotal = $resultTotal->fetch_assoc();
$totalVentas = (float)($dataTotal['totalVentas'] ?? 0);
$totalRegistros = (int)($dataTotal['totalRegistros'] ?? 1);
$promedioVenta = $totalVentas / max($totalRegistros, 1);

$sqlHoy = "
SELECT 
    SUM(total_venta) as ventasHoy
FROM ventas
WHERE DATE(fecha_venta) = CURDATE()
";

$resultHoy = $conn->query($sqlHoy);
$dataHoy = $resultHoy->fetch_assoc();
$ventasHoy = (float)($dataHoy['ventasHoy'] ?? 0);
$sqlProductos = "
SELECT 
    SUM(cantidad) as productosVendidos
FROM detalle_ventas
";

$resultProductos = $conn->query($sqlProductos);
$dataProductos = $resultProductos->fetch_assoc();
$productosVendidos = (int)($dataProductos['productosVendidos'] ?? 0);

echo json_encode([
    "success" => true,
    "ventasPorDia" => $ventasPorDia,
    "estadisticas" => [
        "totalVentas" => $totalVentas,
        "ventasHoy" => $ventasHoy,
        "promedioVenta" => round($promedioVenta, 2),
        "productosVendidos" => $productosVendidos
    ]
]);