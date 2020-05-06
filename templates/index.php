<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php wp_head() ?>
</head>
<body>
  <?php
    $landing = get_landing();
    print_r($landing);
  ?>
  <?php wp_footer() ?>
</body>
</html>