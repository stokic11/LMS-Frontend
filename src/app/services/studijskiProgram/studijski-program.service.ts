import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WritableCrudService } from '../generic.service';
import { StudijskiProgram } from '../../models/studijskiProgram';

@Injectable({
  providedIn: 'root'
})
export class StudijskiProgramService extends WritableCrudService<StudijskiProgram, number> {

  constructor(http: HttpClient) {
    super(http, '/api/studijskiProgram');
  }
}
