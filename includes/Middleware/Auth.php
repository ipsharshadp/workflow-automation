<?php
namespace CF7SA\Middleware;

class Auth {
    public static function check() {
        return current_user_can('manage_options');
    }
}
