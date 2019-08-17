import { displayLog, resetLog } from './utils';
import { Observable, timer, interval, fromEvent, from, of } from 'rxjs';

export default () => {
    /** start coding */
    // **** Creación de observables *******************//
    // variables
    let subscriber; // Variable para almacenar la subscripcion al observable y poder cancelarlo
    const users = [
            { id: 0, name: 'test-0' },
            { id: 1, name: 'test-1' },
            { id: 2, name: 'test-2' },
            { id: 3, name: 'test-3' },
            { id: 4, name: 'test-4' }
        ]
        // Array de promesas
    const promises = users.map(user => user.name);

    // Resolución de promesas mediante el metodo all, el cual esperara a tener el array de promesas complidas para agrupar sus resultados 
    // Promise.all(promises).then(res => showdata(res)).catch(err => console.log(err));

    // Resolución de todas las promesas pasadas a observables
    const arrayOfPromise = from(promises); // se podría usar también of
    // Diferencia entre from y of 
    // OF -> agrupa los resultados devolviendolos a la vez
    // FROM -> devuelve los resultados de 1 en 1

    // Creación de la variable la cual al llamar al metodo subcribe ejecutara el observable creado
    const subscription = Observable.create((observer) => {
        // Intervalo que se repetira cara 1000 milisegundos al que nos podemos subscribir
        interval(1000).subscribe(data => {
            // Metodo next del observador para ejecutar una acción
            observer.next(data);
        });
        // Función que se ejecutara pasado un determinado tiempo, a la que nos podemos subscribir para realizar una acción
        // en este caso llamar el metodo complete del obervador para indicarle que termine con el stream. 
        // Tambien puede usarse para crear un intervalo, indicando cuando debe iniciarse ej: timer(4000, 1000) -> empezaraq a los 4s y se repetica cada 1s 
        timer(5000).subscribe(() => observer.complete());
    });

    // Escuchar eventos con el operador fromEvent de forma similar al addeventListener, indicamos el elemento y el evento que queremos escuchar
    fromEvent(document.getElementById('action-btn'), 'click')
        .subscribe(evt => {
            restart();
        })

    fromEvent(document.getElementById('stop-btn'), 'click')
        .subscribe(evt => {
            stop();
        })

    fromEvent(document.getElementById('data-btn'), 'click')
        .subscribe(evt => {
            // showdata(promises);
            showdata();
        })

    fromEvent(document, 'mousemove')
        .subscribe(evt => {
            coords(evt);
        })
        // Funciones para los ejemplos
    function restart() {
        resetLog();
        // Nos subscribimos al observable para iniciar su ejecución y la guardamos en una variable para poder desuscribirse
        // Los observables son frios o cold por lo que cada suscripción al observable implica una nueva ejecución
        subscriber = subscription.subscribe(res => {
            displayLog(res + 1);
        })
    };

    function stop() {
        // Nos desuscribimos del obserbable cancelando su ejecución
        if (!subscriber) {
            console.log('No hay suscripción!');
            return;
        }

        subscriber.unsubscribe();
    }
    // Funció n para cuando se usa el Pormise.all
    function showdata(data) {
        resetLog();
        arrayOfPromise.subscribe(res => {
            displayLog(data);
        });
    }

    function showdata() {
        resetLog();
        arrayOfPromise.subscribe(res => {
            displayLog(res);
        });
    }

    function coords(evt) {
        const span = document.querySelector('span');
        span.style.position = "absolute";
        span.style.top = '1rem';
        span.style.left = 'calc(50% - 8rem)';
        span.innerHTML = `Position of cursor: (${evt.x},${evt.y})`
    }
    /** end coding */

}