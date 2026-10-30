<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

$conn = mysqli_connect(
    "localhost",
    "root",
    "",
    "juquilita_puntodeventa"
);

if (!$conn) {
    die(json_encode([
        "success" => false
    ]));
}

$data = json_decode(file_get_contents("php://input"), true);

$carrito = $data["carrito"];
$total = $data["total"];
$cajero = $data["cajero"];

mysqli_begin_transaction($conn);

try {

    $folio = "V-" . time();

    $totalProductos = 0;

    foreach ($carrito as $item) {
        $totalProductos += $item["cantidad"];
    }

    $sqlVenta = "INSERT INTO ventas (
                    folio,
                    fecha_venta,
                    total_productos,
                    total_venta,
                    metodo_pago,
                    cajero
                )
                VALUES (
                    ?,
                    NOW(),
                    ?,
                    ?,
                    'Efectivo',
                    ?
                )";

    $stmtVenta = mysqli_prepare($conn, $sqlVenta);

    mysqli_stmt_bind_param(
        $stmtVenta,
        "sids",
        $folio,
        $totalProductos,
        $total,
        $cajero
    );

    mysqli_stmt_execute($stmtVenta);

    $idVenta = mysqli_insert_id($conn);

    foreach ($carrito as $item) {

        $productoId = $item["producto"]["id"];
        $cantidad = $item["cantidad"];
        $precio = $item["producto"]["precio"];
        $subtotal = $item["subtotal"];

        $sqlDetalle = "INSERT INTO detalle_ventas (
                            id_venta,
                            id_producto,
                            cantidad,
                            precio_unitario,
                            subtotal
                        )
                        VALUES (?, ?, ?, ?, ?)";

        $stmtDetalle = mysqli_prepare($conn, $sqlDetalle);

        mysqli_stmt_bind_param(
            $stmtDetalle,
            "iiidd",
            $idVenta,
            $productoId,
            $cantidad,
            $precio,
            $subtotal
        );

        mysqli_stmt_execute($stmtDetalle);

        $sqlStock = "UPDATE productos
                     SET stock = stock - ?
                     WHERE id_producto = ?";

        $stmtStock = mysqli_prepare($conn, $sqlStock);

        mysqli_stmt_bind_param(
            $stmtStock,
            "ii",
            $cantidad,
            $productoId
        );

        mysqli_stmt_execute($stmtStock);

    }

    mysqli_commit($conn);

    echo json_encode([
        "success" => true
    ]);

} catch (Exception $e) {

    mysqli_rollback($conn);

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}