#!/usr/bin/php
<?php
/**
 * This shell is used to delegate the relative usage calculation to the external
 * Meter class
 */

require __DIR__ . '/../../includes/db.php';
require __DIR__ . '/../../includes/class.Meter.php';

// ..$id, $daySets, $start, $end
$id = $argv[1];
$daySets = $argv[2];
$start = $argv[3];
$end = $argv[4];

$meter = new Meter($db);
echo $meter->relativeValueOfMeterFromTo($id, $daySets, $start, $end);

?>
