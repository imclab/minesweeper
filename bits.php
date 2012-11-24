<?php
$referer = '/^http\:\/\/nadim.cc\/minesweeper/'; // Better than nothing
$path = 'entropy'; // Path to file containing quantum tunnelling-derived bits
$salvo = 128;

if (preg_match($referer, $_SERVER['HTTP_REFERER'])) {
	$file = fopen($path, 'r');
	$random = fread($file, filesize($path));
	fclose($file);

	print substr($random, 0, $salvo);
	$random = substr($random, $salvo);

	$file = fopen($path, 'w');
	fwrite($file, $random);
	fclose($file);
}
?>
