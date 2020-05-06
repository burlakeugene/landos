<?php
global $wpdb;
$table = $wpdb->prefix.'landos';
$post = $_POST;
$action = $post['action'];
switch ($action) {
  case 'add':
    $item = $wpdb->insert($table, array(
      'title' => $post['title'],
      'data' => $post['data'],
      'time' => date('Y-m-d H:i:s')
    ));
    break;
  case 'edit':
    $item = $wpdb->update($table, array(
      'title' => $post['title'],
      'data' => $post['data'],
      'time' => date('Y-m-d H:i:s')
    ), array(
      'id' => $post['id']
    ));
    break;
  case 'delete':
    $wpdb->delete( $table, array( 'id' => $post['id'] ) );
    break;
}
?>