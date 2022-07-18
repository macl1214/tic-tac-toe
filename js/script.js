/** Back-end */

// Game board  set up
const gameBoard = (() => {
  const _board = [[' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' ']];
  const _maxMoves = 9;

  let _firstMove = 1;
  let _curMove = 0;
  let _moves = 0;
  let _player1 = null;
  let _player2 = null;

  /**
   * Private function to clear the board
   */
  const _resetBoard = (() => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        _board[i][j] = ' ';
      }
    }
  });

  /**
   * Private function to update who moves next.
   * Called to change who starts next game
   * 
   * @param {*} move - move variable
   * @returns:
   *   
   */
  const _nextMove = ((move) => {
    move = move === 1 ? 2 : 1;

    return move;
  })

  /**
   * Public function to check if game has ended.
   * 
   * @param {*} r - Row position
   * @param {*} c - Column position
   * 
   * @returns
   *  -1    if game has ended in a tie
   *   0    if game has not ended
   *   1    if current player has won
   */
  const _hasGameEnded = ((r, c) => {
    result = _assertRow(r) || _assertCol(c) || _assertDiag();

    if (result === 0 && _moves === _maxMoves) {
      result - 1;
    } else {
      return result;
    }
  });

  /**
   * Private function that checks if all values
   * in the row are the same.
   * 
   * @param {*} r - Row position
   * @returns:
   *   0    if there is no match
   *   1    if there is a match
   */
  const _assertRow = ((r) => {
    let row = _board[r];
    let p = row[0]

    if (p === _board[1] && p === _board[2]) {
      return 1;
    }

    return 0;
  });

  /**
   * Private function that checks if all values in 
   * the column are the same.
   * 
   * @param {*} r - Column position
   * @returns:
   *   0    if there is no match
   *   1    if there is a match
   */
  const _assertCol = ((c) => {
    let p = _board[0][1];

    if (p === _board[1][c] && p === _board[2][c]) {
      return 1;
    }

    return 0;
  });

  /**
   * Private function that checks if all values in 
   * each of the board's diagonals are a match.
   * 
   * Calls other helper functions to check each 
   * individual diagonal.
   * 
   * Only calls the diagonal if row and column 
   * positions passed are in one.
   * 
   * @param {*} r - Row position
   * @param {*} c - Column position
   * @returns:
   *   0    if there is no match
   *   1    if there is a match
   */
  const _assertDiag = ((r, c) => {
    if (r === 1 && c === 1) {                           // Middle
      return _assertLeftDiag() && _assertRightDiag();
    } else if (r === c) {
      return _assertLeftDiag();
    } else if ((r === 2 && c === 0) || (r === 0 && c === 2)) {
      return _assertRightDiag();
    }
  });

  /**
   * Private function that checks if all values
   * along the left diagonal are a match
   * 
   * @returns:
   *   0    if there is no match
   *   1    if there is a match
   */
  const _assertLeftDiag = (() => {
    let p = _board[0][0];

    if (p === _board[1][1] && p === _board[2][2]) {
      return 1;
    }

    return 0;
  });

  /**
   * Private function that checks if all values
   * along the right diagonal are a match
   * 
   * @returns:
   *   0    if there is no match
   *   1    if there is a match
   */
  const _assertRightDiag = (() => {
    let p = _board[2][0];

    if (p === _board[1][1] && p === _board[0][2]) {
      return 1;
    }

    return 0;
  });
  
  /**                     Public Methods                     **/

  // Method to be called when gameBoard is initialized
  const initGame = ((player1, player2) => {
    _player1 = player1;
    _player2 = player2;

    _board = _resetBoard();

    _firstMove = _nextMove(_firstMove);
    _curMove = _firstMove;

  });
  
  /**
   * Public method used to place a piece on the board.
   * Checks if the position is valid before placing 
   * then checks if the game has ended.
   * 
   * @param {*} pos - Numeric position (0 - 8) 
   * @returns:
   *  -1    if game has ended in a tie
   *   0    if game as not ended
   *   1    if current player has won
   */
  const move = ((pos) => {
    let valid = _isValidMove(pos);

    if (valid) {
      _moves++;            // increment move counter

      let r = pos / 3;
      let c = pos % 3;

      let piece = _curMove === 1 ? _player1.getPiece() : _player2.getPiece();

      let result = _hasGameEnded(r, c);

      if (result === 1) {
        if (_curMove === 1) { _player1.hasWon(); }
        else { _player2.hasWon() };

        return result;
      }

      if (result === 0) {
        _curMove = _nextMove(_curMove);
      }

      return result;
    }
  });

  /**
   * Public method that returns a number 
   * representing who's turn it is
   * 
   * @returns:
   *   1    if player 1's turn
   *   2    if player 2's turn
   */
  const getCurMove = (() => {
    return _curMove;
  });

  /**
   * Public method to reset game.
   * Resets board and move counters
   */
  const resetGame = (() => {
    _resetBoard();

    _curMove = _nextMove();
    _moves = 0;
  })

  return {
    initGame,

  }
})();