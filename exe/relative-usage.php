#!/usr/bin/php
<?php
/**
 * This shell is used to delegate the relative usage calculation to the external
 * Meter class
 */

require __DIR__ . '/../../includes/db.php';
require __DIR__ . '/../../includes/class.Meter.php';

// ..$id, $daySets, $start, $end
$id = 388;//$argv[1];
$daySets = '[1,2,3,4,5,6,7]';//$argv[2];
$start = strtotime('-2 weeks');//$argv[3];
$end = time();//$argv[4];

$meter = new Meter($db);
echo $meter->relativeValueOfMeterFromTo($id, $daySets, $start, $end);

?>
