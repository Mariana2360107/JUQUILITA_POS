<?php

$conn = mysqli_connect(
    "localhost",
    "root",
    "",
    "juquilita_puntodeventa"
);

if(!$conn){
    die("Error de conexión: " . mysqli_connect_error());
}

?>