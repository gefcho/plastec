<?php
    // My modifications to mailer script from:
    // http://blog.teamtreehouse.com/create-ajax-contact-form
    // Added input sanitizing to prevent injection

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $name = strip_tags(trim($_POST["name"]));
				$name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);

        // Check that data was sent to the mailer.
        if ( empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Set a 400 (bad request) response code and exit.
            http_response_code(400);
            echo "К сожалению возникла проблема с Вашей отправкой. Пожалуйста, заполните форму и попробуйте снова.";
            exit;
        }

        // Set the recipient email address.
        // FIXME: Update this to your desired email address.
        $recipient = "global@expoforum.by";

        // Set the email subject.
        $subject = "У вас есть сообщение от $name";

        // Build the email content.
        $email_content = "Имя: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Сообщение:\n$message\n";

        // Build the email headers.
        $email_headers = "От: $name <$email>";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Благодарим Вас! Ваше сообщение отправлено.";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "К сожалению что-то пошло не так и Ваше сообщение не удалось отправить.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "Возникла проблема с вашей отправкой. Повторите попытку.";
    }

?>
