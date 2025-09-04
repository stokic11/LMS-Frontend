import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Knjiga } from '../../models/knjiga.model';
import { AppConstants } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class KnjigaService extends CrudService<Knjiga, number> {

  constructor(http: HttpClient) {
    super(http, AppConstants.buildUrl('knjige'));
  }
}
