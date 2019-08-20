import { Observable, pipe, merge } from 'rxjs';
import { scan, startWith, tap, takeWhile } from 'rxjs/operators';
import { gameState$ } from './gameState';
import { userMove$ } from './userMove';
import { computerMove$ } from './computerMove';
import { simulateComputerTurn } from '../tic-tac-toe/computerMove';
//pure function to find out empty cells
export const getEmptyCells = (board) => {
    const emptyCells = [];
    //detect empty cells
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[0].length; y++) {
            if (board[y][x] == 0) {
                emptyCells.push({ x, y })
            }
        }
    };
    return emptyCells;
}

//pure function to find out which player have won (if any)
const findOutWinner = board => {
    //check rows and cols
    for (let i = 0; i < 3; i++) {
        if ((board[i][0] && board[i][0] == board[i][1] && board[i][1] == board[i][2])) {
            return board[i][0];
        } else if ((board[0][i] && board[0][i] == board[1][i] && board[1][i] == board[2][i])) {
            return board[0][i];
        }
    }
    //check diagonals
    if ((board[0][0] && board[0][0] == board[1][1] && board[1][1] == board[2][2]) ||
        (board[2][0] && board[2][0] == board[1][1] && board[1][1] == board[0][2])) {
        return board[1][1];
    }

    return null;
}

const updateGameState = (gameState, move) => {

        if (!move) {
            return gameState;
        }

        let updateBoard = [...gameState.board];
        updateBoard[move.y][move.x] = gameState.nextPlayer;

        const haveEmptyCells = getEmptyCells(updateBoard).length == 0 ? false : true;
        let finished = !haveEmptyCells;
        const winner = findOutWinner(updateBoard);

        if (winner) {
            finished = true;
        }
        return {
            board: updateBoard,
            nextPlayer: gameState.nextPlayer == 1 ? 2 : 1,
            finished: finished,
            winner: winner
        }
    }
    //initial game state


//main observable with the game logic. Right now only emiting the board
export const game$ = merge(userMove$, computerMove$).pipe(
    startWith(null),
    scan(updateGameState, gameState$.value),
    tap(state => gameState$.next(state)),
    tap((state) => {
        if (state.nextPlayer == 2 && !state.finished) {
            simulateComputerTurn(getEmptyCells(state.board));
        }
    }),
    takeWhile(({ finished }) => finished == false, true)
)