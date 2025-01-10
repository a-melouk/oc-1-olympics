import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { PieChartData } from '../../core/models/Models';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
  pieChartData: PieChartData[] = [];

  // Chart options
  view: [number, number] = [700, 400];
  gradient = false;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe(() => {
      this.olympicService.getPieChartData().subscribe(data => {
        console.log('Pie Chart Data:', data); // Debug log
        this.pieChartData = data;
      });
    });
  }

  onSelect(event: any): void {
    // Navigate to details page with the country name
    this.router.navigate(['/details', event.name]);
  }
}
