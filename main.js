//
// DRAWING THE POLYGON AND IT'S DIVISIONS
//

// get canvas for painting
var canvas = document.getElementById( "mathCanvas" );
var canvasContext = canvas.getContext( "2d" );

// declare/get initial polygon variables
var polygonRadius = 250,
   Xcenter = 300,
   Ycenter = 300,
   numberOfSides = prompt( "Number of Sides for Polygon: " ),
   numberOfDivs = prompt( "Number of Divisions for Polygon side: " );

// fill canvas background with orange
canvasContext.fillStyle = "orange";
canvasContext.fillRect( 0, 0, canvas.width, canvas.height );

// begin drawing of polygon path
canvasContext.beginPath();

// set polygon center as path starting point
canvasContext.moveTo( Xcenter + polygonRadius * Math.cos( 0 ), Ycenter + polygonRadius * Math.sin( 0 ) );

// variable for storing the position of polygon corners
var corners = [];

// draw polygon sides path from corner to corner
for ( var i = 1; i <= numberOfSides; i += 1 ) {

   // define position of corner
   var x = Xcenter + polygonRadius * Math.cos( i * 2 * Math.PI / numberOfSides ),
      y = Ycenter + polygonRadius * Math.sin( i * 2 * Math.PI / numberOfSides );

   // draw line to corner;
   canvasContext.lineTo( x, y );

   // insert new point with position in corners array
   corners.push( {
      x: x,
      y: y
   } );

}

// end of drawing polygon path
canvasContext.closePath();

// fill polygon path interior with white
canvasContext.fillStyle = '#FFFFFF';
canvasContext.fill();

// draw black polygon sides based on path
canvasContext.lineWidth = 1;
canvasContext.strokeStyle = 'black';
canvasContext.stroke();

// begin drawing path of polygon divisons
canvasContext.beginPath();

// define division variables (for storing array and point positions)
var divisionPosX, divisionPosY, sectionPoints = [];

// polygon side division path drawing
// i = corner id
for ( var j = 1; j < numberOfDivs; j += 1 ) {

   // j = current division (first, second, ...)
   for ( var i = 1; i <= numberOfSides; i += 1 ) {

      // define divison point position
      if ( i < numberOfSides ) {
         divisionPosY = corners[ i - 1 ].y + ( corners[ i ].y - corners[ i - 1 ].y ) * j / numberOfDivs;
         divisionPosX = corners[ i - 1 ].x + ( corners[ i ].x - corners[ i - 1 ].x ) * j / numberOfDivs;
      }
      if ( i == numberOfSides ) {
         divisionPosY = corners[ i - 1 ].y + ( corners[ 0 ].y - corners[ i - 1 ].y ) * j / numberOfDivs;
         divisionPosX = corners[ i - 1 ].x + ( corners[ 0 ].x - corners[ i - 1 ].x ) * j / numberOfDivs;
      }

      // push point into array
      sectionPoints.push( {
         x: divisionPosX,
         y: divisionPosY
      } );

   }

   // draw division path based on stored positions
   canvasContext.moveTo( sectionPoints[ 0 ].x, sectionPoints[ 0 ].y );
   for ( var i = 1; i <= numberOfSides; i += 1 ) {
      if ( i < numberOfSides ) {
         canvasContext.lineTo( sectionPoints[ i ].x, sectionPoints[ i ].y );
      }
      if ( i == numberOfSides ) {
         canvasContext.lineTo( sectionPoints[ 0 ].x, sectionPoints[ 0 ].y );
      }
   }

   // empty array for new set of points
   sectionPoints = [];

}

// draw black lines based on path
canvasContext.closePath();
canvasContext.strokeStyle = "#000000";
canvasContext.lineWidth = 1;
canvasContext.stroke();

//
// SETTING UP EXPERIMENTAL VALIDATION
//

// get data of all pixelArrays in canvas
var imageData = canvasContext.getImageData( 0, 0, canvas.width, canvas.height );
var pixelArray = imageData.data;
var numberOfPixels = pixelArray.length;

// THEORY
// each pixel has a red, green, blue and alpha(transparency) property
// these properties are stored as elements of the array in this order
// red had id 0, green 1, blue 2, aplha 3

// EXAMPLE
// to acces the blue(id = 2) value of pixel 367 we will get pixelArray(367 + 2)

// defining color value id's
var r = 0,
   g = 1,
   b = 2,
   a = 3;

// defining counter of white and black pixels
var white = 0,
   black = 0;

// iterate through each pixel
for ( var p = 0; p < numberOfPixels; p += 4 ) {

   // verify if pixel in black or white (no racism intended)
   if ( pixelArray[ p + r ] == 255 && pixelArray[ p + g ] == 255 && pixelArray[ p + b ] == 255 ) {
      white++;
   }
   if ( pixelArray[ p + r ] == 0 && pixelArray[ p + g ] == 0 && pixelArray[ p + b ] == 0 ) {
      black++;
   }

}

// For large values for the number of divisions we will obtain
// a white Reuleaux Polygon in the black Parent Polygon.
// By calculating the percentage of the white area from the initial black polygon
// We can verify if our formula for the Reuleaux Polygon Area is correct
var experimentalPercentage = ( 100 * white / ( white + black ) ) + "%";

// Set display area for distance/angle between clicked points
var span = document.getElementById( "black" );

// Declare neccessary variables for calculating distance/angle between clicked points
var angle, dist, clickedPoints = [];

// Handler for clicks on canvas
function canvasClick( event ) {

   // Workaround for certain browsers
   event = event || window.event;

   // get mouseclick position
   var x = event.pageX - canvas.offsetLeft,
      y = event.pageY - canvas.offsetTop;

   // push point with position into array
   clickedPoints.push( {
      x: x,
      y: y
   } );

   // get number of clicked points
   var length = clickedPoints.length;

   // if there are at least clicked two points in array
   if ( length >= 2 ) {

      // calculate distance between last two clicked points
      dist = Math.hypot( clickedPoints[ length - 1 ].x - clickedPoints[ length - 2 ].x, clickedPoints[ length - 1 ].y - clickedPoints[ length - 2 ].y );

      // Display calculated distance
      span.innerHTML = " Distance between last 2 clicked corners: " + dist + "\n";

      // if there are at least three clicked points in array
      if ( length >= 3 ) {

         // calculate distance between each of the last three clicked points
         var sideA = Math.hypot( clickedPoints[ length - 1 ].x - clickedPoints[ length - 2 ].x, clickedPoints[ length - 1 ].y - clickedPoints[ length - 2 ].y );
         var sideB = Math.hypot( clickedPoints[ length - 2 ].x - clickedPoints[ length - 3 ].x, clickedPoints[ length - 2 ].y - clickedPoints[ length - 3 ].y );
         var sideC = Math.hypot( clickedPoints[ length - 1 ].x - clickedPoints[ length - 3 ].x, clickedPoints[ length - 1 ].y - clickedPoints[ length - 3 ].y );

         // calculate cos of angle formed between last three clicked points
         var angleCos = ( sideA * sideA + sideB * sideB - sideC * sideC ) / ( 2 * sideA * sideB );

         // calculate angle formed between last three clicked points in Degrees
         angle = Math.acos( angleCos ) * 180 / Math.PI;

         // Display calculated angle
         span.innerHTML += "</br> Angle betweeen last 3 clicked corners: " + angle;

      }
   }
}

// listen for click event, run canvasClick function
canvas.addEventListener( "click", canvasClick );

//
// CALCULATING THE PROPERTIES OF THE POLYGON
//

// Calculate side length
var polygonSideLength = polygonRadius * 2 * Math.sin( Math.PI / numberOfSides );

// Calculate polygon angle in radians
var polygonAngle = ( numberOfSides - 2 ) / numberOfSides * Math.PI;

// Calculate Reuleaux Polygon Arc Angle in radians
var reuleauxAngle;
if ( numberOfSides % 2 == 0 ) {
   reuleauxAngle = 2 * ( polygonAngle / ( numberOfSides - 2 ) - Math.asin( ( Math.sin( polygonAngle / ( numberOfSides - 2 ) ) / 2 ) ) );
} else {
   reuleauxAngle = polygonAngle / ( numberOfSides - 2 );
}

// Calculate Reuleaux Polygon Arc Radius
var reuleauxRadius;
if ( numberOfSides % 2 == 0 ) {
   reuleauxRadius = polygonSideLength * ( 1 / ( Math.sin( polygonAngle / ( numberOfSides - 2 ) ) ) - Math.cos( polygonAngle / 2 ) );
} else {

   // solving quadratic equation
   var a = 1 - 2 * Math.cos( reuleauxAngle / 2 ),
      b = -polygonSideLength * ( Math.sin( polygonAngle / 2 ) * Math.sin( reuleauxAngle / 2 ) - 1 / Math.tan( polygonAngle / ( 2 * ( numberOfSides - 2 ) ) ) + Math.cos( polygonAngle / 2 ) ),
      c = ( polygonSideLength * polygonSideLength ) / 4 * ( Math.pow( Math.sin( polygonAngle / 2 ), 2 ) - Math.pow( ( 1 / Math.tan( polygonAngle / ( 2 * ( numberOfSides - 2 ) ) ) - Math.cos( polygonAngle / 2 ) ), 2 ) ),
      delta = b * b - 4 * a * c,
      R1 = ( -b - Math.sqrt( delta ) ) / ( 2 * a ),
      R2 = ( -b + Math.sqrt( delta ) ) / ( 2 * a );

   // selecting favourable value
   reuleauxRadius = Math.min( R1, R2 );
}

// Calculate Polygon Area
var polygonArea = numberOfSides * Math.pow( polygonSideLength, 2 ) / ( 4 * Math.tan( polygonAngle / ( numberOfSides - 2 ) ) );

// Calculate Reuleaux Polygon Area
var reuleauxArea = numberOfSides * Math.pow( reuleauxRadius, 2 ) / 2 * ( ( 1 - Math.cos( reuleauxAngle ) ) / ( Math.tan( polygonAngle / ( numberOfSides - 2 ) ) ) + reuleauxAngle - Math.sin( reuleauxAngle ) );

// Calculate percentage of Reuleaux Polygon Area from Parent Polygon Area
var percentage = ( 100 * reuleauxArea / polygonArea ) + "%";

// Display values
var displayArea = document.getElementById( "myVals" );
displayArea.innerHTML = "Number of Polygon Sides: " + numberOfSides +
   "</br> Number of Polygon Side Sections: " + numberOfDivs +
   "</br> Polygon Side Length: " + polygonSideLength +
   "</br> Polygon Angle: " + polygonAngle +
   "</br> Polygon Radius: " + numberOfDivs +
   "</br> Polygon Area: " + numberOfDivs +
   "</br> Reuleaux Polygon Angle: " + reuleauxAngle +
   "</br> Reuleaux Polygon Radius: " + reuleauxRadius +
   "</br> Reuleaux Polygon Area: " + reuleauxArea +
   "</br> Experimental Area Percentage: " + experimentalPercentage +
   "</br> Formula Area Percentage: " + percentage;
