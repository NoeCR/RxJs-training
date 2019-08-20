import { canvas, CELL_SIZE } from './draw';
import { fromEvent } from 'rxjs';
import { map, withLatestFrom, filter } from 'rxjs/operators';
import { gameState$ } from './gameState';

const click$ = fromEvent(canvas, 'click').pipe(
    map(val => {
        return {
            x: Math.floor(val.offsetX / CELL_SIZE),
            y: Math.floor(val.offsetY / CELL_SIZE)
        }
    })
);

export const userMove$ = click$.pipe(
    // filter valid moves
    withLatestFrom(gameState$),
    filter(([click, state]) => state.nextPlayer == 1),
    filter(([click, state]) => state.board[click.y][click.x] == 0),
    map(([click, state]) => click)
)