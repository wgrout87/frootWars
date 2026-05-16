var canvas = document.getElementById('testcanvas');
var context = canvas.getContext('2d');

var image = document.getElementById('spaceship');
// context.drawImage(image, 0, 350);
// context.drawImage(image, 0, 400, 100, 25);
// context.drawImage(image, 0, 0, 60, 50, 0, 420, 60, 50);

context.translate(250, 370);
context.rotate(Math.PI / 3);
context.drawImage(image, 0, 0, 60, 50, -30, -25, 60, 50);
context.rotate(-Math.PI / 3);
context.translate(-240, -370);

context.translate(300, 370);
context.rotate(3 * Math.PI / 4);
context.drawImage(image, 0, 0, 60, 50, -30, -25, 60, 50);
context.rotate(-3 * Math.PI / 4);
context.translate(-300, -370);

var audio = document.createElement('audio');
var mp3Support, oggSupport;
if (audio.canPlayType) {
    mp3Support = "" != audio.canPlayType('audio/mpeg');
    oggSupport = "" != audio.canPlayType('audio/ogg; codecs  "vorbis"');
} else {
    mp3Support = false;
    oggSupport = false;
}

var soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;

if (soundFileExtn) {
    var sound = new Audio();
    sound.addEventListener('canplaythrough', function () {
        alert('loaded');
        sound.play();
    })
    sound.src = "../audio/coolkid - Interrobang" + soundFileExtn;
    // sound.play();
}