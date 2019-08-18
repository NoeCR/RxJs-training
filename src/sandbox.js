import { updateDisplay, displayLog } from './utils';
import { api } from './api';
import { merge, fromEvent, concat, forkJoin } from 'rxjs';
import { map, endWith } from 'rxjs/operators';

export default () => {
    /** start coding */
    /* 
        CONCAT: ejecuta los observables de forma secuancial, cuando termina la ejecución de uno comienza la del siguiente
        FORKJOIN: recive varios observables, espera a que se completen todos y devuelve un array con los datos. 
            Pero solo devuelve el ultimo valor de cara flujo de entrada
    */
    const button = document.getElementById('btn');

    /** get 4 consecutive comments */
    const getComments = () => {
        //get observables from fake REST API.
        const comment1$ = api.getComment(1);
        const comment2$ = api.getComment(2);
        const comment3$ = api.getComment(3);
        const comment4$ = api.getComment(4);

        //subscribe to all the observables to get and display comments
        // concat(comment1$, comment2$, comment3$, comment4$).pipe(
        //     map(({ id, comment }) => `#${id} - ${comment}`),
        //     endWith('--------//--------')
        // ).subscribe(data => {
        //     displayLog(data);
        // })
        // FORKJOIN: recive varios observables, espera a que se completen todos
        forkJoin(comment1$, comment2$, comment3$, comment4$).pipe(
            map(JSON.stringify),
            endWith('--------//--------')
        ).subscribe(data => {
            displayLog(data);
        })
    }

    /** get comments on button click */
    fromEvent(button, 'click').subscribe(getComments);

    /** end coding */
}