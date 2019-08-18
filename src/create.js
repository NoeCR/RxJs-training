import { displayLog } from './utils';
import { fromEvent } from 'rxjs';
import { mapTo, map, filter } from 'rxjs/operators';


export default () => {
    /** start coding */
    const grid = document.getElementById('grid');
    const click$ = fromEvent(grid, 'click').pipe(
        map(val => [
            Math.floor(val.offsetX / 50),
            Math.floor(val.offsetY / 50)
        ]),
        filter(val => (val[0] + val[1]) % 2 != 0)
    );


    const subscription = click$.subscribe(evt => {
        displayLog(evt);
    })

    /** end coding */
}