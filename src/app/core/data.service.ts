import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  getEquipements(): Observable<any[]> {
    return this.http.get<any[]>('assets/data/equipements.json');
  }

  getEspacesVerts(): Observable<any[]> {
    return this.http.get<any[]>('assets/data/espaces_verts.json');
  }

  getFontaines(): Observable<any[]> {
    return this.http.get<any[]>('assets/data/fontaines-a-boire.json');
  }
}
