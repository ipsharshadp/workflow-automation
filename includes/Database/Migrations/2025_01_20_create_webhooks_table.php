<?php
namespace CF7SA\Database\Migrations;

class Create_Webhooks_Table_2025_01_20 {

    public function up() {
        global $wpdb;

        $table = $wpdb->prefix . 'cf7sa_webhooks';

        $sql = "CREATE TABLE IF NOT EXISTS `$table` (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            uuid CHAR(36) NOT NULL,
            flow_id BIGINT UNSIGNED,
            node_id BIGINT UNSIGNED,
            secret VARCHAR(255) NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id),
            UNIQUE KEY uuid (uuid)
        ) {$wpdb->get_charset_collate()};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}
