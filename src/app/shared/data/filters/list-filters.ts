import { HttpParams } from '@angular/common/http';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';

/**
 * Utilidades comunes de los listados del backoffice.
 *
 * Antes cada pantalla armaba la URL a mano concatenando los filtros. Eso hacía
 * que un campo vacío viajara igual (`&name=`) y, peor, que un campo que el
 * formulario no tiene viajara como `&description=undefined`, que en el backend
 * terminaba buscando el texto "undefined" y no devolvía nada.
 */

/** Query de un listado: paginado + filtros, salteando los que están vacíos. */
export function listParams(
  page: number,
  filters: Record<string, any> = {},
  take: number = 10
): HttpParams {
  let params = new HttpParams().set('page', page).set('take', take);

  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    params = params.set(key, typeof value === 'boolean' ? (value ? 1 : 0) : value);
  });

  return params;
}

/** Los filtros se aplican mientras se tipea, pero sin una request por tecla. */
export const FILTER_DEBOUNCE_MS = 300;

export function onFiltersChange<T>(changes: Observable<T>): Observable<T> {
  return changes.pipe(
    debounceTime(FILTER_DEBOUNCE_MS),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  );
}
