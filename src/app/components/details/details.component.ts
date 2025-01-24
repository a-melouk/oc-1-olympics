import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from '../../core/services/olympic.service';
import { Participation } from 'src/app/core/models/Participation';
import { Olympic } from 'src/app/core/models/Olympic';
import { LineChartData } from 'src/app/core/models/LineChartData';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>(); // Subject to manage subscription lifecycle

  countryName: string = '';
  numberOfEntries: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;
  lineChartData: LineChartData[] = [];

  // Chart options
  view: [number, number] = [800, 400];
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Years';
  yAxisLabel: string = 'Number of medals';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.onResize(); // Set initial dimensions
    const country = this.route.snapshot.params['country'];

    // Check if country exists first
    this.olympicService
      .loadInitialData()
      .pipe(takeUntil(this.destroy$)) // Unsubscribe when destroy$ emits
      .subscribe(() => {
        this.olympicService
          .getOlympics()
          .pipe(takeUntil(this.destroy$)) // Unsubscribe when destroy$ emits
          .subscribe((olympics: Olympic[] | null) => {
            const countryData = olympics?.find(
              (o: Olympic) => o.country === country
            );

            // Redirect immediately if country not found
            if (!countryData) {
              this.router.navigate(['/not-found']);
              return;
            }

            // Only set data and continue if country exists
            this.countryName = country;
            this.numberOfEntries = countryData.participations.length;
            this.totalMedals = countryData.participations.reduce(
              (sum: number, p: Participation) => sum + p.medalsCount,
              0
            );
            this.totalAthletes = countryData.participations.reduce(
              (sum: number, p: Participation) => sum + p.athleteCount,
              0
            );

            this.olympicService
              .getCountryLineChartData(country)
              .pipe(takeUntil(this.destroy$)) // Unsubscribe when destroy$ emits
              .subscribe((data: LineChartData | null) => {
                if (data) {
                  this.lineChartData = [data];
                }
              });
          });
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any): void {
    const width = window.innerWidth * 0.9; // 90% of window width
    const height = window.innerHeight * 0.5; // 50% of window height
    this.view = [width, height];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
