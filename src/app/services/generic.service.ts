import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SearchCriteria {
  [key: string]: any;
}

export abstract class BaseResource {
  protected constructor(
    protected http: HttpClient,
    protected readonly baseUrl: string
  ) {}
}

export abstract class ReadOnlyCrudService<T, ID = number> extends BaseResource {
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }

  getById(id: ID): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  search(criteria: SearchCriteria, queryParam: string = 'search'): Observable<T[]> {
    const params = new HttpParams().set(queryParam, JSON.stringify(criteria));
    return this.http.get<T[]>(this.baseUrl, { params });
  }
}

export abstract class WritableCrudService<T, ID = number> extends ReadOnlyCrudService<T, ID> {
  create(body: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, body);
  }

  patch(id: ID, partial: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${id}`, partial);
  }
}

export abstract class CrudService<T, ID = number> extends WritableCrudService<T, ID> {
  delete(id: ID): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  put(id: ID, body: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, body);
  }
}

export type IGetAll<T> = Pick<ReadOnlyCrudService<T>, 'getAll'>;
export type IGetById<T, ID> = Pick<ReadOnlyCrudService<T, ID>, 'getById'>;
export type ISearch<T> = Pick<ReadOnlyCrudService<T>, 'search'>;
export type ICreate<T> = Pick<WritableCrudService<T>, 'create'>;
export type IPatch<T, ID> = Pick<WritableCrudService<T, ID>, 'patch'>;
export type IDelete<T, ID> = Pick<CrudService<T, ID>, 'delete'>;