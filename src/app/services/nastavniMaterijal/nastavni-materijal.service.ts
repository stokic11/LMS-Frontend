import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { NastavniMaterijal } from '../../models/nastavniMaterijal';

@Injectable({
  providedIn: 'root'
})
export class NastavniMaterijalService extends CrudService<NastavniMaterijal, number> {

  constructor(http: HttpClient) {
    super(http, '/api/nastavniMaterijal');
  }
}
