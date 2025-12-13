<?php
namespace CF7SA\Database\Migrations;

class add_logs_table_2025_02_01 {

    public function up() {
        global $wpdb;

        $table = $wpdb->prefix . 'cf7sa_logs';

        $sql = "CREATE TABLE IF NOT EXISTS $table (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            workflow_id BIGINT UNSIGNED,
            event_json LONGTEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) {$wpdb->get_charset_collate()};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}
