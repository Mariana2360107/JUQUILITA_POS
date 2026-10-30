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
$nombre = $_POST['nombre'];
$tipo = $_POST['tipo'];
$descuento = $_POST['descuento'];
$telefono = $_POST['telefono'];
$correo = $_POST['correo'];

$sql = "UPDATE clientes
SET nombre_cliente = ?,
    tipo_cliente = ?,
    descuento = ?,
    telefono = ?,
    correo = ?
WHERE id_cliente = ?";

$stmt = $conexion->prepare($sql);

$stmt->bind_param(
    "ssdssi",
    $nombre,
    $tipo,
    $descuento,
    $telefono,
    $correo,
    $id
);

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