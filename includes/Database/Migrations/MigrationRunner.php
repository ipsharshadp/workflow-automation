<?php
namespace CF7SA\Database;

class MigrationRunner {

    private static $migrations_table = 'cf7sa_migrations';

    /**
     * Run all migrations that have not yet been executed.
     */
    public static function run() {
        global $wpdb;

        self::createMigrationsTable();

        $executed = self::getExecutedMigrations();

        $files = glob(CF7SA_PATH . 'includes/Database/Migrations/*.php');
        sort($files); // Ensure ordered execution

        foreach ($files as $file) {
            $filename = basename($file, '.php');

            // Skip if already executed
            if (in_array($filename, $executed)) {
                continue;
            }

            require_once $file;
            $className = self::convertFileToClass($filename);
            $fqcn = "CF7SA\\Database\\Migrations\\{$className}";

            if (class_exists($fqcn)) {
                (new $fqcn())->up();
                self::markExecuted($filename);
            }
        }
    }

    /**
     * Convert migration filename into valid PHP class name
     */
    private static function convertFileToClass($filename) {
        // Split by underscore
        $parts = explode('_', $filename);

        // First three parts are the date
        $date = array_slice($parts, 0, 3);

        // The rest is the name
        $name = array_slice($parts, 3);

        // Capitalize each part of name
        $name = array_map('ucfirst', $name);

        // Build class name:
        // Create_Workflows_Table_2025_01_01
        return implode('_', array_merge($name, $date));
    }

    /**
     * Create migrations table if not exists.
     */
    private static function createMigrationsTable() {
        global $wpdb;

        $table = $wpdb->prefix . self::$migrations_table;

        $sql = "CREATE TABLE IF NOT EXISTS `$table` (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            migration VARCHAR(255) NOT NULL,
            batch INT DEFAULT 1,
            migrated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) {$wpdb->get_charset_collate()};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }

    /**
     * Get list of already executed migrations
     */
    private static function getExecutedMigrations() {
        global $wpdb;
        $table = $wpdb->prefix . self::$migrations_table;
        return $wpdb->get_col("SELECT migration FROM `$table` ORDER BY id ASC");
    }

    /**
     * Save migration execution record
     */
    private static function markExecuted($migrationName) {
        global $wpdb;

        $table = $wpdb->prefix . self::$migrations_table;

        $wpdb->insert($table, [
            'migration' => $migrationName,
            'batch' => 1
        ]);
    }
}
