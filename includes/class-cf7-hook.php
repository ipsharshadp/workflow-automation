<?php
class CF7SA_CF7_Hook {

    public static function handle_submission($contact_form) {
        global $wpdb;

        $form_id = $contact_form->id();

        $workflows = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}cf7sa_workflows WHERE form_id = %d AND active = 1",
            $form_id
        ));

        if (!$workflows) return;

        $submission = WPCF7_Submission::get_instance();
        $posted_data = $submission ? $submission->get_posted_data() : [];

        foreach ($workflows as $wf) {
            CF7SA_WorkflowRunner::run([
                'workflow_id' => $wf->id,
                'payload'     => $posted_data
            ]);
        }
    }
}
