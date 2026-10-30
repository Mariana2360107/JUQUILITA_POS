-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-10-2026 a las 18:53:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `juquilita_puntodeventa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `tipo_cliente` varchar(50) NOT NULL DEFAULT 'GENERAL',
  `descuento` decimal(5,2) DEFAULT 0.00,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre_cliente`, `tipo_cliente`, `descuento`, `telefono`, `correo`, `activo`, `fecha_registro`) VALUES
(1, 'CLIENTE GENERAL', 'GENERAL', 0.00, NULL, NULL, 1, '2026-05-21 21:54:01'),
(2, 'isabel', 'GENERAL', 4.00, '4569634578', 'isabelita@gmail.com', 0, '2026-05-21 22:39:05'),
(3, 'Mariana', 'FRECUENTE', 5.00, '2781252545', 'mariana12@gmail.com', 1, '2026-05-21 22:59:30'),
(4, 'diana', 'GENERAL', 4.00, '1234565241', 'diana12@gmail.com', 0, '2026-05-21 23:27:02'),
(5, 'Sara', 'FRECUENTE', 15.00, '2587894613', 'sara@gmail.com', 1, '2026-05-23 15:49:56'),
(6, 'DAYANA', 'FRECUENTE', 50.00, '2587896341', 'dayanani@gmail.com', 1, '2026-05-24 21:10:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `id_detalle` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`id_detalle`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(1, 3, 9, 2, 45.00, 90.00),
(2, 4, 2, 3, 8.00, 24.00),
(3, 5, 3, 3, 5.00, 15.00),
(4, 6, 7, 1, 25.00, 25.00),
(5, 6, 8, 1, 25.00, 25.00),
(6, 6, 5, 1, 6.00, 6.00),
(7, 6, 13, 1, 6.00, 6.00),
(8, 6, 12, 1, 5.00, 5.00),
(9, 7, 13, 1, 6.00, 6.00),
(10, 7, 14, 1, 5.00, 5.00),
(11, 7, 12, 4, 5.00, 20.00),
(12, 8, 9, 3, 45.00, 135.00),
(13, 8, 17, 3, 2.00, 6.00),
(14, 8, 20, 4, 7.00, 28.00),
(15, 9, 10, 6, 6.00, 36.00),
(16, 10, 5, 1, 6.00, 6.00),
(17, 10, 10, 1, 6.00, 6.00),
(18, 10, 11, 1, 6.00, 6.00),
(19, 11, 9, 2, 45.00, 90.00),
(20, 12, 7, 2, 25.00, 50.00),
(21, 12, 8, 1, 25.00, 25.00),
(22, 12, 6, 1, 50.00, 50.00),
(23, 12, 22, 1, 25.00, 25.00),
(24, 12, 19, 1, 7.00, 7.00),
(25, 13, 13, 1, 6.00, 6.00),
(26, 13, 9, 2, 45.00, 90.00),
(27, 14, 15, 4, 2.00, 8.00),
(28, 15, 22, 1, 25.00, 25.00),
(29, 15, 10, 1, 6.00, 6.00),
(30, 15, 9, 1, 45.00, 45.00),
(31, 16, 9, 1, 45.00, 45.00),
(32, 17, 7, 1, 25.00, 25.00),
(33, 17, 5, 1, 6.00, 6.00),
(34, 18, 19, 15, 7.00, 105.00),
(35, 19, 19, 8, 7.00, 56.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devoluciones`
--

CREATE TABLE `devoluciones` (
  `id_devolucion` int(11) NOT NULL,
  `id_ventas` int(11) NOT NULL,
  `id_productos` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `tipo` enum('devolucion','cambio') NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `devoluciones`
--

INSERT INTO `devoluciones` (`id_devolucion`, `id_ventas`, `id_productos`, `cantidad`, `motivo`, `tipo`, `fecha`) VALUES
(1, 10, 5, 1, 'error', 'devolucion', '2026-05-22 20:09:55'),
(2, 12, 22, 1, 'k', 'devolucion', '2026-05-23 14:49:30'),
(3, 14, 15, 1, 'Otros', 'devolucion', '2026-05-23 15:48:57'),
(4, 15, 9, 1, 'DEVOLUCION', 'devolucion', '2026-05-24 21:13:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id_empleado` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `usuario` varchar(50) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('ADMINISTRADOR','CAJERO') DEFAULT 'CAJERO',
  `turno` enum('MATUTINO','VESPERTINO','MIXTO') DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `foto_perfil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id_empleado`, `nombre`, `apellido`, `usuario`, `contraseña`, `rol`, `turno`, `telefono`, `activo`, `fecha_registro`, `foto_perfil`) VALUES
(1, 'Mariana', 'Ixtacua', 'admin', 'admin1904', 'ADMINISTRADOR', 'MATUTINO', '2721899725', 1, '2026-05-15 23:16:37', 'uploads/1779547546_Mariana.jpg'),
(2, 'Isabel', 'Perez', 'caja1', 'caja12367', 'CAJERO', 'VESPERTINO', '2721587890', 1, '2026-05-15 23:16:37', NULL),
(6, 'Diana', 'Laura', 'caja4', 'caja4321', 'CAJERO', 'VESPERTINO', '2341236789', 1, '2026-05-21 01:29:54', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `codigo_barras` varchar(50) NOT NULL,
  `nombre_producto` varchar(150) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `categoria` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `codigo_barras`, `nombre_producto`, `precio_unitario`, `stock`, `categoria`, `activo`, `fecha_registro`) VALUES
(1, '250100000001', 'Cuaderno Rayas 100h Smart', 45.00, 45, 'Papeleria', 1, '2026-05-15 23:13:37'),
(2, '250100000002', 'Lapiz 2HB Maped', 8.00, 97, 'Utiles', 1, '2026-05-15 23:13:37'),
(3, '250100000003', 'Sacapunta Plastico Smarty', 5.00, 47, 'Utiles', 0, '2026-05-15 23:13:37'),
(4, '250100000004', 'Goma Borrador Pelikan 2N', 3.00, 30, 'Utiles', 0, '2026-05-15 23:13:37'),
(5, '250100000005', 'Lapicero Negro Fino PintPoint', 6.00, 23, 'Utiles', 1, '2026-05-15 23:13:37'),
(6, '250100000006', 'Libreta Rayas 100h Smart', 50.00, 99, 'Papeleria', 1, '2026-05-15 23:13:37'),
(7, '250100000007', 'Cuaderno Cuadro 50h Smart', 25.00, 46, 'Papeleria', 1, '2026-05-15 23:47:01'),
(8, '250100000008', 'Cuaderno Raya 50h Smart', 25.00, 48, 'Papeleria', 1, '2026-05-15 23:47:01'),
(9, '250100000009', 'Cuaderno Cuadro 100h Smart', 45.00, 40, 'Papeleria', 1, '2026-05-15 23:47:01'),
(10, '250100000010', 'Lapicero Azul Fino PinPoint', 6.00, 22, 'Utiles', 1, '2026-05-15 23:47:01'),
(11, '250100000011', 'Lapicero Rojo Fino PinPoint', 6.00, 24, 'Utiles', 0, '2026-05-15 23:47:01'),
(12, '250100000012', 'Lapicero Negro Grueso Azor', 5.00, 25, 'Utiles', 1, '2026-05-15 23:47:01'),
(13, '250100000013', 'Lapicero Azul Grueso Pint Point', 6.00, 27, 'Lapiceros', 0, '2026-05-15 23:47:01'),
(14, '250100000014', 'Lapicero Rojo Grueso Azor', 5.00, 29, 'Utiles', 0, '2026-05-15 23:47:01'),
(15, '250100000015', 'Papel China Blanco', 2.00, 97, 'Papeleria', 0, '2026-05-15 23:47:01'),
(16, '250100000016', 'Papel China Rojo', 2.00, 100, 'Papeleria', 0, '2026-05-15 23:47:01'),
(17, '250100000017', 'Papel China Verde', 2.00, 97, 'Papeleria', 1, '2026-05-15 23:47:01'),
(18, '250100000018', 'Papel Crepe Blanco', 7.00, 20, 'Papeleria', 1, '2026-05-15 23:47:01'),
(19, '250100000019', 'Papel Crepe Rojo', 7.00, -4, 'Papeleria', 1, '2026-05-15 23:47:01'),
(20, '250100000020', 'Papel Crepe Verde', 7.00, 16, 'Papeleria', 0, '2026-05-15 23:47:01'),
(21, '2501000000021', 'Acuarelas Smart Eco Sencilla 20p', 30.00, 50, 'Arte', 0, '2026-05-21 19:31:56'),
(22, '2501000000022', 'Arcilla modeable', 25.00, 49, 'plastilina', 0, '2026-05-23 14:43:52'),
(23, '2501000000025', 'Lapicera Disney Eco', 35.00, 20, 'Utiles', 1, '2026-05-24 20:59:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `folio` varchar(30) NOT NULL,
  `fecha_venta` datetime DEFAULT current_timestamp(),
  `total_productos` int(11) NOT NULL,
  `total_venta` decimal(10,2) NOT NULL,
  `metodo_pago` enum('EFECTIVO','TARJETA','TRANSFERENCIA') DEFAULT 'EFECTIVO',
  `cajero` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id_venta`, `folio`, `fecha_venta`, `total_productos`, `total_venta`, `metodo_pago`, `cajero`) VALUES
(3, 'V-1779398388', '2026-05-21 15:19:48', 2, 90.00, 'EFECTIVO', 'Isabel'),
(4, 'V-1779398408', '2026-05-21 15:20:08', 3, 24.00, 'EFECTIVO', 'Isabel'),
(5, 'V-1779398513', '2026-05-21 15:21:53', 3, 15.00, 'EFECTIVO', 'Isabel'),
(6, 'V-1779398958', '2026-05-21 15:29:18', 5, 67.00, 'EFECTIVO', 'Isabel'),
(7, 'V-1779398972', '2026-05-21 15:29:32', 6, 31.00, 'EFECTIVO', 'Isabel'),
(8, 'V-1779398988', '2026-05-21 15:29:48', 10, 169.00, 'EFECTIVO', 'Isabel'),
(9, 'V-1779399334', '2026-05-21 15:35:34', 6, 36.00, 'EFECTIVO', 'Diana'),
(10, 'V-1779480569', '2026-05-22 14:09:29', 3, 18.00, 'EFECTIVO', 'Mariana'),
(11, 'V-1779547613', '2026-05-23 08:46:53', 2, 90.00, 'EFECTIVO', 'Mariana'),
(12, 'V-1779547711', '2026-05-23 08:48:31', 6, 157.00, 'EFECTIVO', 'Diana'),
(13, 'V-1779551108', '2026-05-23 09:45:08', 3, 96.00, 'EFECTIVO', 'Diana'),
(14, 'V-1779551287', '2026-05-23 09:48:07', 4, 8.00, 'EFECTIVO', 'Diana'),
(15, 'V-1779653561', '2026-05-24 14:12:41', 3, 76.00, 'EFECTIVO', 'Mariana'),
(16, 'V-1788998119', '2026-09-09 17:55:19', 1, 45.00, 'EFECTIVO', 'Mariana'),
(17, 'V-1788998221', '2026-09-09 17:57:01', 2, 31.00, 'EFECTIVO', 'Diana'),
(18, 'V-1792619058', '2026-10-21 15:44:18', 15, 105.00, 'EFECTIVO', 'Diana'),
(19, 'V-1792619110', '2026-10-21 15:45:10', 8, 56.00, 'EFECTIVO', 'Diana');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD PRIMARY KEY (`id_devolucion`),
  ADD KEY `id_ventas` (`id_ventas`),
  ADD KEY `id_productos` (`id_productos`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id_empleado`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `codigo_barras` (`codigo_barras`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD UNIQUE KEY `folio` (`folio`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  MODIFY `id_devolucion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id_empleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD CONSTRAINT `devoluciones_ibfk_1` FOREIGN KEY (`id_ventas`) REFERENCES `ventas` (`id_venta`),
  ADD CONSTRAINT `devoluciones_ibfk_2` FOREIGN KEY (`id_productos`) REFERENCES `productos` (`id_producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
