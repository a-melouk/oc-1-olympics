import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from '../../core/services/olympic.service';
import { PieChartData } from 'src/app/core/models/PieChartData';
import { Olympic } from 'src/app/core/models/Olympic';
import { Observable, of } from 'rxjs';
import { LegendPosition } from '@swimlane/ngx-charts';

interface ChartSelectEvent {
  name: string;
  value: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>(); // Subject to manage subscription lifecycle

  public olympics$: Observable<Olympic[] | null> = of(null);
  pieChartData: PieChartData[] = [];
  numberOfCountries: number = 0;
  numberOfJos: number = 0;

  // Chart options
  view: [number, number] = [700, 400]; // Initial dimensions
  gradient = false;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendPosition: LegendPosition = LegendPosition.Below;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.onResize(); // Set initial dimensions and legend position
    this.olympicService
      .loadInitialData()
      .pipe(takeUntil(this.destroy$)) // Unsubscribe when destroy$ emits
      .subscribe(() => {
        this.olympicService
          .getOlympics()
          .pipe(takeUntil(this.destroy$)) // Unsubscribe when destroy$ emits
          .subscribe((olympics: Olympic[] | null) => {
            if (olympics) {
              // Number of countries is the length of the array
              this.numberOfCountries = olympics.length;
              // Number of JOs is the length of participations of any country (they're all the same)
              this.numberOfJos = olympics[0]?.participations.length || 0;
            }
          });

        this.olympicService
          .getPieChartData()
          .pipe(takeUntil(this.destroy$)) // Unsubscribe when destroy$ emits
          .subscribe((data: PieChartData[]) => {
            this.pieChartData = data;
          });
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any): void {
    const width = window.innerWidth * 0.9; // 90% of window width
    const height = window.innerHeight * 0.5; // 50% of window height
    this.view = [width, height];

    // Adjust legend position based on screen width
    if (window.innerWidth <= 600) {
      this.legendPosition = LegendPosition.Below; // Move legend to the bottom
    } else {
      this.legendPosition = LegendPosition.Right; // Default to right
    }
  }

  onSelect(event: ChartSelectEvent): void {
    // Navigate to details page with the country name
    this.router.navigate(['/details', event.name]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
