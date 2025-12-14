<?php

namespace CF7SA\Flow;

use WP_REST_Server;
use WP_REST_Response;
use CF7SA\Models\Workflow;

class Workflow_Controller {

    public function register_routes() {
        register_rest_route('cf7sa/v1', '/workflow/save', [
            'methods'  => WP_REST_Server::CREATABLE,
            'callback' => [$this, 'save_workflow'],
            "permission_callback" => "__return_true"
        ]);
    }

    public function save_workflow($request) {
        $params = $request->get_params();

        $workflow = new Workflow();
        $workflow->create($params['flow_id'], $params['workflow_json']);

        return new WP_REST_Response([
            "success" => true,
            "message" => "Workflow saved successfully"
        ], 200);
    }
}
