<?php
namespace CF7SA;

class Helpers {

    public static function autoload_includes() {
        $dir = CF7SA_PATH . 'includes/';
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir)
        );

        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'php') {
                require_once $file->getRealPath();
            }
        }
    }

}
