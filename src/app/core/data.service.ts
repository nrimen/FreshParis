import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, concatMap, expand, from, map, Observable, takeWhile, tap} from 'rxjs';
import {Equipement} from "./models/equipement";
interface ApiResponse {
  records: { fields: Equipement }[];
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/records';

  constructor(private http: HttpClient) { }

  getEquipements(page: number = 1, limit: number = 100): Observable<Equipement[]> {
    let allEquipements: Equipement[] = [];
    const totalCount = 1000;
    const totalPages = Math.ceil(totalCount / limit);

    return new Observable<Equipement[]>((observer) => {
      from(Array.from({ length: totalPages }, (_, i) => i + 1)).pipe(
        concatMap((page) =>
          this.http.get<any>(`${this.apiUrl}?limit=${limit}&offset=${(page - 1) * limit}`).pipe(

            map((response) => response.results || []),
            catchError((error) => {
              console.error('Error fetching data:', error);
              return [];
            })
          )
        )
      ).subscribe({
        next: (equipements) => {
          if (Array.isArray(equipements)) {
            equipements.forEach((equipement: Equipement) => {
              if (!allEquipements.some((existing) => existing.identifiant === equipement.identifiant)) {
                allEquipements.push(equipement);
              }
            });
          } else {
            console.warn('Received invalid data:', equipements);
          }
        },
        complete: () => {
          observer.next(allEquipements);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }





  getEspacesVerts(): Observable<any[]> {
    return this.http.get<any[]>('assets/data/espaces_verts.json');
  }

  getFontaines(): Observable<any[]> {
    return this.http.get<any[]>('assets/data/fontaines-a-boire.json');
  }
}
