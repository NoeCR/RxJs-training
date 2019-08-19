import { updateDisplay, displayLog } from './utils';
import { api } from './api';
import { fromEvent } from 'rxjs';
import { map, scan, tap, concatMap, catchError, retry } from 'rxjs/operators';

export default () => {
    /*
        throwError - tal como se crea lanza un error
        catchError - interviene el error a nivel de observable antes de que se emita hacia el suscriptor y lo cierre
                    recibe como parametros el error y el observable que puede devolverse para continuar con el flujo del observable
                    pero hay que tener en cuenta que puede entrar en un bucle infinito según el flujo del observable

        retry - Permite capturar una excepción en el fujo de datos y reintentar su ejecución un número limitado de veces, en caso de 
                que el error supere el numero de reintentos lo propaga el error en el flujo de datos
    */

    const button = document.getElementById('btn');

    /** get comments on button click */
    fromEvent(button, 'click').pipe(
        scan((acc, evt) => acc + 1, 0),
        concatMap(id => api.getComment(id).pipe(
            retry(3), // Si falla 3 veces se cerrara el flujo del observable y entregara el error
            // catchError((err, src$) => { console.log('catch!'); return src$ }),
        )),
        map(JSON.stringify),
        tap(console.log),
    ).subscribe(displayLog, err => console.log('Error: ', err.message));

    /** end coding */
}