<?php
namespace CF7SA\Models;

class WebhookLog {

    public static function log($uuid, $payload) {
        global $wpdb;

        $table = $wpdb->prefix . 'cf7sa_webhook_logs';

        return $wpdb->insert($table, [
            'webhook_uuid' => $uuid,
            'payload_json' => json_encode($payload)
        ]);
    }
}
