<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // collect value of input field
  $data = file_get_contents('php://input');
  $outFile = "data.txt";
  //implode("&",$_REQUEST);
  //foreach($_REQUEST as $name => $val) {
	//  $data .= "$name="
  //}
  
  
  //echo $data;
  //echo "<br>";
  //echo strlen($data);
  
  if (strlen($data) > 2000){
	// obtain output file name
	if (array_key_exists("outFile",$_REQUEST) && strlen((string) $_REQUEST["outFile"]) > 0){
	  $outFile = (string) $_REQUEST["outFile"];
	}
	//echo "$outFile<br>";
	// save the data in a file
	$dataFile = fopen("./Private/$outFile", "a") or die("Unable to open file!");
	//echo "done<br>";
	$txt = "$data\n";
	fwrite($dataFile, $txt);
	fclose($dataFile);
	// Redirect to "thank you" page
	header('Location: ./thank.php');
  }
  else {
	  // Redirect to the disqualification page
	  header('Location: ./disqualified.html');
  }
  die();
  /*
  if (empty($name)) {
    echo "Name is empty";
  } else {
    echo $name;
  }
  */
}

?>