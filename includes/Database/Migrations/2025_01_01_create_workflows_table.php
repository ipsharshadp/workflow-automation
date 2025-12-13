<?php
namespace CF7SA\Database\Migrations;

class create_workflows_table_2025_01_01 {

    public function up() {
        global $wpdb;
        $table = $wpdb->prefix . 'cf7sa_workflows';

        $sql = "CREATE TABLE IF NOT EXISTS $table (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            form_id BIGINT UNSIGNED,
            workflow_json LONGTEXT,
            active TINYINT DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) {$wpdb->get_charset_collate()};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}
