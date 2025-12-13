<?php
class CF7SA_REST_API {

    public static function register_routes() {

        register_rest_route('cf7sa/v1', '/workflows', [
            'methods'  => 'GET',
            'callback' => [self::class, 'get_workflows'],
            'permission_callback' => fn() => current_user_can('manage_options'),
        ]);

        register_rest_route('cf7sa/v1', '/workflows', [
            'methods'  => 'POST',
            'callback' => [self::class, 'create_workflow'],
            'permission_callback' => fn() => current_user_can('manage_options'),
        ]);

        register_rest_route('cf7sa/v1', '/workflows/(?P<id>\d+)', [
            'methods'  => 'PUT',
            'callback' => [self::class, 'update_workflow'],
            'permission_callback' => fn() => current_user_can('manage_options'),
        ]);

        register_rest_route('cf7sa/v1', '/workflows/(?P<id>\d+)', [
            'methods'  => 'DELETE',
            'callback' => [self::class, 'delete_workflow'],
            'permission_callback' => fn() => current_user_can('manage_options'),
        ]);

        register_rest_route('cf7sa/v1', '/run/(?P<id>\d+)', [
            'methods'  => 'POST',
            'callback' => ['CF7SA_WorkflowRunner', 'run'],
            'permission_callback' => fn() => current_user_can('manage_options'),
        ]);
    }

    public static function get_workflows() {
        global $wpdb;
        return $wpdb->get_results("SELECT * FROM {$wpdb->prefix}cf7sa_workflows ORDER BY id DESC");
    }

    public static function create_workflow($req) {
        global $wpdb;
        $data = $req->get_json_params();

        $wpdb->insert($wpdb->prefix.'cf7sa_workflows', [
            'name'          => sanitize_text_field($data['name']),
            'form_id'       => intval($data['form_id']),
            'workflow_json' => wp_json_encode($data['workflow']),
        ]);

        return ['id' => $wpdb->insert_id];
    }

    public static function update_workflow($req) {
        global $wpdb;
        $id = $req['id'];
        $data = $req->get_json_params();

        $wpdb->update(
            $wpdb->prefix.'cf7sa_workflows',
            [
                'name'          => sanitize_text_field($data['name']),
                'workflow_json' => wp_json_encode($data['workflow']),
            ],
            ['id' => $id]
        );

        return ['updated' => true];
    }

    public static function delete_workflow($req) {
        global $wpdb;
        $id = $req['id'];

        $wpdb->delete($wpdb->prefix.'cf7sa_workflows', ['id' => $id]);
        return ['deleted' => true];
    }
}
