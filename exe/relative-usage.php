#!/usr/bin/php
<?php
/**
 * This shell is used to delegate the relative usage calculation to the external
 * Gauge class
 */

require __DIR__ . '/../../includes/class.Gauge.php';
require __DIR__ . '/../../includes/db.php';

// ..$id, $daySets, $start, $end
$id = $argv[1];
$daySets = $argv[2];
$start = $argv[3];
$end = $argv[4];

$gauge = new Gauge($db);

$stmt = $db->prepare('SELECT current FROM meters WHERE id = ?');
$stmt->execute([$id]);

$meter = $stmt->fetch();

$data = $gauge->filterArray(
    $gauge->getData($id, $start, $end),
    $daySets
);

echo $gauge->relativeValue($data, $meter['current']);

?>
