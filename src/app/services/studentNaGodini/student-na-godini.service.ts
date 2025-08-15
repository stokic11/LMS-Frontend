import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { StudentNaGodini } from '../../models/studentNaGodini';

@Injectable({
  providedIn: 'root'
})
export class StudentNaGodiniService extends CrudService<StudentNaGodini, number> {

  constructor(http: HttpClient) {
    super(http, '/api/studenti-na-godini');
  }
}
