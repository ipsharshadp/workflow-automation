<?php
namespace CF7SA\Controller;

class WebhookController {

    public function index() {
        return rest_ensure_response([
            'message' => 'Webhook received'
        ]);
    }

    public function store() {
        return rest_ensure_response([
            'message' => 'Webhook received'
        ]);
    }
}