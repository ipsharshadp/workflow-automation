<?php
namespace CF7SA\Middleware;

class VerifyNonce {
    public static function check() {
        return wp_verify_nonce($_REQUEST['_wpnonce'] ?? '', 'wp_rest');
    }
}
