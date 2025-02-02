import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, concatMap, expand, from, map, Observable, of, takeWhile, tap} from 'rxjs';
import {Equipement} from "./models/equipement";
import {GreenSpace} from "./models/green_spaces";
import {Fountain} from "./models/fountain";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/records';
  private apiUrlGreenSpaces = 'https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/records';
  private apiUrlFontaines = 'https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/fontaines-a-boire/records';

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



  getEspacesVerts(page: number = 1, limit: number = 100): Observable<GreenSpace[]> {
    let allGreenSpaces: GreenSpace[] = [];
    const totalCount = 1000;
    const totalPages = Math.ceil(totalCount / limit);

    return new Observable<GreenSpace[]>((observer) => {
      from(Array.from({ length: totalPages }, (_, i) => i + 1)).pipe(
        concatMap((page) =>
          this.http.get<{ results: GreenSpace[] }>(`${this.apiUrlGreenSpaces}?limit=${limit}&offset=${(page - 1) * limit}`).pipe(
            map((response) => response.results || []),
            catchError((error) => {
              console.error('Error fetching GreenSpaces data:', error);
              return of([]);
            })
          )
        )
      ).subscribe({
        next: (greenSpaces) => {
          if (Array.isArray(greenSpaces)) {
            greenSpaces.forEach((greenSpace: GreenSpace) => {
              if (!allGreenSpaces.some((existing) => existing.nom === greenSpace.nom)) {
                allGreenSpaces.push(greenSpace);
              }
            });
          } else {
            console.warn('Received invalid data:', greenSpaces);
          }
        },
        complete: () => {
          observer.next(allGreenSpaces);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }



  getFontaines(page: number = 1, limit: number = 100): Observable<Fountain[]> {
    let allFontaines: Fountain[] = [];
    const totalCount = 1280;
    const totalPages = Math.ceil(totalCount / limit);

    return new Observable<Fountain[]>((observer) => {
      from(Array.from({ length: totalPages }, (_, i) => i + 1)).pipe(
        concatMap((page) =>
          this.http.get<any>(`${this.apiUrlFontaines}?limit=${limit}&offset=${(page - 1) * limit}`).pipe(
            map((response) => {
              return response.results || [];
            }),
            catchError((error) => {
              console.error('Error fetching fountain data:', error);
              return of([]);
            })
          )
        )
      ).subscribe({
        next: (fontaines) => {
          if (Array.isArray(fontaines) && fontaines.length > 0) {
            fontaines.forEach((fountain: Fountain) => {
              if (!allFontaines.some((existing) => existing.gid === fountain.gid)) {
                allFontaines.push(fountain);
              }
            });
          } else {
            console.warn('Received empty or invalid data:', fontaines);
          }
        },
        complete: () => {
          observer.next(allFontaines);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

}
