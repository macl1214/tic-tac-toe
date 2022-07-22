// Game board set up
const gameBoard = (() => {
  const _board = [['', '', ''],
                  ['', '', ''],
                  ['', '', '']];
  const _maxMoves = 9;

  let _firstMove, _curMove, _moves;
  let _player1 = null;
  let _player2 = null;

  /**
   * Private function to clear the board
   */
  const _resetBoard = (() => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        _board[i][j] = '';
      }
    }
  });

  /**
   * Private function that determines if the 
   * move is a valid move
   * 
   * @param {*} r - Row position
   * @param {*} c - Column position
   * @returns:
   *   true   if move is valid
   *   false  if move is invalid
   */
  const _isValidMove = ((r, c) => {
    return _board[r][c] === '';
  })

  /**
   * Private function to update who moves next.
   * Called to change who starts next game
   * 
   * @param {*} move - move variable
   * @returns:
   *   1    to indicate player 1
   *   2    to indicate player 2
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
    result = _assertRow(r) || _assertCol(c) || _assertDiag(r, c);

    if (result === 0 && _moves === _maxMoves) {
      result = -1;
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

    if (p === row[1] && p === row[2]) {
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
    let p = _board[0][c];

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
      return _assertLeftDiag() || _assertRightDiag();
    } else if (r === c) {
      return _assertLeftDiag();
    } else if ((r === 2 && c === 0) || (r === 0 && c === 2)) {
      return _assertRightDiag();
    } else {
      return 0;
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

    _resetBoard();

    _firstMove = 1;
    _curMove = _firstMove;
    _moves = 0;
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
  const makeMove = ((pos) => {
    const posInt = Number.parseInt(pos);
    const r = Math.floor(posInt / 3);
    const c = posInt % 3;
    let valid = _isValidMove(r, c);

    if (valid) {
      _moves++;            // increment move counter

      let piece = _curMove === 1 ? _player1.getPiece() : _player2.getPiece();

      _board[r][c] = piece;

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
   * Public function that changes the
   * name of either player
   * 
   * @param {String} player - 1 for _player1, 2 for _player2
   * @param {String} name   - New name
   */
  const changePlayerName = (player, name) => {
    if (player === 1) {
      _player1.changeName(name);
    } else {
      _player2.changeName(name);
    }
  };

  /**
   * Public method used to get the current piece
   * 
   * @returns:
   *   The piece of the current player
   */
  const getCurPlayer = () => {
    if (_curMove === 1) {
      return _player1;
    } else {
      return _player2;
    }
  };

  /**
   * Public method to reset game.
   * Resets board and move counters
   */
  const restartGame = (() => {
    _resetBoard();

    _firstMove = _nextMove(_firstMove);
    _curMove = _firstMove;
    _moves = 0;
  });

  return {
    initGame,
    makeMove,
    getCurMove,
    getCurPlayer,
    changePlayerName,
    restartGame
  }
})();

// Player factory set up
const Player = (piece, name) => {
  let _playerPiece = piece;
  let _name = name
  let _score = 0;

  const changeName = (name) => {
    _name = name;
  }

  const getPiece = (() => _playerPiece);
  const getScore = (() => _score);

  const hasWon = () => {
    _score++;
    console.log(`${_name} has won!`);
    console.log(`Now has ${_score} wins.`);
  };

  return {
    changeName,
    getPiece,
    getScore,
    hasWon
  }
};

const displayController = (() => {
  let _curPiece;
  let _onePlayer = false;

  const _playerScoreCards = document.querySelectorAll('.score');
  const _gameType = document.querySelector('.game-type');
  const _nameHeaders = document.querySelectorAll('.name-header');
  const _nameInputs = document.querySelectorAll('.name-input');
  const _playerScores = document.querySelectorAll('.score-val');
  const _cells = document.querySelectorAll('.cell');
  const _restart = document.querySelector('.reset');

  /**
   * Private function that gets the id of the
   * cell pressed and attempts to make a move
   * 
   * @param {Object} e - Event Object
   */
  const _getUserInput = (e) => {
    const cell = e.target;
    const pos = cell.getAttribute('data-pos');

    _disableCell(cell);

    const result = gameBoard.makeMove(pos);

    if (result === 0) {
      _curPiece = _getCurPiece();
    } else {
      if (result === 1) {
        _updateScores();
      }
      _toggleCellEventListeners("off");
      _disableAllCells();
    }
  };

  const _updateScores = () => {
    const winner = gameBoard.getCurPlayer();
    const playerNum = gameBoard.getCurMove();

    
    _playerScoreCards[playerNum - 1].classList.add('winner');
    _playerScores[playerNum - 1].innerText = winner.getScore();
  }

  const _disableCell = (cell) => {
    if (!cell.hasAttribute('disabled')) {
      cell.setAttribute('disabled', '');
    }
  };

  const _enableCell = (cell) => {
    cell.removeAttribute('disabled');
  };

  /**
   * Private function that disables all cells.
   * Called only when game is over, so it 
   * also adds an 'over' class to each cell.
   */
  const _disableAllCells = () => {
    _cells.forEach(cell => {
      _disableCell(cell);
      cell.classList.add('over');
    });
  };

  /**
   * Private function that enables all cells and
   * clears the innerText in each.
   */
  const _enableAllCells = () => {
    _cells.forEach(cell => {
      _enableCell(cell);
      cell.innerText = "";
      cell.classList.remove("over");

      // if (cell.classList.contains('.over')) {
      // }
    });
  }

  const _showCurrentPiece = ((e) => {
    const cell = e.target;

    cell.innerText = _curPiece;
  })

  const _getCurPiece = (() => {
    return gameBoard.getCurPlayer().getPiece();
  });

  const _clearEntry = ((e) => {
    const cell = e.target;

    cell.innerText = '';
  });

  const _toggleCellEventListeners = (status) => {
    if (status === "on") {
      _cells.forEach(cell =>
            cell.addEventListener('mouseover', _showCurrentPiece));
    } else {
      _cells.forEach(cell =>
            cell.removeEventListener('mouseover', _showCurrentPiece));
    }
  };

  const _startNewGame = () => {
    gameBoard.restartGame();
    
    _enableAllCells();
    _toggleCellEventListeners("on");

    _curPiece = _getCurPiece();
  };

  const _openNameInput = (e) => {
    e.stopPropagation(); 

    const target = e.target;
    const parent = target.parentNode;
    const input = parent.querySelector('input');

    _toggleShow(target);
    _toggleShow(input);

    if (parent.classList.contains('player1')) {

    }
  };

  const _changeName = (e) => {
    const input = e.target;
    const nameHeader = input.parentNode.querySelector('.name-header');
    const curName = nameHeader.innerText;
    const name = input.value.trim();
    const playerId = input.id;
    const player = playerId === "player1-name" ? 1 : 2;
    
    // Check if name is not empty or if it's not the same
    if (name !== "" || name !== curName) {
      gameBoard.changePlayerName(player, name);

      input.value = "";
      nameHeader.innerText = name;

      _toggleShow(input);
      _toggleShow(nameHeader);
    }
 
  }

  const _closeNameInput = (e) => {
    for (let player of _playerScoreCards) {
      const nameInput = player.querySelector('.name-input');
      const playerName = player.querySelector('.name-header');

      const inputHidden = nameInput.classList.contains('hide');

      if (!inputHidden) {
        nameInput.value = "";
        _toggleShow(nameInput);
        _toggleShow(playerName);
      }
    } 
  }

  const _toggleShow = (mode) => {
    if (mode.classList.contains('hide')) {
      mode.classList.remove('hide');
    } else {
      mode.classList.add('hide');
    }
  }

  const _countdown = (score) => {
    let startTimestamp = null;
    let curScore = Number.parseInt(score.innerText);
    let duration = 500;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      score.innerHTML = Math.floor(progress * (0 - curScore) + curScore);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  const _resetScores = () => {
    for (let score of _playerScores) {
      _countdown(score);
    }
  }

  const _resetGame = () => {
    _resetScores();
  }

  const _changeGameType = () => {
    const modes =_gameType.children;

    _resetGame();

    for (let mode of modes) {
      _toggleShow(mode);
    }
    
    _onePlayer = !_onePlayer;
  }

  const _removeBlinker = (e) => {
    const score = e.target;

    score.classList.remove('winner');
  }

  const initGame = () => {
    // Used to close name input field
    document.addEventListener('click', _closeNameInput);
    document.addEventListener('keydown', function(e) {
      if (e.key === "Escape") {
        _closeNameInput();
      }
    });
    
    // Used to not close when clicking inside field
    _nameInputs.forEach(input => input.addEventListener('click', e => e.stopPropagation()));
    
    _toggleCellEventListeners("on");

    _nameHeaders.forEach(playerName => playerName.addEventListener('click', _openNameInput));
    _nameInputs.forEach(input => input.addEventListener('keydown', function(e) {
      if (e.key === "Enter") 
        _changeName(e);
    }));
    _cells.forEach(cell => cell.addEventListener('click', _getUserInput));
    _cells.forEach(cell => cell.addEventListener('mouseout', _clearEntry));
    _restart.addEventListener('click', _startNewGame);
    _gameType.addEventListener('click', _changeGameType);
    _playerScoreCards.forEach(score => score.addEventListener('animationend', _removeBlinker));

    _curPiece = _getCurPiece();
  };

  return {
    initGame
  }
})();

// Testing
window.onload = () => {
  const player1 = Player('X', 'Player 1');
  const player2 = Player('O', 'Player 2');
  gameBoard.initGame(player1, player2);
  displayController.initGame();
};