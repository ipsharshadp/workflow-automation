<?php
namespace CF7SA\Rest\Webhook;

use CF7SA\Models\Webhook;

class Webhook_Create_Controller {

    public function register_routes() {

        register_rest_route("cf7sa/v1", "/webhooks/create", [
            "methods"  => "POST",
            "callback" => [$this, "create_webhook"],
            "permission_callback" => function () {
                return current_user_can("manage_options"); // Admin only OR change
            }
        ]);
    }

    public function create_webhook($request) {

        $flow_id = intval($request['flow_id']);
        $node_id = intval($request['node_id']);

        if (!$flow_id || !$node_id) {
            return new \WP_REST_Response([
                "success" => false,
                "message" => "flow_id and node_id required"
            ], 400);
        }

        // Generate UUID
        $uuid = wp_generate_uuid4();

        // Secret is optional – if user wants auth protected webhook
        $secret = wp_generate_password(32, false);

        Webhook::create($flow_id, $node_id, $secret, $uuid);

        $url = home_url("/wp-json/cf7sa/v1/webhooks/callback/$uuid");

        return [
            "success" => true,
            "uuid" => $uuid,
            "secret" => $secret,
            "webhook_url" => $url
        ];
    }
}
