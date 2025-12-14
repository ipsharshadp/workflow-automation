<?php
namespace CF7SA\Models;

class Webhook {

    public static function create($flow_id, $node_id, $secret, $uuid) {
        global $wpdb;

        $table = $wpdb->prefix . 'cf7sa_webhooks';

        return $wpdb->insert($table, [
            'uuid' => $uuid,
            'flow_id' => $flow_id,
            'node_id' => $node_id,
            'secret' => $secret
        ]);
    }

    public static function findByUUID($uuid) {
        global $wpdb;

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}cf7sa_webhooks WHERE uuid = %s",
                $uuid
            )
        );
    }
    public static function getAll() {
        global $wpdb;

        return $wpdb->get_results(
            "SELECT * FROM {$wpdb->prefix}cf7sa_webhooks"
        );
    }
}
