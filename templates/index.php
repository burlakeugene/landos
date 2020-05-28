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
    $landing->data = json_decode($landing->data)
  ?>
  <pre>
    <?php print_r($landing) ?>
  </pre>
  <?php wp_footer() ?>
</body>
</html>