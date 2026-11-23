
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
        "success" => false,
        "message" => "Error de conexión"
    ]));
}

$id = $_POST['id'] ?? '';

$sql = "UPDATE productos
        SET activo = 1
        WHERE id_producto = ?
        AND stock > 0";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param($stmt, "i", $id);

$resultado = mysqli_stmt_execute($stmt);

if ($resultado && mysqli_stmt_affected_rows($stmt) > 0) {

    echo json_encode([
        "success" => true,
        "message" => "Producto activado correctamente"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "No se pudo activar el producto. Verifique que exista y tenga stock disponible."
    ]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
