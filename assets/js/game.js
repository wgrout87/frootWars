$(window).load(function () {
    game.init();
})

export var game = {
    init: function () {
        levels.init();

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

    }
}