import { updateDisplay } from './utils';
import { fromEvent, interval, merge, NEVER, EMPTY } from 'rxjs';
import { mapTo, scan, takeWhile, switchMap, startWith, tap, materialize, dematerialize } from 'rxjs/operators';

export default () => {
    /*
        NEVER - es una función que devuleve un observable vacio, no emite ningún valor ni lanza un error ni se completa
        EMPTY - es una función que devuelve un observable vacio, que tal como recibe una suscripción se completa
        materialize - emite las acciones de los observables como eventos con metadatos Notification {kind: "N", value: -1, error: undefined, hasValue: true}
        dematerialize - realiza el proceso inverso cogiendo esos eventos con metadatos y trasformandolos en acciones sobre el flujo de observables
        
        Metadatos del observable: Notification {kind: "N", value: -1, error: undefined, hasValue: true}
            - kind: N -> next, E -> error, C -> complete
            - value: valor actual en el flujo de datos
            - error: indica el error en caso de que exista,
            - hasValue: indica si existe un valor en el flujo de datos
    */

    /** number of seconds to init countdown */
    const countdownSeconds = 10;

    /** access interface buttons */
    const pauseButton = document.getElementById('pause-btn');
    const resumeButton = document.getElementById('resume-btn');

    /** get comments on button click */
    const pause$ = fromEvent(pauseButton, 'click');
    const resume$ = fromEvent(resumeButton, 'click');
    const isPaused$ = merge(pause$.pipe(mapTo(true)), resume$.pipe(mapTo(false)));


    /** 1s negative interval */
    const interval$ = interval(1000).pipe(mapTo(-1));

    /** countdown timer */
    const countdown$ = isPaused$.pipe(
        startWith(false),
        switchMap(paused => !paused ? interval$.pipe(materialize()) : EMPTY.pipe(materialize())),
        tap(console.log),
        dematerialize(),
        scan((acc, curr) => (curr ? curr + acc : curr), countdownSeconds),
        takeWhile(v => v >= 0),
    );

    /** subscribe to countdown */
    countdown$.subscribe(updateDisplay, null, () => console.log('Complete'));


    /** end coding */
}