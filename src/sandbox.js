import { displayLog } from './utils';
import { fromEvent } from 'rxjs';
import { map, takeWhile, tap, reduce, scan, distinct, distinctUntilChanged } from 'rxjs/operators';

export default () => {
    /** start coding */
    // REDUCE: aplicara una función a cada dato de entrada y los mostrara cuando el stream finalice

    // SCAN: aplicara una función a cada dato de entrada y los mostrara cuando se produzca una nueva entrada

    // DISTINCT:  Para tipos básicos funciona sin necesidad de estabecer una funcion de comparación, para tipos como objectos compuestos 
    // Es necesario descomponerlos para representarlos como tipo básico y que así detecte los cambios EJ: distinct(([col, row]) => `${col} - ${row}`)

    //DISTINCTUNTILCHANGED: cuando el evento es un tipo simple como un string o numero no es necesario pasar ninguna función, pero 
    // si se trata de objetos es necesaior usar una función de comparación que recibe como argumento dos elementos y debe devolver true para bloquear el elemento actual
    // esto evita la repetición de elementos iguales y solo permite la ejecución del observable cuando es distinto 

    const grid = document.getElementById('grid');
    const click$ = fromEvent(grid, 'click').pipe(
        map(val => [
            Math.floor(val.offsetX / 50),
            Math.floor(val.offsetY / 50)
        ]),
        takeWhile(([col, row]) => col != 0), // Se ejecutara mientras que la columna sea distinta a 0 
        tap(val => console.log(`cell: [${val}]`)), // TAP: ejecutara una función ajena al flujo de datos, no puede modificar el flujo. lo que recibe es lo que emite
        distinctUntilChanged(
            (cell1, cell2) =>
            (cell1[0] == cell2[0]) &&
            (cell1[1] == cell2[1])
        ),
        scan((accumulated, // Valor que se va acumulando a medida que se reciben eventos
                current // Valor actual pasado a la función
            ) => {
                return {
                    clicks: accumulated.clicks + 1,
                    cells: [...accumulated.cells, current]
                }
            }, { clicks: 0, cells: [] } // Semilla que inicializa el acumulador 
        ),

    );

    const subscription = click$.subscribe(data => displayLog(`${data.clicks} clicks: ${JSON.stringify(data.cells)}`));

    /** end coding */
}