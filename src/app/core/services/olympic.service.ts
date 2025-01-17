import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { PieChartData } from '../models/PieChartData';
import { LineChartData } from '../models/LineChartData';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getPieChartData(): Observable<PieChartData[]> {
    return this.olympics$.pipe(
      map((olympics: Olympic[] | null) => {
        if (!olympics) return [];

        return olympics.map((olympic) => ({
          name: olympic.country,
          value: olympic.participations.reduce(
            (sum, p) => sum + p.medalsCount,
            0
          ),
        }));
      })
    );
  }

  getCountryLineChartData(countryName: string): Observable<LineChartData | null> {
    return this.olympics$.pipe(
      map((olympics: Olympic[] | null) => {
        if (!olympics) return null;

        const country = olympics.find((o) => o.country === countryName);
        if (!country) return null;

        return {
          name: country.country,
          series: country.participations.map((p) => ({
            name: p.year.toString(),
            value: p.medalsCount,
          })),
        };
      })
    );
  }

  getOlympics(): Observable<Olympic[] | null> {
    return this.olympics$.asObservable();
  }
}
