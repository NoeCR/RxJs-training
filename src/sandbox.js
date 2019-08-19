import { updateDisplay, displayLog } from './utils';
import { api } from './api';
import { fromEvent, from } from 'rxjs';
import { map, scan, tap, concatMap, mergeMap } from 'rxjs/operators';

export default () => {
    /*
        High Order Observables - Observables que emiten observables

        mergeAll - evita suscripciones anidadas suscribiendose a los observables internos y canalizando su flujo de datos
                    Hacia el HOO, que en este caso es el observable que se crea mediante la función fromEvent

        mergeMap - se suscribe a todos los observables internos de forma concurrente, por lo que el orden de los resultados que se emite depende del
                    tiempo que tarden los observables en resolverse

        switchMap - cuando recibe un evento genera un observable interno y se suscribe a el para pasarle sus eventos al observable externo.
                    Pero cuando recibe un nuevo evento cancela la suscripción del observable anterior antes de suscribirse a un nuevo evetno interno
                    Por lo que solo emite el ultimo evento del observable.

        concatMap - se suscribe a los observables internos de forma ordenada, por lo que hasta que no se complete los eventos del primer observable no 
                    se suscribira al segundo, y así sucesivamente

        from - convierte un array en un flujo de datos, convirtiendo cada elemento del array en un observable
    */

    const button = document.getElementById('btn');

    /** get comments on button click */
    fromEvent(button, 'click').pipe(
        scan((acc, evt) => acc + 1, 0),
        concatMap(page => api.getCommentsList(page)), // Devuelve 10 comentarios por página en un array
        mergeMap(comments => from(comments)),
        map(JSON.stringify),
        tap(console.log),
    ).subscribe(displayLog);

    /** end coding */
}