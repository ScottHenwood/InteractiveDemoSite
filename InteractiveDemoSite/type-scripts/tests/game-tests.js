var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './Scripts/tsUnit/tsUnit', './type-scripts/game'], function (require, exports, tsUnit, game) {
    var PlayerTests = (function (_super) {
        __extends(PlayerTests, _super);
        function PlayerTests() {
            _super.apply(this, arguments);
            this.targetGame = new game.Game();
            this.targetGameRows = new game.GameRows(12);
            this.targetPlayer = new game.Player(1);
        }
        PlayerTests.prototype.firingFromCorrectPossion = function () {
            var fireResult = this.targetPlayer.fire();
            var projectilePosition = fireResult.attr("data-game-position");
            var playerPosition = this.targetPlayer.getPosition();
            this.areIdentical(playerPosition, projectilePosition);
        };
        return PlayerTests;
    })(tsUnit.TestClass);
    exports.PlayerTests = PlayerTests;
    var playerTests = new tsUnit.Test(PlayerTests);
    var result = playerTests.run();
    result.showResults('results');
});
//# sourceMappingURL=game-tests.js.map