<?php
namespace CF7SA;

use CF7SA\Database\MigrationRunner;

class Activator {

    public static function activate() {
        // Run all pending migrations
        MigrationRunner::run();

        // Update plugin version
        update_option('cf7sa_plugin_version', CF7SA_VERSION);
    }
}
