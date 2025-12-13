<?php
namespace CF7SA\Rest;

class Router {

    public static function init() {

        self::route('workflows', new WorkflowController());
        self::route('triggers', new TriggerController());
        self::route('actions', new ActionController());
    }

    private static function route($name, $controller) {

        register_rest_route('cf7sa/v1', "/$name", [
            [
                'methods'  => 'GET',
                'callback' => [$controller, 'index'],
                'permission_callback' => ['CF7SA\Middleware\Auth', 'check']
            ],
            [
                'methods'  => 'POST',
                'callback' => [$controller, 'store'],
                'permission_callback' => ['CF7SA\Middleware\VerifyNonce', 'check']
            ]
        ]);

        register_rest_route('cf7sa/v1', "/$name/(?P<id>\\d+)", [
            [
                'methods'  => 'GET',
                'callback' => [$controller, 'show'],
                'permission_callback' => ['CF7SA\Middleware\Auth', 'check']
            ],
            [
                'methods'  => 'PUT',
                'callback' => [$controller, 'update'],
                'permission_callback' => ['CF7SA\Middleware\VerifyNonce', 'check']
            ],
            [
                'methods'  => 'DELETE',
                'callback' => [$controller, 'destroy'],
                'permission_callback' => ['CF7SA\Middleware\VerifyNonce', 'check']
            ]
        ]);
    }
}
