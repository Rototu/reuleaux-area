var c = document.getElementById("mathCanvas");
var cxt = c.getContext("2d");
// hexagon
var numberOfSides, n,
size = 250,
Xcenter = 300,
Ycenter = 300,
points = [];

numberOfSides = prompt("Number of Sides");
n = prompt("Number of Divisions");

cxt.fillStyle = "green";
cxt.fillRect(0, 0, c.width, c.height);

cxt.beginPath();
cxt.moveTo(Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));

// polygon
for (var i = 1; i <= numberOfSides; i += 1) {
   cxt.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
   points.push({x: Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), y: Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides)});
}
cxt.closePath();
cxt.lineWidth = 1;
cxt.fillStyle = '#FFFFFF';
cxt.fill();
cxt.strokeStyle = 'black';
cxt.stroke();

// sections
cxt.beginPath();
var dx, dy, sectionPoints = [];
for (var j = 1; j < n ; j += 1) {
   for (var i = 1; i <= numberOfSides; i += 1) {
      if (i < numberOfSides) {
         dy = points[i - 1].y + (points[i].y - points[i - 1].y) * j / n;
         dx = points[i - 1].x + (points[i].x - points[i - 1].x) * j / n;
      }
      if (i == numberOfSides) {
         dy = points[i - 1].y + (points[0].y - points[i - 1].y) * j / n;
         dx = points[i - 1].x + (points[0].x - points[i - 1].x) * j / n;
      }
      sectionPoints.push({x: dx, y: dy});
   }
   cxt.moveTo(sectionPoints[0].x, sectionPoints[0].y);
   for (var i = 1; i <= numberOfSides; i += 1) {
      if (i < numberOfSides) {
         cxt.lineTo(sectionPoints[i].x, sectionPoints[i].y);
      }
      if (i == numberOfSides) {
         cxt.lineTo(sectionPoints[0].x, sectionPoints[0].y);
      }
   }
   sectionPoints = [];
}

cxt.closePath();
cxt.strokeStyle = "#000000";
cxt.lineWidth = 1;
cxt.stroke();

var w = 500, h = 500;
var imageData = cxt.getImageData(0,0, w, h);
var pixel = imageData.data;

var r=0, g=1, b=2,a=3;
var white = 0, black = 0;
for (var p = 0; p < pixel.length; p += 4) {
   if (pixel[p + r] == 255 && pixel[p + g] == 255 && pixel[p + b] == 255) {
      white++;
   }
   if (pixel[p + r] == 0 && pixel[p + g] == 0 && pixel[p + b] == 0) {
      black++;
   }
}

var percentage = (100 * white / (white + black)) + "%";
var span = document.getElementById("black");
var angle, dist, clickedPoints = [];

function canvasClick(event) {
   event = event || window.event;

   var canvas = document.getElementById('mathCanvas'),
   x = event.pageX - canvas.offsetLeft,
   y = event.pageY - canvas.offsetTop;

   clickedPoints.push({x: x, y: y});
   if(clickedPoints.length >= 2) {
      var length = clickedPoints.length;
      dist = Math.hypot(clickedPoints[length - 1].x - clickedPoints[length - 2].x, clickedPoints[length - 1].y - clickedPoints[length - 2].y);
      span.textContent = " Distance between last 2 clicked points: " + dist + "\n";
      if(clickedPoints.length >= 3) {
         var sideA = Math.hypot(clickedPoints[length - 1].x - clickedPoints[length - 2].x, clickedPoints[length - 1].y - clickedPoints[length - 2].y);
         var sideB = Math.hypot(clickedPoints[length - 2].x - clickedPoints[length - 3].x, clickedPoints[length - 2].y - clickedPoints[length - 3].y);
         var sideC = Math.hypot(clickedPoints[length - 1].x - clickedPoints[length - 3].x, clickedPoints[length - 1].y - clickedPoints[length - 3].y);
         var angleCos = (sideA * sideA + sideB * sideB - sideC * sideC) / (2 * sideA * sideB);
         angle = Math.acos(angleCos) * 180 / Math.PI;
         span.textContent += " Angle betweeen last 3 clicked points: " + angle;
      }
   }
}

document.addEventListener("click", canvasClick);
setTimeout(function() {
	var sideLength = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
	alert("Circumference: " + size + "px \n" + "Side length: " + sideLength + " px \n" + "Area of black surface in polygon: " + (white + black) + " px^2 \n" + 
	"Area of white surface in polygon: " + white + " px^2 \n" + "Ratio of the two areas: " + percentage);
}, 1000);
