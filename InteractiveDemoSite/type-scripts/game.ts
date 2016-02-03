declare var $: JQueryStatic;

class LifeTracker {
    private _currentValue: number;
    constructor(containingElement: JQuery) {
        this._currentValue = 100;
        containingElement.append('<div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-game-lifetracker></div>');
        this.ensureState();
    }

    private trackingElement(): JQuery {
        return $('div[data-game-lifetracker]');
    }

    private ensureState() {
        this.trackingElement().removeClass("progress-bar-success progress-bar-warning progress-bar-danger");
        this.trackingElement().attr("aria-valuenow", this._currentValue);
        this.trackingElement().css({ width: this._currentValue + "%" });
        this.trackingElement().text(this._currentValue + "%");
        if (this._currentValue > 70) {
            this.trackingElement().addClass("progress-bar-success");
        }
        else if (this._currentValue > 30) {
            this.trackingElement().addClass("progress-bar-warning");
        }
        else {
            this.trackingElement().addClass("progress-bar-danger");
        }
    }

    public subtractLife(value: number) {
        this._currentValue -= value;
        this.ensureState();
    }
}

class Player {
    private _id: number;
    private _position: number;
    private _lifeTracker: LifeTracker;

    constructor(id : number) {
        this._id = id;
        this._position = 6;
        $('div[data-game-row="home"').append('<div class="game-actor col-xs-1" data-game-player="1">Player</div>');
        this._lifeTracker = new LifeTracker(this.playerElement());
        this.playerElement().append('<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>');
    }

    private playerElement() : JQuery {
        return $('div[data-game-player="' + this._id + '"]');
    }

    getPosition() {
        return this._position;
    }

    place() {
        this.playerElement().addClass("col-md-offset-" + this._position);
    }
    clean() {
        this.playerElement().removeClass("col-md-offset-" + this._position);
    }

    left() {
        if (this._position > 0) {
            this.clean();
            this._position -= 1;
            this.place();
        }
    }
    right() {
        if (this._position < 11) {
            this.clean();
            this._position += 1;
            this.place();
        }
    }
    fire() {
        return $('div[data-game-row="weapon"]').append('<div data-game-projectile data-game-position="' + this._position + '">^$^</div>');   
    }

    hit() {
        this._lifeTracker.subtractLife(10);
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
    private _player: Player;
    private _gameRows: GameRows;
    constructor() {
        this._gameRows = new GameRows(12);

        this._player = new Player(1);
        this._player.place();
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

        var projectileposition = + $('div[data-game-row="weapon"] > div[data-game-projectile]').attr("data-game-position");
        $('div[data-game-row="weapon"] > div[data-game-projectile]').addClass('col-md-offset-' + projectileposition);
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
            var possibleBadGuy = $(element).parent().children('[data-game-badguy]').filter('[data-game-position="' + $(element).attr("data-game-position") + '"]');
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
            //alert("You died");
            this._player.hit();
            this._gameRows.getLastRow().children('[data-game-badguy]').remove();
        }
        

    }

    thinkAboutCreatingBadGuy() {
        if (Math.round((Math.random() * 6) + 1) == 1) {
            this.createBadGuy();
        }
    }

    createBadGuy() {
        var position = Math.round((Math.random() * 10) + 1) % 11;
        this._gameRows.getTopRow().append('<button data-game-badguy data-game-position="' + position + '" class="col-md-offset-' + position + '">&!&</button>');
    }

    playEvent(pressEvent: JQueryKeyEventObject) {
        if (pressEvent.charCode == 97) {
            //window.alert("left");
            this._player.left();
        }
        if (pressEvent.charCode == 100) {
            //window.alert("right");
            this._player.right();
        }
        if (pressEvent.charCode == 32) {
            //window.alert("FIRE");
            this._player.fire();
        }
        this.playRound();
        //$("#container").append(pressEvent.keyCode.toString());
    }
}

$(document).ready(function () {
    //$("div[data-game-player]").addClass("col-md-offset-6");
    
    //var gameRows = new GameRows(12);
    var game = new Game();

    
    game.createBadGuy();
    $("#container").focus();
    $("#container").keypress(function (pressEvent) {
        game.playEvent(pressEvent);
        
        //$("#container").append(pressEvent.keyCode.toString());
        $("#container").focus();
    });

}
);