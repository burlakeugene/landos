<?php
//http://codex.wordpress.org/Class_Reference/wpdb
global $wpdb;
$table = $wpdb->prefix.'landos';
$actions = plugin_dir_path( __FILE__ ) . "actions.php";
if(file_exists($actions)) require $actions;
$landings = $wpdb->get_results("SELECT * FROM $table");
?>
<div>
	<h1>Landings list</h1>
	<?php foreach($landings as $landing): ?>
		<?= $landing->id ?>
		<?= $landing->title ?>
		<a href="<?=get_admin_url()?>?page=landos-item&id=<?= $landing->id ?>">Edit</a>
		<form method="POST">
			<input type="hidden" name="id" value="<?= $landing->id ?>">
			<input type="hidden" name="action" value="delete" >
			<button>Delete</button>
		</form>
		<br />
	<?php endforeach ?>
</div>
<a href="<?=get_admin_url()?>?page=landos-item">Add</a>