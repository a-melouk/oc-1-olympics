import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { Olympic, Participation } from 'src/app/core/models/Models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  countryName: string = '';
  numberOfEntries: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;
  lineChartData: any[] = [];

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
    private olympicService: OlympicService
  ) {}

  ngOnInit() {
    const country = this.route.snapshot.params['country'];
    this.countryName = country;

    this.olympicService.getOlympics().subscribe((olympics) => {
      const countryData = olympics?.find((o: Olympic) => o.country === country);
      if (countryData) {
        this.numberOfEntries = countryData.participations.length;
        this.totalMedals = countryData.participations.reduce(
          (sum: number, p: Participation) => sum + p.medalsCount,
          0
        );
        this.totalAthletes = countryData.participations.reduce(
          (sum: number, p: Participation) => sum + p.athleteCount,
          0
        );
      }
    });

    this.olympicService.getCountryLineChartData(country).subscribe((data) => {
      if (data) {
        this.lineChartData = [data];
      }
    });
  }
}
