<?php
/**
 * Plugin Name: Landos
 * Plugin URI: #
 * Description: Landing builder
 * Version: 1.0
 * Author: Eugene Burlak
 * Author URI: https://burlakeugene.github.io
 */

// admin page
add_action('admin_menu', 'landos_admin_menu');
function landos_admin_menu(){
	add_menu_page( 'Landos list', 'Landos', 'manage_options', 'landos-list', 'landos_list',  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQ4My4wMTMgNDgzLjAxMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDgzLjAxMyA0ODMuMDEzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBkPSJNNDc3LjA0MywyMTkuMjA1TDM3OC41NzUsNDguNjc3Yy03Ljk3NC0xMy44MDItMjIuNjgzLTIyLjI5Mi0zOC42MDctMjIuMjkySDE0My4wNDFjLTE1LjkyMywwLTMwLjYyOCw4LjQ5LTM4LjYwOCwyMi4yOTINCglMNS45NzEsMjE5LjIwNWMtNy45NjEsMTMuODAxLTcuOTYxLDMwLjc4NSwwLDQ0LjU4OGw5OC40NjIsMTcwLjU0M2M3Ljk4LDEzLjgwMiwyMi42ODUsMjIuMjkzLDM4LjYwOCwyMi4yOTNoMTk2LjkyNg0KCWMxNS45MjUsMCwzMC42MzQtOC40OTEsMzguNjA3LTIyLjI5M2w5OC40NjktMTcwLjU0M0M0ODUuMDAzLDI0OS45OSw0ODUuMDAzLDIzMy4wMDYsNDc3LjA0MywyMTkuMjA1eiIvPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=');
	add_submenu_page( null, 'Landos Add', 'Add', 'manage_options', 'landos-item', 'landos_item' );
}

function landos_list(){
	$file = plugin_dir_path( __FILE__ ) . "includes/list.php";
	if(file_exists($file)) require $file;
}

function landos_item(){
	$file = plugin_dir_path( __FILE__ ) . "includes/item.php";
	if(file_exists($file)) require $file;
}

//styles and scripts
function landos_styles_scripts($hook) {
  wp_register_style('landos', plugins_url('landos/frontend/dist/css/bundle.css'));
  wp_enqueue_style('landos');
  wp_enqueue_script('landos', plugins_url('frontend/dist/js/bundle.js', __FILE__ ), array('jquery'));
}
add_action( 'admin_enqueue_scripts', 'landos_styles_scripts' );


//db
register_activation_hook( __FILE__, 'landos_create_db' );
function landos_create_db() {
	global $wpdb;
	$charset_collate = $wpdb->get_charset_collate();
	$table = $wpdb->prefix . 'landos';

	$sql = "CREATE TABLE $table (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
		title varchar(255) NOT NULL,
		data longtext,
		UNIQUE KEY id (id)
	) $charset_collate;";

	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
}

//Page field
add_action('add_meta_boxes', 'landos_box');
function landos_box(){
	$screens = array( 'post', 'page' );
	add_meta_box( 'landos', 'Landos', 'landos_box_callback', $screens, 'side');
}

function landos_box_callback( $post, $meta ){
	global $wpdb;
	$table = $wpdb->prefix . 'landos';
	$landings = $wpdb->get_results("SELECT * FROM $table");
	wp_nonce_field( plugin_basename(__FILE__), 'myplugin_noncename' );
	$value = get_post_meta( $post->ID, 'landos_id', 1 );
	echo '<label for="myplugin_new_field">Choose landing</label> ';
	echo '<select name="landos_id">';
	echo '<option>None</option>';
	foreach($landings as $landing){
		echo '<option '.($landing->id == $value ? 'selected' : '').' value="'.$landing->id.'">'.$landing->title.'</option>';
	}
	echo '</select>';
}

add_action( 'save_post', 'landos_box_save' );
function landos_box_save( $post_id ) {
	if ( ! isset( $_POST['landos_id'] ) )
		return;
	if ( ! wp_verify_nonce( $_POST['myplugin_noncename'], plugin_basename(__FILE__) ) )
		return;
	if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE )
		return;
	if( ! current_user_can( 'edit_post', $post_id ) )
		return;
	$my_data = sanitize_text_field( $_POST['landos_id'] );
	update_post_meta( $post_id, 'landos_id', $my_data );
}

//page hook
add_filter('template_include', 'landos_load');
function landos_load($origin) {
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
	$table = $wpdb->prefix . 'landos';
	$id = $post->ID;
	$id = get_metadata( 'post', $id, 'landos_id', true );
	$landing = $wpdb->get_results("SELECT * FROM $table WHERE id=$id");
	$landing = $landing[0];
	return $landing;
}

function my_get_template_part($template, $data = array()){
  extract($data);
  require locate_template($template . '.php');
}