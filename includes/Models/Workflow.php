<?php
namespace CF7SA\Models;

class Workflow {
    protected $table;

    public function __construct() {
        global $wpdb;
        $this->table = $wpdb->prefix . 'cf7sa_workflows';
    }

    public function create($flow_id, $workflow_json) {
        global $wpdb;

        return $wpdb->insert($this->table, [
            'flow_id' => $flow_id,
            'workflow_json' => $workflow_json,
        ]);
    }
}
