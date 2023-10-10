<?php
// auth0-login.php

$auth0ClientId = "qc5Lac6ghJhjt6me1bi5dTvvSFDqlcnL";
$authorizationEndpoint = "https://dev-psw7nj5r7hp6q2lc.us.auth0.com/authorize";
$redirectUri = "http://localhost:19006/callback.php"; // Change this to the location of your callback PHP script

// Construct the Auth0 URL
$authUrl = $authorizationEndpoint . "?" .
    "client_id=" . $auth0ClientId . "&" .
    "response_type=id_token&" .
    "scope=openid profile email&" .
    "redirect_uri=" . $redirectUri . "&" .
    "nonce=nonce";

// Redirect the user to the Auth0 login page
header("Location: " . $authUrl);
exit;
?>