import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { PieChartData } from 'src/app/core/models/PieChartData';
import { Olympic } from 'src/app/core/models/Olympic';
import { Observable, of } from 'rxjs';

interface ChartSelectEvent {
  name: string;
  value: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);
  pieChartData: PieChartData[] = [];
  numberOfCountries: number = 0;
  numberOfJos: number = 0;

  // Chart options
  view: [number, number] = [700, 400];
  gradient = false;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe(() => {
      this.olympicService.getOlympics().subscribe((olympics: Olympic[] | null) => {
        if (olympics) {
          // Number of countries is the length of the array
          this.numberOfCountries = olympics.length;
          // Number of JOs is the length of participations of any country (they're all the same)
          this.numberOfJos = olympics[0]?.participations.length || 0;
        }
      });
      this.olympicService.getPieChartData().subscribe((data: PieChartData[]) => {
        console.log('Pie Chart Data:', data); // Debug log
        this.pieChartData = data;
      });
    });
  }

  onSelect(event: ChartSelectEvent): void {
    // Navigate to details page with the country name
    this.router.navigate(['/details', event.name]);
  }
}
