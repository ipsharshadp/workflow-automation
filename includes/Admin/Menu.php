<?php
namespace CF7SA\Admin;

class Menu {

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
        echo '<div id="cf7sa-root"></div>';
    }

     public static function enqueue_assets() {
        $screen = get_current_screen();
        
        // if (!$screen || $screen->id !== 'toplevel_page_cf7-smart-automations')
        //     return;

        // --------------------
        // DEVELOPMENT MODE
        // --------------------
       if (defined('CF7SA_DEV') && CF7SA_DEV) {

            wp_enqueue_script(
                'cf7sa-vite-client',
                'http://127.0.0.1:5173/@vite/client',
                [],
                null,
                true
            );

            add_action('admin_print_footer_scripts', function () {
                echo '<script type="module" src="http://127.0.0.1:5173/src/main.jsx"></script>';
            });

            return;
        }


        // --------------------
        // PRODUCTION MODE
        // --------------------

        $js_file = CF7SA_PATH . 'build/js/app.js';
        $css_file = CF7SA_PATH . 'build/css/style.css';

        // Load JS if exists
        if (file_exists($js_file)) {
            wp_enqueue_script(
                'cf7sa-app',
                CF7SA_URL . 'build/js/app.js',
                ['wp-element'], // WordPress React
                filemtime(CF7SA_PATH . 'build/js/app.js'),
                true
            );
        }

        // Load CSS if exists
        if (file_exists($css_file)) {
            wp_enqueue_style(
                'cf7sa-style',
                CF7SA_URL . 'build/css/style.css',
                [],
                filemtime(CF7SA_PATH.'build/css/style.css')
            );
        }
    }

}
