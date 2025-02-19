<?php
    // Establecer los encabezados para la respuesta JSON
    header('Content-Type: application/json');

    // Verificar si el parámetro 'INDICADOR' está presente y es igual a 'GDDATO'
    if (isset($_GET['INDICADOR']) && $_GET['INDICADOR'] === 'GDDATO') {
        // Concatenar la URL con el valor de GDTOS
        $url = 'https://caroasociados.pe/Seguridad/GrupoDato/Index?handler=ObtenerAll&GDTOS=' . $_GET['GDTOS'];

        // Inicializar cURL
        $ch = curl_init($url);

        // Configurar cURL para obtener la respuesta
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        // Ejecutar la solicitud cURL
        $response = curl_exec($ch);

        // Verificar si hay errores en la solicitud cURL
        if (curl_errno($ch)) {
            // Si hay error, devolver un mensaje de error en formato JSON
            echo json_encode(array('error' => 'Error en la solicitud: ' . curl_error($ch)));
            exit();
        }

        // Cerrar la sesión cURL
        curl_close($ch);

        // Devolver la respuesta obtenida en formato JSON
        echo $response;
    } else {
        // Si el parámetro no es válido, devolver un mensaje de error en formato JSON
        echo json_encode(array('error' => 'Parámetro INDICADOR no encontrado o no válido'));
    }
?>
