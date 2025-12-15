<?php
namespace CF7SA\Models;

class Workflow {
    protected $table;

    public function __construct() {
        global $wpdb;
        $this->table = $wpdb->prefix . 'cf7sa_workflows';
    }

    public function create($params) {
        global $wpdb;

        return $wpdb->insert($this->table, [
            'flow_id' => $params['flow_id'],
            'workflow_json' =>  json_encode($params['workflow_json']),
            'name' => $params['name'],
        ]);
    }
}
