import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WritableCrudService } from '../generic.service';
import { Student } from '../../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService extends WritableCrudService<Student, number> {

  constructor(http: HttpClient) {
    super(http, '/api/student');
  }
}
