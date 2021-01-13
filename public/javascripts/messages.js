(function(exports) {
    /*
     * Client to server: game is complete, the winner is ...
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
        type: exports.T_GAME_WON_BY,
        data: null
    };

    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.O_GAME_ABORTED = {
        type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /*
     * Server to client: make a move
     */
    exports.O_MOVE = { type: "MAKE-MOVE" };
    exports.S_CHOOSE = JSON.stringify(exports.O_CHOOSE);

    /*
     * Server to client: set as player White
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {
        type: exports.T_PLAYER_TYPE,
        data: "White"
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

    /*
     * Server to client: set as player Black
     */
    exports.O_PLAYER_B = {
        type: exports.T_PLAYER_TYPE,
        data: "Black"
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

    /*
     * Player White to server OR server to Player Black: White moved this
     */
    exports.T_MOVE = "SET-MOVE";
    exports.O_MOVE = {
        type: exports.T_MOVE,
        data: null
    };
    //exports.S_MOVE does not exist, as we always need to fill the data property

    //exports.S_MOVE does not exist, as data needs to be set

    /*
     * Server to Player A & B: game over with result won/loss
     */
    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
        type: exports.T_GAME_OVER,
        data: null
    };
})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
//if exports is undefined, we are on the client; else the server