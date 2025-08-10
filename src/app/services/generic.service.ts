import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SearchCriteria {
  [key: string]: any;
}

// Osnovna klasa samo cuva http i baseUrl
export abstract class BaseResource {
  protected constructor(
    protected http: HttpClient,
    protected readonly baseUrl: string
  ) {}
}

// READ ONLY funkcionalnost (pregled podataka)
export abstract class ReadOnlyCrudService<T, ID = number> extends BaseResource {
  list(params?: Record<string, any>): Observable<T[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(k => {
        const v = params[k];
        if (v !== null && v !== undefined) {
          httpParams = httpParams.append(
            k,
            typeof v === 'object' ? JSON.stringify(v) : String(v)
          );
        }
      });
    }
    return this.http.get<T[]>(this.baseUrl, { params: httpParams });
  }

  get(id: ID): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  search(criteria: SearchCriteria, queryParam: string = 'search'): Observable<T[]> {
    const params = new HttpParams().set(queryParam, JSON.stringify(criteria));
    return this.http.get<T[]>(this.baseUrl, { params });
  }
}

// MUTATION sloj (izmene) nad read only
export abstract class MutableCrudService<T, ID = number> extends ReadOnlyCrudService<T, ID> {
  create(body: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, body);
  }

  update(id: ID, body: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, body);
  }

  patch(id: ID, partial: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${id}`, partial);
  }

  delete(id: ID): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deleteBatch(ids: ID[], endpoint: string = 'batchDelete'): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${endpoint}`, ids);
  }
}

// Opis za kompletan CRUD
export abstract class CrudService<T, ID = number> extends MutableCrudService<T, ID> {}

// Pomocni tipovi koji eksplicitno ogranicavaju koje metode se iznose dalje
export type IList<T> = Pick<ReadOnlyCrudService<T>, 'list'>;
export type IGet<T, ID> = Pick<ReadOnlyCrudService<T, ID>, 'get'>;
export type ISearch<T> = Pick<ReadOnlyCrudService<T>, 'search'>;
export type ICreate<T> = Pick<MutableCrudService<T>, 'create'>;
export type IUpdate<T, ID> = Pick<MutableCrudService<T, ID>, 'update' | 'patch'>;
export type IDelete<T, ID> = Pick<MutableCrudService<T, ID>, 'delete' | 'deleteBatch'>;