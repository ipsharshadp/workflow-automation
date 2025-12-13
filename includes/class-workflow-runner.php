<?php

class CF7SA_WorkflowRunner {

    public static function run($params) {
        $workflow_id = $params['workflow_id'];
        $payload     = $params['payload'];

        global $wpdb;

        $wf = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}cf7sa_workflows WHERE id = %d",
            $workflow_id
        ));

        if (!$wf) return;

        $flow = json_decode($wf->workflow_json, true);

        // TODO: Execute nodes → conditions → actions
        // Example:
        // foreach ($flow['nodes'] as $node) {
        //     // handle action: send email, webhook, API call, etc.
        // }

        // Log execution
        $wpdb->insert($wpdb->prefix.'cf7sa_logs', [
            'workflow_id' => $workflow_id,
            'submission_id' => 0,
            'status' => 'completed',
            'data' => wp_json_encode($payload)
        ]);

        return true;
    }
}
