var canvas = document.getElementById('testcanvas');
var context = canvas.getContext('2d');

var image = document.getElementById('spaceship');
context.drawImage(image, 0, 350);
context.drawImage(image, 0, 400, 100, 25);
context.drawImage(image, 0, 0, 60, 50, 0, 420, 60, 50);