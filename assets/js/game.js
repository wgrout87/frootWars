$(window).load(function () {
    game.init();
})

export var game = {
    init: function () {
        levels.init();
        loader.init();

        $('.gameLayer').hide();
        $('#gameStartScreen').show();

        game.canvas = $('#gameCanvas')[0];
        game.context = game.canvas.getContext('2d')
    },
    showLevelScreen: function () {
        $('.gameLayer').hide();
        $('#levelSelectScreen').show('slow');
    }
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
            foreground: 'desert-goreground',
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