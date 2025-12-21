<?php

header('Content-Type: application/json; charset=utf-8');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'message' => 'Método no permitido'
    ]);
    exit;
}

// Helper simple para obtener y sanear campos
function field($key) {
    return isset($_POST[$key]) ? trim($_POST[$key]) : '';
}

$name     = field('name');
$email    = field('email');
$business = field('business');
$message  = field('message');

// Validaciones básicas en backend (nunca confiar solo en el front)
if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => 'Faltan datos obligatorios.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => 'Email inválido.'
    ]);
    exit;
}

$to      = 'contacto.nexod@gmail.com';
$subject = 'Nuevo mensaje desde el formulario de NexoDigital';

// Evitar header injection en el email
$safe_name     = str_replace(["\r", "\n"], [' ', ' '], $name);
$safe_email    = str_replace(["\r", "\n"], [' ', ' '], $email);
$safe_business = str_replace(["\r", "\n"], [' ', ' '], $business);

$body  = "Nuevo mensaje desde el formulario de NexoDigital:\n\n";
$body .= "Nombre: " . $safe_name . "\n";
$body .= "Email: " . $safe_email . "\n";
$body .= "Tipo de negocio: " . ($safe_business ?: 'No especificado') . "\n\n";
$body .= "Mensaje:\n" . $message . "\n";

$fromEmail = 'contacto@nexo-digital.tech'; 

$headers  = "From: NexoDigital <" . $fromEmail . ">\r\n";
$headers .= "Reply-To: " . $safe_name . " <" . $safe_email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Intentar enviar
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode([
        'ok' => true,
        'message' => 'Mensaje enviado correctamente.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'No se pudo enviar el email. Revisar configuración del servidor.'
    ]);
}
