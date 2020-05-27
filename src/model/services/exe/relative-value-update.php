<?php

/**
 * This file tightly couples the application to other out-of-scope dependencies
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$ids = json_decode($argv[1]);

$in = str_repeat('?, ', count($ids) - 1) . '?';

require '../../../../db.php';
require '../../../../class.Meter.php';

$query = 'SELECT relative_values.*, meters.current, meters.id AS meter_id
FROM relative_values
INNER JOIN meters ON meters.bos_uuid = relative_values.meter_uuid
WHERE relative_values.id IN ('. $in .')';

$stmt = $db->prepare($query);
$stmt->execute($ids);

$meter = new Meter($db);

while($row = $stmt->fetch()) {
    $meter->updateRelativeValueOfMeter($row['meter_id'], $row['grouping'], $row['id'], $row['current']);
}
