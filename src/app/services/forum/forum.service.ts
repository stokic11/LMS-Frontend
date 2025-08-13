import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Forum } from '../../models/forum';

@Injectable({
  providedIn: 'root'
})
export class ForumService extends CrudService<Forum, number> {

  constructor(http: HttpClient) {
    super(http, '/api/forum');
  }
}
