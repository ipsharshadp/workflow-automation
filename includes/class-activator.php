<?php 

class CF7SA_Activator {
    public static function activate() {
        global $wpdb;

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $charset = $wpdb->get_charset_collate();

        $workflow_table = $wpdb->prefix . 'cf7sa_workflows';
        $log_table = $wpdb->prefix . 'cf7sa_logs';

        $sql1 = "CREATE TABLE $workflow_table (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            form_id BIGINT UNSIGNED,
            workflow_json LONGTEXT,
            active TINYINT DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) $charset;";

        $sql2 = "CREATE TABLE $log_table (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            workflow_id BIGINT UNSIGNED,
            submission_id BIGINT UNSIGNED,
            status VARCHAR(20),
            data LONGTEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) $charset;";

        dbDelta($sql1);
        dbDelta($sql2);
    }
}
