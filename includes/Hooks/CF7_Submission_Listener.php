<?php

namespace CF7SA\Hooks;

if (!defined('ABSPATH')) exit;

class CF7_Submission_Listener {

    public function __construct() {
        add_action('wpcf7_before_send_mail', [$this, 'capture_submission'], 10, 3);
    }

    /**
     * Capture full CF7 submission details
     */
    public function capture_submission($contact_form, &$abort, $submission) {

        if (!class_exists('\WPCF7_Submission')) {
            return;
        }

        // Get form metadata
        $form_id    = $contact_form->id();
        $form_title = $contact_form->title();

        // Get posted data (all fields)
        $data = $submission->get_posted_data();

        // Remove internal keys if needed
        unset($data['_wpcf7'], $data['_wpcf7_unit_tag'], $data['_wpcf7_container_post']);

        update_option(
            "cf7sa_contact_form_7_payload_" . $form_id,
            json_encode($data)
        );
    }

}
