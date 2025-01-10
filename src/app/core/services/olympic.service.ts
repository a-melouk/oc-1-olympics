import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap,map } from 'rxjs/operators';
import { Olympic, PieChartData } from '../models/Models';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getPieChartData() {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        if (!olympics) return [];

        return olympics.map(olympic => ({
          name: olympic.country,
          value: olympic.participations.reduce((sum, p) => sum + p.medalsCount, 0)
        }));
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
