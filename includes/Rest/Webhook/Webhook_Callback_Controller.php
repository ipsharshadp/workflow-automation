<?php
namespace CF7SA\Rest\Webhook;

use CF7SA\Models\Webhook;
use CF7SA\Models\WebhookLog;

class Webhook_Callback_Controller {

    public function register_routes() {

        register_rest_route("cf7sa/v1", "/webhooks/callback/(?P<uuid>[a-fA-F0-9\-]+)", [
            "methods"  => "POST",
            "callback" => [$this, "handle_callback"],
            "permission_callback" => "__return_true" // No-auth webhook
        ]);

        register_rest_route("cf7sa/v1/webhooks", "/listen/(?P<uuid>[a-zA-Z0-9\-]+)", [
            "methods"  => "GET",
            "callback" => [$this, "webhook_listener"],

        ]);

    }

    public function webhook_listener($request ) {
        $uuid = $request->get_param("uuid");

        $payload = get_option("cf7sa_webhook_payload_" . $uuid);

        return [
            "success" => true,
            "payload" => $payload ? json_decode($payload, true) : null
        ];
    }
    public function handle_callback($request) {

        $uuid = sanitize_text_field($request['uuid']);

        $webhook = Webhook::findByUUID($uuid);

        if (!$webhook) {
            return new \WP_REST_Response([
                "success" => false,
                "message" => "Invalid webhook"
            ], 404);
        }

        // If secret exists, require header
        // if (!empty($webhook->secret)) {

        //     $provided = $request->get_header("x-webhook-secret");

        //     if ($provided !== $webhook->secret) {
        //         return new \WP_REST_Response([
        //             "success" => false,
        //             "message" => "Unauthorized webhook access"
        //         ], 401);
        //     }
        // }

        // Log payload
        WebhookLog::log($uuid, $request->get_params());
    update_option(
        "cf7sa_webhook_payload_" . $uuid,
        json_encode($request->get_params())
    );
        // Trigger Workflow (pseudo)
        do_action("cf7sa_trigger_workflow", [
            "flow_id" => $webhook->flow_id,
            "node_id" => $webhook->node_id,
            "payload" => $request->get_params(),
        ]);

        return [
            "success" => true,
            "message" => "Webhook received",
            "flow_id" => $webhook->flow_id,
            "node_id" => $webhook->node_id
        ];
    }

    public function callback_handler( WP_REST_Request $request ) {

        $uuid = $request->get_param('uuid');
        $body = $request->get_json_params();   // The actual webhook payload

        if (!$uuid) {
            return new WP_REST_Response([
                "success" => false,
                "message" => "Missing webhook UUID"
            ], 400);
        }

        // Save the captured payload temporarily
          update_option("cf7sa_webhook_payload_" . $uuid, json_encode($body));

        return new WP_REST_Response([
            "success" => true,
            "received" => $body,
            "message" => "Webhook captured"
        ], 200);
    }

}
