<?php
/**
 * Plugin Name: Spotter
 * Plugin URI: #
 * Description: Landing builder
 * Version: 1.0
 * Author: Eugene Burlak
 * Author URI: https://burlakeugene.github.io
 */

// admin page
add_action('admin_menu', 'spotter_admin_menu');
function spotter_admin_menu(){
	add_menu_page( 'spotter list', 'Spotter', 'manage_options', 'spotter', 'spotter',  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQ4My4wMTMgNDgzLjAxMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDgzLjAxMyA0ODMuMDEzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBkPSJNNDc3LjA0MywyMTkuMjA1TDM3OC41NzUsNDguNjc3Yy03Ljk3NC0xMy44MDItMjIuNjgzLTIyLjI5Mi0zOC42MDctMjIuMjkySDE0My4wNDFjLTE1LjkyMywwLTMwLjYyOCw4LjQ5LTM4LjYwOCwyMi4yOTINCglMNS45NzEsMjE5LjIwNWMtNy45NjEsMTMuODAxLTcuOTYxLDMwLjc4NSwwLDQ0LjU4OGw5OC40NjIsMTcwLjU0M2M3Ljk4LDEzLjgwMiwyMi42ODUsMjIuMjkzLDM4LjYwOCwyMi4yOTNoMTk2LjkyNg0KCWMxNS45MjUsMCwzMC42MzQtOC40OTEsMzguNjA3LTIyLjI5M2w5OC40NjktMTcwLjU0M0M0ODUuMDAzLDI0OS45OSw0ODUuMDAzLDIzMy4wMDYsNDc3LjA0MywyMTkuMjA1eiIvPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=');
}

function spotter(){
	$file = plugin_dir_path( __FILE__ ) . "includes/admin.php";
	if(file_exists($file)) require $file;
}

// function spotter_item(){
// 	$file = plugin_dir_path( __FILE__ ) . "includes/item.php";
// 	if(file_exists($file)) require $file;
// }

//styles and scripts
function spotter_styles_scripts($hook) {
  wp_register_style('spotter', plugins_url('frontend/admin/dist/bundle.css'));
  wp_enqueue_style('spotter');
	wp_enqueue_script('spotter', plugins_url('spotter/frontend/admin/dist/bundle.js'), null, null, true);
}
add_action( 'admin_enqueue_scripts', 'spotter_styles_scripts' );


//db
register_activation_hook( __FILE__, 'spotter_create_db' );
function spotter_create_db() {
	global $wpdb;
	$charset_collate = $wpdb->get_charset_collate();
	$table = $wpdb->prefix . 'spotter';

	$sql = "CREATE TABLE $table (
		`id` mediumint(9) NOT NULL AUTO_INCREMENT,
		`time` varchar(255) DEFAULT '0000000000' NOT NULL,
		`title` varchar(255) NOT NULL,
		`data` longtext,
		`order` mediumint(11) NOT NULL DEFAULT 0,
		UNIQUE KEY id (id)
	) $charset_collate;";
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
}

//Page field
add_action('add_meta_boxes', 'spotter_box');
function spotter_box(){
	$screens = array( 'post', 'page' );
	add_meta_box( 'spotter-box', 'spotter', 'spotter_box_callback', $screens, 'side');
}

function spotter_box_callback( $post, $meta ){
	global $wpdb;
	$table = $wpdb->prefix . 'spotter';
	$landings = $wpdb->get_results("SELECT * FROM $table ORDER BY `order` DESC");
	wp_nonce_field( plugin_basename(__FILE__), 'myplugin_noncename' );
	$value = get_post_meta( $post->ID, 'spotter_id', 1 );
	echo '<label for="myplugin_new_field">Choose landing</label> ';
	echo '<select name="spotter_id">';
	echo '<option>None</option>';
	foreach($landings as $landing){
		echo '<option '.($landing->id == $value ? 'selected' : '').' value="'.$landing->id.'">'.$landing->title.'</option>';
	}
	echo '</select>';
}

add_action( 'save_post', 'spotter_box_save' );
function spotter_box_save( $post_id ) {
	if ( ! isset( $_POST['spotter_id'] ) )
		return;
	if ( ! wp_verify_nonce( $_POST['myplugin_noncename'], plugin_basename(__FILE__) ) )
		return;
	if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE )
		return;
	if( ! current_user_can( 'edit_post', $post_id ) )
		return;
	$my_data = sanitize_text_field( $_POST['spotter_id'] );
	update_post_meta( $post_id, 'spotter_id', $my_data );
}

//page hook
add_filter('template_include', 'spotter_load');
function spotter_load($origin) {
	$landing = get_landing();
	if($landing){
		return plugin_dir_path(__FILE__).'/templates/index.php';
	}
	else{
		return $origin;
	}
}

function get_landing(){
	global $post;
	global $wpdb;
	$table = $wpdb->prefix . 'spotter';
	$id = $post->ID;
	$id = get_metadata( 'post', $id, 'spotter_id', true );
	$landing = $wpdb->get_results("SELECT * FROM $table WHERE id=$id");
	$landing = $landing[0];
	return $landing;
}

function my_get_template_part($template, $data = array()){
  extract($data);
  require locate_template($template . '.php');
}
add_action( 'rest_api_init', function () {
	register_rest_route( 'spotter', '/items', array(
		'methods' => 'GET',
		'callback' => 'get_items',
	));
	register_rest_route( 'spotter', '/items', array(
		'methods' => 'POST',
		'callback' => 'save_items'
	));
	register_rest_route( 'spotter', '/item(?:/(?P<id>[a-zA-Z0-9-]+))?', array(
		'methods' => 'GET',
		'callback' => 'get_item',
		'args' => array(
			'id' => array(
				'default' => 312
			)
		),
	));
	register_rest_route( 'spotter', '/item/add', array(
		'methods' => 'POST',
		'callback' => 'add_item'
	));
	register_rest_route( 'spotter', '/item/edit', array(
		'methods' => 'POST',
		'callback' => 'edit_item'
	));
	register_rest_route( 'spotter', '/item/remove', array(
		'methods' => 'POST',
		'callback' => 'remove_item'
	));
});

function get_items(){
	global $wpdb;
	$table = $wpdb->prefix . 'spotter';
	$landings = $wpdb->get_results("SELECT * FROM $table ORDER BY `order` DESC");
	foreach($landings as $key => $landing){
		$posts = $wpdb->get_results("SELECT * FROM {$wpdb->postmeta} WHERE meta_key = 'spotter_id' AND  meta_value = {$landing->id}");
		$usedBy = [];
		foreach($posts as $post){
			$id = intval($post->post_id);
			$usedBy[] = array(
				'id' => $id,
				'title' => get_the_title($id),
				'link' => get_permalink($id)
			);
		}
		$landings[$key]->usedBy = $usedBy;
	}
	return $landings;
}

function get_item(WP_REST_Request $req){
	global $wpdb;
	$id = $req['id'];
	$table = $wpdb->prefix . 'spotter';
	$landing = $wpdb->get_results("SELECT * FROM $table WHERE id=$id");
	if(count($landing)) {
		$landing = $landing[0];
		return $landing;
	}
	else{
		return false;
	}
}

function add_item(WP_REST_Request $req){
	global $wpdb;
	$table = $wpdb->prefix . 'spotter';
	$item = $req['item'];
	$item = json_encode($item);
	$item = json_decode($item, true);
	$item['time'] = time();
	$landings = $wpdb->get_results("SELECT * FROM $table ORDER BY `order` DESC LIMIT 1");
	if($landings[0]){
		$order = intval($landings[0]->order);
		$item['order'] = ++$order;
	}
	$result = $wpdb->insert($table, $item);
	$response = rest_ensure_response($result);
	$response->set_status($result ? 200 : 400);
	$response->set_data($result ? 'Added success' : 'Error, can\'t add it');
	return $response;
}

function edit_item(WP_REST_Request $req){
	global $wpdb;
	$table = $wpdb->prefix . 'spotter';
	$item = $req['item'];
	$item = json_encode($item);
	$item = json_decode($item, true);
	$item['time'] = time();
	$result = $wpdb->update($table, $item, array(
		'id' => $item['id']
	));
	$response = rest_ensure_response($result);
	$response->set_status($result ? 200 : 400);
	$response->set_data($result ? 'Edited success' : 'Error, can\'t edit it');
	return $response;
}

function remove_item(WP_REST_Request $req){
	global $wpdb;
	$table = $wpdb->prefix . 'spotter';
	$id = $req['id'];
	$result = $wpdb->delete( $table, array( 'id' => $id ) );
	$response = rest_ensure_response($result);
	$response->set_status($result ? 200 : 400);
	$response->set_data($result ? 'Removed success' : 'Error, can\'t remove it');
	return $response;
}

function save_items(WP_REST_Request $req){
	global $wpdb;
	$table = $wpdb->prefix . 'spotter';
	$items = $req['items'];
	$requests = [];
	foreach($items as $item){
		$requests[] = array(
			'status' => $wpdb->update($table, array('order' => $item['order']), array('id' => $item['id'])),
			'id' => $item['id']
		);
	}
	$errors = [];
	foreach($requests as $request){
		if(!$request['status']) $errors[] = $request['id'];
	}
	$is_error = count($items) > 1 && count($errors) == count($items);
	$response = rest_ensure_response('');
	$response->set_status($is_error ? 400 : 200);
	$response->set_data($is_error ? 'Can\'t save' : 'Saved');
	return $response;
}