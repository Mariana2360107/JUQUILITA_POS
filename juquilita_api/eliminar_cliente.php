<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conexion = new mysqli("localhost", "root", "", "juquilita_puntodeventa");

if ($conexion->connect_error) {

    die(json_encode([
        "success" => false,
        "error" => $conexion->connect_error
    ]));

}

$id = $_POST['id'];

$sql = "UPDATE clientes
SET activo = 0
WHERE id_cliente = ?";

$stmt = $conexion->prepare($sql);

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conexion->close();

?>