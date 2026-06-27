(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
    };

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    };

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    };
}());

$(window).load(function () {
    game.init();
})

export var game = {
    init: function () {
        levels.init();
        loader.init();
        mouse.init();

        // Hide all game layers and display the start screen
        $('.gameLayer').hide();
        $('#gameStartScreen').show();

        // Get handler for game canvas and context
        game.canvas = $('#gameCanvas')[0];
        game.context = game.canvas.getContext('2d')
    },

    showLevelScreen: function () {
        $('.gameLayer').hide();
        $('#levelSelectScreen').show('slow');
    },

    // Game mode
    mode: 'intro',

    // X & Y Coordinates of the slingshot
    slingshotX: 140,
    slingshotY: 280,

    start: function () {
        $('.gameLayer').hide();
        // Display the game canvas and score
        $('#gameCanvas').show();
        $('#scoreScreen').show();

        game.mode = 'intro';
        game.offsetLeft = 0;
        game.ended = false;
        game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
    },

    // Maximum panning speed per frame in pixels
    maxSpeed: 3,

    // Minimum and Maximum panning offset
    minOffset: 0,
    maxOffset: 300,

    // Current panning offset
    offsetLeft: 0,

    // The game score
    score: 0,

    // Pan the screen to center on newCenter
    panTo: function (newCenter) {
        if (Math.abs(newCenter - game.offsetLeft - game.canvas.width / 4) > 0 && game.offsetLeft <= game.maxOffset && game.offsetLeft >= game.minOffset) {
            var deltaX = Math.round((newCenter - game.offsetLeft - game.canvas.width / 4) / 2);
            if (deltaX && Math.abs(deltaX) > game.maxSpeed) {
                deltaX = game.maxSpeed * Math.abs(deltaX) / deltaX
            }
            game.offsetLeft += deltaX;
        } else {
            return true;
        }
        if (game.offsetLeft < game.minOffset) {
            game.offsetLeft = game.minOffset;
            return true;
        } else if (game.offsetLeft > game.maxOffset) {
            game.offsetLeft = game.maxOffset;
            return true;
        }
        return false;
    },

    handlePanning: function () {
        if (game.mode == 'intro') {
            if (game.panTo(700)) {
                game.mode = "load-next-hero";
            }
        }

        if (game.mode == 'wait-for-firing') {
            if (mouse.dragging) {
                game.panTo(mouse.x + game.offsetLeft)
            } else {
                game.panTo(game.slingshotX);
            }
        }

        if (game.mode == 'load-next-hero') {
            // TODO:
            // Check if any villains are alive, if not end the level (success)
            // Check if there are any more heroes left to load, if not end the level (failure)
            // Load the hero and set mode to wait-for-firing
            game.mode = "wait-for-firing";
        }

        if (game.mode == "firing") {
            game.panTo(game.slingshotX);
        }

        if (game.mode == "fired") {
            // TODO:
            // Pan to wherever the hero currently is
        }
    },

    animate: function () {
        // Animate the background
        game.handlePanning();

        // Animate the characters

        // Draw the background with parallax scrolling

        game.context.drawImage(game.currentLevel.backgroundImage, game.offsetLeft / 4, 0, 640, 480, 0, 0, 640, 480);
        game.context.drawImage(game.currentLevel.foregroundImage, game.offsetLeft, 0, 640, 480, 0, 0, 640, 480);

        // Draw the slingshot
        game.context.drawImage(game.slingshotImage, game.slingshotX - game.offsetLeft, game.slingshotY);
        game.context.drawImage(game.slingshotFrontImage, game.slingshotX - game.offsetLeft, game.slingshotY);

        if (!game.ended) {
            game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
        }
    },

}

var levels = {
    data: [
        // First level
        {
            foreground: 'desert-foreground',
            background: 'clouds-background',
            entities: []
        },
        // Second level
        {
            foreground: 'desert-foreground',
            background: 'clouds-background',
            entities: []
        },
    ],
    // Initialize level selection screen
    init: function () {
        var html = '';
        for (var i = 0; i < levels.data.length; i++) {
            var level = levels.data[i];
            html += '<input type="button" value="' + (i + 1) + '">';
        };
        $('#levelSelectScreen').html(html);

        // Set the button click even handlers to load level
        $('#levelSelectScreen input').click(function () {
            levels.load(this.value - 1);
            $('#levelSelectScreen').hide();
        });
    },

    // Load all data and images for a specific level
    load: function (number) {
        // Declare a new currentLevel object
        game.currentLevel = { number: number, hero: [] };
        game.score = 0;
        $('#score').html('Score: ' + game.score);
        var level = levels.data[number];

        // load the background, foreground, and slingshot images
        game.currentLevel.backgroundImage = loader.loadImage("images/backgrounds/" + level.background + ".png");
        game.currentLevel.foregroundImage = loader.loadImage("images/backgrounds/" + level.foreground + ".png")
        game.slingshotImage = loader.loadImage("images/slingshot.png");
        game.slingshotFrontImage = loader.loadImage("images/slingshot-front.png");

        // Call game.start() once the assets have loaded
        if (loader.loaded) {
            game.start()
        } else {
            loader.onload = game.start;
        }
    }
}

var loader = {
    loaded: true,
    loadedCount: 0, // Assets that have been loaded so far
    totalCount: 0, // Total number of assets that need to be loaded

    init: function () {
        // check for sound support
        var mp3Support, oggSupport;
        var audio = document.createElement('audio');
        if (audio.canPlayType) {
            // Currently canPlayType() returns: "", "maybe", or "probably"
            mp3Support = "" != audio.canPlayType('audio/mpeg');
            oggSupport = "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
        } else {
            // The audio tag is not supported
            mp3Support = false;
            oggSupport = false;
        }

        // Check for ogg, then mp3, and finally set soundFileExtn to undefined
        loader.soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;
    },

    loadImage: function (url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingScreen').show();
        var image = new Image();
        image.src = url;
        image.onload = loader.itemLoaded;
        return image;
    },

    soundFileExtn: ".ogg",
    loadSound: function (url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingScreen').show();
        var audio = new Audio();
        audio.src = url + loader.soundFileExtn;
        audio.addEventListener("canplaythrough", loader.itemLoaded, false);
        return audio;
    },
    itemLoaded: function () {
        loader.loadedCount++;
        $('#loadingMessage').html('Loaded ' + loader.loadedCount + ' of ' + loader.totalCount);
        if (loader.loadedCount === loader.totalCount) {
            // Loader has loaded completely
            loader.loaded = true;
            // Hide the loading screen
            $('#loadingScreen').hide();
            // and call the laoder.onload method if it exists
            if (loader.onload) {
                loader.onload();
                loader.onload = undefined;
            }
        }
    }
}

var mouse = {
    x: 0,
    y: 0,
    down: false,
    init: function () {
        $('#gameCanvas').mousemove(mouse.mousemoveHandler);
        $('#gameCanvas').mousedown(mouse.mousedownHandler);
        $('#gameCanvas').mouseup(mouse.mouseupHandler);
        $('#gameCanvas').mouseout(mouse.mouseupHandler);
    },
    mousemoveHandler: function (ev) {
        var offset = $('#gameCanvas').offset();

        mouse.x = ev.pageX - offset.left;
        mouse.y = ev.pageY - offset.top;

        if (mouse.down) {
            mouse.dragging = true;
        }
    },

    mousedownHandler: function (ev) {
        mouse.down = true;
        mouse.downX = mouse.x;
        mouse.downY = mouse.y;
        ev.originalEvent.preventDefault();
    },
    mouseupHandler: function (ev) {
        mouse.down = false;
        mouse.dragging = false;
    }
}