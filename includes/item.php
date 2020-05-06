<?php
//http://codex.wordpress.org/Class_Reference/wpdb
global $wpdb;
$id = $_GET['id'];
$table = $wpdb->prefix.'landos';
if($id) $item = $wpdb->get_results("SELECT * FROM $table WHERE id=$id");
if($item) $item = $item[0];
?>
<form method="POST" action="<?=get_admin_url()?>?page=landos-list">
  <input type="hidden" name="action" value="<?= $item ? 'edit' : 'add' ?>">
  <input type="hidden" name="id" value="<?= $id ?>">
  <input name="title" type="text" value="<?=$item->title?>" required>
  <br />
  <?= $item->time ?>
  <br />
  <textarea name="data"><?=$item->data?></textarea>
  <br />
  <button>Save</button>
</form>
<?php if($id): ?>
<form method="POST" action="<?=get_admin_url()?>?page=landos-list">
  <input type="hidden" name="id" value="<?= $id?>">
  <input type="hidden" name="action" value="delete" >
  <button>Delete</button>
</form>
<?php endif; ?>