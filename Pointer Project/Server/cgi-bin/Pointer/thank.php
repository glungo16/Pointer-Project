<?php

$thankFile = fopen("Private/thank_you.html", "r") or die("Unable to open file!");
echo fread($thankFile,filesize("Private/thank_you.html"));
fclose($thankFile);


?>