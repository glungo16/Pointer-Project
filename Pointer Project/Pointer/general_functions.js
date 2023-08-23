//////////////// General Helper functions ////////////////////////////////////////////////////////////////////////////////////////////////

// Convert degrees to radians
function degToRad(degrees) {
  let result = degrees / 180 * Math.PI;
  return result;
}

// Convert radians to degrees
function radToDeg(degrees) {
  let result = degrees * 180 / Math.PI;
  return result;
}

// Shuffle the elements of an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//// Complex array indeces shuffler:
// maxElements = maximum number of elements in the array
// blockSize = size of the blocks that are shuffled independently (if blockSize = 10, then elements 0-9 are shuffled, then elements 10-19 elements are shuffled...)
// consecutiveElements = number of elements that need to be shuffled together such that they remain in consecutive order (if consecutiveElements = 3, 
	// then 0,1,2 ; 3,4,5; 6,7,8 ... will always be in consecutive order
function shuffleBlocks(maxElements, blockSize, consecutiveElements){
	let arr = [];
	let block = []; // shuffling block
	
	for (let i=0;i<Math.ceil(maxElements/consecutiveElements); i++){
		
		// Edge cases (terminal value)
		if (i != Math.ceil(maxElements/consecutiveElements) -1) block.push(i);
		
		if ((i+1)%Math.round(blockSize/consecutiveElements) == 0 || i == Math.ceil(maxElements/consecutiveElements) - 1){
			
			shuffle(block); // Shuffle order
			
			// Edge cases (terminal value)
			if (i == Math.ceil(maxElements/consecutiveElements) -1) block.push(i);
			
			// Block added to the array (taking in account consecutive elements)
			// Example: if block = [1,0,2]; consecutiveElements = 2, then: addingBlock = [2,3,0,1,4,5]
			let addingBlock = []; 
			
			if (maxElements%consecutiveElements == 0 || i != Math.ceil(maxElements/consecutiveElements) - 1){
				for (let b=0; b<block.length; b++){
					for (let j=0; j<consecutiveElements; j++){
						addingBlock.push(block[b]*consecutiveElements + j);
					}
				}
			}
			
			else{
				for (let b=0; b<block.length - 1; b++){
					for (let j=0; j<consecutiveElements; j++){
						addingBlock.push(block[b]*consecutiveElements + j);
					}
				}
				// take care of the end of array (edge case)
				for (let j=0; j<maxElements%consecutiveElements; j++){
					addingBlock.push(block[block.length - 1]*consecutiveElements + j);
				}
			}
			
			// Add to array the block of "maxElements" shuffled terms
			arr = arr.concat(addingBlock);
			
			block = []; // reinitialize the block (move to the next block)
			
		}
	}
	
	return arr;
}

// sort an array based on the order given by an array of indeces
// if arr = [3,5,9,1] and order = [2,1,3,0] ----> ret = [9,5,1,3]
function sortSpecificOrder(arr,order){
	
	(ret = []).length = order.length;
	
	for (let i=0;i<order.length;i++){
		ret[i] = arr[order[i]];
	}
	
	return ret;
}

// calculates the cartesian distance
function cartesian_distance(a,b){
	return Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
}

// calculates the shortest distance between a point (x0,y0) to a line passing through (x1,y1) and (x2,y2)
function shortest_distance_line(x0,y0,x1,y1,x2,y2){
	let a = y2-y1;
	let b = x1-x2;
	let c = x2*y1 - y2*x1;
	
	return Math.abs(a*x0 + b*y0 + c)/cartesian_distance(a,b);
	
}

// Get the coordinates of a point (xCor,yCor) at length "length" from the point (x0,y0), rotated around the point (x0,y0) at angle "angle" in radians
function getCoordinatesAngle(angle, length, x0, y0){ // angle = 0 -> +x direction; angle moves counter-clockwise; angle in degrees
	var xCor = x0 + length * Math.cos(angle);
	var yCor = y0 + length * Math.sin(angle);
	
	return [xCor,yCor];
}

// Makes the program pause for a specific number of ms (called with "await sleep(ms)" in async functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sleep2(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}