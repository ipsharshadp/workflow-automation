<?php
namespace CF7SA\Models;

class Model {

    protected $table;

    public function find($id) {
        global $wpdb;
        return $wpdb->get_row("SELECT * FROM $this->table WHERE id = ".intval($id));
    }

    public function all() {
        global $wpdb;
        return $wpdb->get_results("SELECT * FROM $this->table ORDER BY id DESC");
    }

    public function insert($data) {
        global $wpdb;
        $wpdb->insert($this->table, $data);
        return $wpdb->insert_id;
    }

    public function update($id, $data) {
        global $wpdb;
        return $wpdb->update($this->table, $data, ['id'=>$id]);
    }

    public function delete($id) {
        global $wpdb;
        return $wpdb->delete($this->table, ['id'=>$id]);
    }
}
