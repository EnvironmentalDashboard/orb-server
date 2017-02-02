#!/usr/bin/php
<?php
/**
 * This shell is used to delegate the relative usage calculation to the external
 * Meter class
 */

require __DIR__ . '/../../includes/db.php';
require __DIR__ . '/../../includes/class.Meter.php';

// ..$id, $daySets, $sampleSize
$id = $argv[1];
$daySets = $argv[2];
$sampleSize = $argv[3];

$meter = new Meter($db);

echo $meter->relativeValueOfMeterWithPoints(null, $daySets, $sampleSize, 'hour', 0, 100, $id);

?>
