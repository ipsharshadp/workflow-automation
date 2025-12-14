<?php
namespace CF7SA\Database\Migrations;

class Create_Webhook_Logs_Table_2025_01_20 {

    public function up() {
        global $wpdb;

        $table = $wpdb->prefix . 'cf7sa_webhook_logs';

        $sql = "CREATE TABLE IF NOT EXISTS `$table` (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            webhook_uuid CHAR(36) NOT NULL,
            payload_json LONGTEXT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id),
            KEY webhook_uuid (webhook_uuid)
        ) {$wpdb->get_charset_collate()};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}
