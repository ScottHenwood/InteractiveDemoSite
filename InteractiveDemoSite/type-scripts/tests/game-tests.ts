import * as tsUnit from './Scripts/tsUnit/tsUnit';
import * as game from './type-scripts/game';

export class PlayerTests extends tsUnit.TestClass {

    private targetGame = new game.Game();
    private targetGameRows = new game.GameRows(12);
    private targetPlayer = new game.Player(1);

    firingFromCorrectPossion() {
        var fireResult = this.targetPlayer.fire();
        
        var projectilePosition = fireResult.attr("data-game-position");
        var playerPosition = this.targetPlayer.getPosition();

        this.areIdentical(playerPosition, projectilePosition);
    }

    
}

var playerTests = new tsUnit.Test(PlayerTests);

var result = playerTests.run();

result.showResults('results');