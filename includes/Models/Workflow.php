<?php
namespace CF7SA\Models;

class Workflow extends Model {
    protected $table;

    public function __construct() {
        global $wpdb;
        $this->table = $wpdb->prefix . 'cf7sa_workflows';
    }
}
