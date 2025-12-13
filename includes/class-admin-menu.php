<?php 

class CF7SA_AdminMenu {

    public static function register() {
        add_menu_page(
            'CF7 Smart Automations',
            'CF7 Automations',
            'manage_options',
            'cf7-smart-automations',
            [self::class, 'render'],
            'dashicons-randomize',
            57
        );
    }

    public static function render() {
        echo '<div id="cf7sa-root" style="min-height: 600px;"></div>';
    }
}
