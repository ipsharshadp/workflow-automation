<?php
namespace CF7SA\Database;

class MigrationRunner {

    public static function run() {
        global $wpdb;

        $migrations = glob(CF7SA_PATH.'includes/Database/Migrations/*.php');

        foreach ($migrations as $file) {
            require_once $file;
            $class = basename($file, '.php');
            $class = "CF7SA\\Database\\Migrations\\$class";

            if (class_exists($class)) {
                (new $class())->up();
            }
        }
    }
}
