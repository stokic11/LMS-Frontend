import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XmlService {
  private apiUrl = 'http://localhost:8080/api/xml';

  constructor(private http: HttpClient) {}

  uploadXmlFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  submitXmlContent(xmlContent: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, xmlContent, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
