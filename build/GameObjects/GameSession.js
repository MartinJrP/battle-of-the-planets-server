"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var CodeGenerator = require('node-code-generator');
const Constants = __importStar(require("./../Constants"));
const ERROR_NAME = __importStar(require("./../Errors"));
/// Manages and individual GameSession instance.
class GameSession {
    constructor(id) {
        this.id = id;
        this.players = [];
    }
    addPlayer(player) {
        if (this.players.length >= Constants.MAX_PLAYER_COUNT) {
            let error = new Error('Max player count reached.');
            error.name = ERROR_NAME.MAX_PLAYERS_REACHED;
            throw Error('Max player count reached.');
        }
        else {
            this.players.push(player);
        }
    }
    static GenerateNewGameId(currentSessions) {
        let generator = new CodeGenerator();
        let pattern = '#####';
        let existingCodes = currentSessions.map(session => session.id);
        let options = {
            existingCodesLoader: (pattern) => [existingCodes]
        };
        let codes = generator.generateCodes(pattern, 1, options);
        return codes[0];
    }
}
exports.default = GameSession;
//# sourceMappingURL=GameSession.js.map