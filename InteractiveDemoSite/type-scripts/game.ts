declare var $: JQueryStatic;

class Player {
    private _id: number;
    private _possision: number;
    constructor(id : number) {
        this._id = id;
        this._possision = 6;
        $('div[data-game-row="home"').append('<div class="game-actor col-xs-1" data-game-player="1">Player</div>');
    }

    private playerElement() : JQuery {
        return $("div[data-game-player=" + this._id + "]");
    }

    place() {
        this.playerElement().addClass("col-md-offset-" + this._possision);
    }
    clean() {
        this.playerElement().removeClass("col-md-offset-" + this._possision);
    }

    left() {
        if (this._possision > 0) {
            this.clean();
            this._possision -= 1;
            this.place();
        }
    }
    right() {
        if (this._possision < 11) {
            this.clean();
            this._possision += 1;
            this.place();
        }
    }
    fire() {
        $('div[data-game-row="weapon"').append('<div data-game-projectile data-game-possision="' + this._possision + '">^$^</div>');   
    }
}

class GameRows {
    constructor(private _numberOfRows) {
        var counter = 1;
        while (counter <= _numberOfRows) {
            $("div[data-game-container]").append('<div class="col-xs-12" data-game-row="' + counter + '"></div>');
            counter += 1;
            
        } 
        $("div[data-game-container]").append('<div class="col-xs-12" data-game-row="weapon"></div>');
        $("div[data-game-container]").append('<div class="col-xs-12" data-game-row="home"></div>');

        //for (var i = 1; i += 1; i <= _numberOfRows) {
        //    $("div[data-game-container]").append('<div class="col-xs-12" data-game-row="' + 2 + '">Row</div>');
        //}
    }
    getLastRow() {
        return $('div[data-game-row="' + this._numberOfRows + '"]');
    }
    getTopRow() {
        return $('div[data-game-row="1"]');
    }
}

class Game {
    private _gameRows: GameRows;
    constructor() {
        this._gameRows = new GameRows(12);
    }
    playRound() {
        // remove out of play projectiles
        this._gameRows.getTopRow().children('div[data-game-projectile]').remove();
        // move projectiles
        this.checkForCollisions();

        
        $('div[data-game-projectile]').each(function (index, element : Element) {
            var row = + $(element).parent().attr("data-game-row");
            row -= 1;
            $('div[data-game-row="' + row + '"]').append(element);
        });

        var projectilePossision = + $('div[data-game-row="weapon"] > div[data-game-projectile]').attr("data-game-possision");
        $('div[data-game-row="weapon"] > div[data-game-projectile]').addClass('col-md-offset-' + projectilePossision);
        this._gameRows.getLastRow().append($('div[data-game-row="weapon"] > div[data-game-projectile]'));

        this.checkForCollisions();
// move bad guys
        $('[data-game-badguy]').each(function (index, element: Element) {
            var row = + $(element).parent().attr("data-game-row");
            row += 1;
            $('div[data-game-row="' + row + '"]').append(element);
        });
        
        //$('div[data-game-row="weapon"] > div[data-game-projectile]').remove();
        this.thinkAboutCreatingBadGuy();
        this.checkForCollisions();
        this.checkHealth();

        
    }

    checkForCollisions() {
        $('div[data-game-projectile]').each(function (index, element: Element) {
            var possibleBadGuy = $(element).parent().children('[data-game-badguy]').filter('[data-game-possision="' + $(element).attr("data-game-possision") + '"]');
            if (possibleBadGuy.length > 0) {
                // point score!
                possibleBadGuy.remove();
                $(element).remove();
            }
        });
    }

    checkHealth() {
        var badToEnd = this._gameRows.getLastRow().children('[data-game-badguy]').length;
        if (badToEnd > 0) {
            alert("You died");
            this._gameRows.getLastRow().children('[data-game-badguy]').remove();
        }
        

    }

    thinkAboutCreatingBadGuy() {
        if (Math.round((Math.random() * 6) + 1) == 1) {
            this.createBadGuy();
        }
    }

    createBadGuy() {
        var possision = Math.round((Math.random() * 10) + 1) % 11;
        this._gameRows.getTopRow().append('<button data-game-badguy data-game-possision="' + possision + '" class="col-md-offset-' + possision + '">&!&</button>');
    }
}

$(document).ready(function () {
    //$("div[data-game-player]").addClass("col-md-offset-6");
    
    //var gameRows = new GameRows(12);
    var game = new Game();

    var player = new Player(1);
    player.place();
    game.createBadGuy();
    $("#container").focus();
    $("#container").keypress(function (pressEvent) {
        
        if (pressEvent.key == 'a') {
            //window.alert("left");
            player.left();
        }
        if (pressEvent.key == 'd') {
            //window.alert("right");
            player.right();
        }
        if (pressEvent.key == ' ') {
            //window.alert("FIRE");
            player.fire();
        }
        game.playRound();
        //$("#container").append(pressEvent.keyCode.toString());
        $("#container").focus();
    });

}
);