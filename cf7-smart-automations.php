<?php
/**
 * Plugin Name: CF7 Smart Automations
 * Description: Workflow automation engine for Contact Form 7.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

define('CF7SA_VERSION', '1.1.0');  
define('CF7SA_DB_VERSION', '1.0.0');  // 🔥 DB version here
define('CF7SA_PATH', plugin_dir_path(__FILE__));
define('CF7SA_URL',  plugin_dir_url(__FILE__));

require_once CF7SA_PATH . 'includes/Helpers.php';

// Autoload all includes/**
CF7SA\Helpers::autoload_includes();

register_activation_hook(__FILE__, ['CF7SA\Database\MigrationRunner', 'run']);

// Load admin
add_action('admin_menu', ['CF7SA\Admin\Menu', 'register']);
add_action('admin_enqueue_scripts', ['CF7SA\Admin\Menu', 'enqueue_assets']);

// REST API router
add_action('rest_api_init', ['CF7SA\Route\Router', 'init']);

