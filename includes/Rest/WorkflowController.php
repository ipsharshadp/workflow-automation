<?php
namespace CF7SA\Rest;

use CF7SA\Models\Workflow;

class WorkflowController {

    public function index() {
        return (new Workflow())->all();
    }

    public function store($req) {
        $data = $req->get_json_params();
        return [
            'id' => (new Workflow())->insert([
                'name' => sanitize_text_field($data['name']),
                'form_id' => intval($data['form_id']),
                'workflow_json' => wp_json_encode($data['workflow'])
            ])
        ];
    }

    public function show($req) {
        return (new Workflow())->find($req['id']);
    }

    public function update($req) {
        $data = $req->get_json_params();
        return (new Workflow())->update($req['id'], [
            'name' => sanitize_text_field($data['name']),
            'workflow_json' => wp_json_encode($data['workflow'])
        ]);
    }

    public function destroy($req) {
        return (new Workflow())->delete($req['id']);
    }
}
