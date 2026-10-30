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
$password = $_POST['password'] ?? '';

if (empty($password)) {

    echo json_encode([
        "success" => false,
        "message" => "La contraseña está vacía"
    ]);

    exit;
}

$sql = "UPDATE empleados
        SET contraseña = ?
        WHERE id_empleado = ?";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "si",
    $password,
    $id
);

$resultado = mysqli_stmt_execute($stmt);

if ($resultado) {

    echo json_encode([
        "success" => true,
        "message" => "Contraseña actualizada"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar contraseña"
    ]);

}