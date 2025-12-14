<?php

namespace CF7SA\Rest\ContactForm7;

use WP_REST_Server;
use WPCF7_ContactForm;
use WP_REST_Response;

class CF7_Forms_Controller {

    public function register_routes() {
        register_rest_route('cf7sa/v1', '/contact-form-7', [
            'methods'  => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_forms'],
            "permission_callback" => "__return_true"
        ]);

        register_rest_route("cf7sa/v1/contact-form-7", "/listen/(?P<uuid>[a-zA-Z0-9\-]+)", [
            "methods"  => "GET",
            "callback" => [$this, "contact_form_7_webhook_listener"],
        ]);
    }

    public function permissions_check() {
        return current_user_can('manage_options');
    }

    public function get_forms() {
        if ( ! class_exists('WPCF7_ContactForm') ) {
            return new WP_Error(
                'cf7_not_installed',
                __('Contact Form 7 plugin is not installed or activated'),
                ['status' => 404]
            );
        }

        $forms = WPCF7_ContactForm::find();
        $formsList = [];

        foreach ($forms as $form) {
            $formsList[] = [
                'id'    => $form->id(),
                'title' => $form->title()
            ];
        }

        return new WP_REST_Response([
            "success" => true,
            "data" => $formsList,
            "message" => "Webhook captured"
        ], 200);
    }

    public function contact_form_7_webhook_listener($request ) {
        $uuid = $request->get_param("uuid");
        $payload = get_option("cf7sa_contact_form_7_payload_" . $uuid);

        return [
            "success" => true,
            "payload" => $payload ? json_decode($payload, true) : null
        ];
    }
}
