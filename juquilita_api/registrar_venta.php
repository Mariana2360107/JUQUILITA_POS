<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
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
    // Obtener la cantidad del producto actual
    $cantidad = $item["cantidad"] ?? null;
    // Validar que sea un número entero positivo
    if (
        !is_numeric($cantidad) ||
        (int)$cantidad != $cantidad ||
        $cantidad <= 0
    ) {
        throw new Exception("La cantidad solicitada no es válida.");
    }
    // Acumular el total de productos
    $totalProductos += (int)$cantidad;
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
             WHERE id_producto = ?
             AND stock >= ?
             AND activo = 1";
$stmtStock = mysqli_prepare($conn, $sqlStock);
    mysqli_stmt_bind_param(
       $stmtStock,
       "iii",
       $cantidad,
       $productoId,
       $cantidad
    );
 
    mysqli_stmt_execute($stmtStock);
// Si no se actualizó exactamente un producto,
// significa que no hay stock suficiente o no está activo.
    if (mysqli_stmt_affected_rows($stmtStock) !== 1) {
         throw new Exception(
            "Stock insuficiente o producto no disponible. Verifica las existencias." );}

            // Si el stock llegó a cero, desactivar el producto.
    $sqlDesactivar = "UPDATE productos
                  SET activo = 0
                  WHERE id_producto = ?
                  AND stock = 0";
    $stmtDesactivar = mysqli_prepare($conn, $sqlDesactivar);
    mysqli_stmt_bind_param(
      $stmtDesactivar,
      "i",
     $productoId
    );

mysqli_stmt_execute($stmtDesactivar);
    }

    mysqli_commit($conn);
    echo json_encode([
        "success" => true
    ]);

} catch (Throwable $e) {
    mysqli_rollback($conn);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}