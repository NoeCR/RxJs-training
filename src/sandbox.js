import { updateDisplay } from './utils';
import { fromEvent, Subject, BehaviorSubject } from 'rxjs';
import { map, tap, share, takeUntil, takeWhile, pairwise, sampleTime, throttleTime, auditTime, delay, bufferTime, debounceTime } from 'rxjs/operators';

export default () => {
    /** start coding */

    /* SUBJECT:
        - Permite hacer multicast hacia varios observadores ( Hot observable )
        - Es también un observador, por lo que ademas de tener los métodos subscribe y pipe también pose los métodos next, error y complete
        - Actua como un distribuidor, emite a todos sus observadores cualquier evento que recibe como observer
    */
    /* BehaviorSubject:
        -  Permite inicializar el valor del Subject
    */
    /* share: 
        - Convierte un cold observable en un hot observable compartiendo la misma instancia con todos los suscriptores
          Iniciandola cuando se suscribe el primero y cancelandola cuando se desuscribe el ultimo
    */
    /* pairwise:
        - Emite los eventos en parejas de datos consecutivos, manteniento el anterior y el evento actual
    */
    /* Operadores temporales - limitan la frecuencia de emisión de los datos
        - sampleTime: Emite el valor más reciente de un flujo de datos cada cierto tiempo, siempre que se haya emitido algún valor en ese intervalo
        - auditTime: espera a detectar un evento, y en ese momento crea una ventana temporal del tamaño indicado, y al finalizar devuelve la muestra más reciente
        - throttleTime: cuando detecta un evento lo emite, y acto seguido deja de escuchar el stream durante la ventana temporal indicada, utíl para evitar dobleclicks 
        - delay: introduce un retraso entre el origen de los eventos y el flujo de salida observable
        - bufferTime: acumula muestras durante un periodo de tiempo indicado y acto seguido las entrega todas juntas en un array, ej: bufferTime(500, 1000) ->
            entregara las muestras recogidas durante el ultimo medio segundo, entregando muestras cada segundo, haya cambios o no en el stream
        - debounceTime: cuando se recive un evento se inicia una espera fijada y ademas reinicia la espera con cada nuevo valor recibido.
            Cuando se dejan de emitir datos durante el tiempo prefijado permite la continuación del stream.
    */
    const progressBar = document.getElementById('progress-bar');
    const docElement = document.documentElement;

    //function to update progress bar width on view
    const updateProgressBar = (percentage) => {
        progressBar.style.width = `${percentage}%`;
    }

    //observable that returns scroll (from top) on scroll events
    const scroll$ = fromEvent(document, 'scroll').pipe(
        sampleTime(50),
        map(() => docElement.scrollTop),
        tap(evt => console.log("[scroll]: ", evt)),
        // pairwise(),
        // tap(([previous, current]) => {
        //     updateDisplay(current > previous ? 'DESC' : 'ASC');
        // }),
        // map(([previous, current]) => current)
    );

    //observable that returns the amount of page scroll progress
    const scrollProgress$ = scroll$.pipe(
        map(evt => {
            const docHeight = docElement.scrollHeight - docElement.clientHeight;
            return (evt / docHeight) * 100;
        })
    )

    const scrollProgressHot$ = new BehaviorSubject(0);
    scrollProgress$.subscribe(scrollProgressHot$);
    //subscribe to scroll progress to paint a progress bar
    const subscription = scrollProgressHot$.subscribe(updateProgressBar);

    //subscribe to display scroll progress percentage

    const subscription2 = scrollProgressHot$.subscribe(val => updateDisplay(`${ Math.floor(val) } %`));

    // scrollProgressHot$.next(0);
    console.log('Scroll initial state: ', scrollProgressHot$.getValue());
    /** end coding */
}