<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'conexion.php';

if (!$conn) {
    die(json_encode([
        "success" => false,
        "message" => "Error de conexión"
    ]));
}

$sql = "SELECT 
            id_empleado,
            usuario,
            nombre,
            apellido,
            telefono,
            turno,
            activo,
            fecha_registro
        FROM empleados
        WHERE rol = 'CAJERO'";

$resultado = mysqli_query($conn, $sql);
$cajeros = [];

while ($fila = mysqli_fetch_assoc($resultado)) {
    $cajeros[] = [
        "id" => $fila["id_empleado"],
        "username" => $fila["usuario"],
        "nombre" => $fila["nombre"] . " " . $fila["apellido"],
        "apellido" => $fila["apellido"],
        "telefono" => $fila["telefono"],
        "turno" => $fila["turno"],
        "fechaCreacion" => $fila["fecha_registro"],
        "activo" => $fila["activo"] == 1
    ];
}
echo json_encode($cajeros);

?>