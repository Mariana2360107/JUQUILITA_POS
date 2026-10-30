<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

require_once 'conexion.php';

if (!$conn) {
    die(json_encode([
        "success" => false,
        "message" => "Error de conexión"
    ]));
}

$id = $_POST['id'] ?? '';

$sql = "DELETE FROM empleados
        WHERE id_empleado = ?
        AND rol = 'CAJERO'";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "i",
    $id
);

$resultado = mysqli_stmt_execute($stmt);

if ($resultado) {

    echo json_encode([
        "success" => true,
        "message" => "Cajero eliminado"
    ]);

} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar"
    ]);

}