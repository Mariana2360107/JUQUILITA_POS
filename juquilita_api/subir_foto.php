<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include 'conexion.php';

if (!isset($_POST['username']) || !isset($_POST['foto'])) {
    echo json_encode(["success" => false, "error" => "Usuario o foto no recibidos"]);
    exit;
}


$username = $_POST['username'];
$foto = basename($_POST['foto']);
$fotosPermitidas = ['perfil1.jpg', 'perfil2.jpg', 'perfil3.jpg', 'perfil4.jpg', 'perfil5.jpg'];

if (!in_array($foto, $fotosPermitidas, true)) {
    echo json_encode(["success" => false, "error" => "Foto no permitida"]);
    exit;
}

$rutaDestino = 'img/' . $foto;
$sql = "UPDATE empleados SET foto_perfil = ? WHERE nombre = ? OR usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $rutaDestino, $username, $username);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "ruta" => $rutaDestino]);
} else {
    echo json_encode([
        "success" => false,
        "error" => $stmt->error ?: "Usuario no encontrado"
    ]);
}
