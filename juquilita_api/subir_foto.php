<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'conexion.php';

if (!isset($_POST['username'])) {
    echo json_encode([
        "success" => false,
        "error" => "Username no recibido"
    ]);
    exit;
}

$username = $_POST['username'];

if (isset($_FILES['foto'])) {

    $archivo = $_FILES['foto'];

    $nombreOriginal = $archivo['name'];

    $extension = strtolower(
        pathinfo($nombreOriginal, PATHINFO_EXTENSION)
    );

    $extensionesPermitidas = ['jpg', 'jpeg', 'png', 'webp'];

    if (!in_array($extension, $extensionesPermitidas)) {

        echo json_encode([
            "success" => false,
            "error" => "Formato no permitido"
        ]);

        exit;
    }

    $nombreNuevo = time() . "_" . $username . "." . $extension;

    $carpeta = "uploads/";

    if (!file_exists($carpeta)) {
        mkdir($carpeta, 0777, true);
    }

    $rutaDestino = $carpeta . $nombreNuevo;

    if (move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {

        $sql = "UPDATE empleados
                SET foto_perfil = ?
                WHERE nombre = ? ";

        $stmt = $conn->prepare($sql);

        $stmt->bind_param(
            "ss",
            $rutaDestino,
            $username
        );

        if ($stmt->execute()) {

            echo json_encode([
                "success" => true,
                "ruta" => $rutaDestino
            ]);

        } else {

            echo json_encode([
                "success" => false,
                "error" => $stmt->error
            ]);

        }
    } else {

        echo json_encode([
            "success" => false,
            "error" => "No se pudo mover el archivo"
        ]);

    }

} else {

    echo json_encode([
        "success" => false,
        "error" => "No se recibió archivo"
    ]);

}
