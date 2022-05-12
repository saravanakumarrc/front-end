import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from './app.service';
import { Reading } from './reading';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements AfterViewInit, OnDestroy {

  constructor(private appService: AppService){

  }

  destroy$: Subject<boolean> = new Subject<boolean>();

  chartData = [
    {
      data: [330, 600, 260, 700],
      label: 'AC'
    },
    {
      data: [120, 455, 100, 340],
      label: 'Fridge'
    },
    {
      data: [45, 67, 800, 500],
      label: 'Fan'
    }
  ];

  chartLabels = [
    '12pm',
    '1pm',
    '2pm',
    '3pm'
  ];

  chartOptions = {
    responsive: true
  };

  ngAfterViewInit(){
    this.getAllReadings();
  }

  newDataPoint(dataArr = [100, 100, 100], label: string) {
    this.chartData.forEach((dataset, index) => {
      this.chartData[index] = Object.assign({}, this.chartData[index], {
        data: [...this.chartData[index].data, dataArr[index]]
      });
    });

    this.chartLabels = [...this.chartLabels, label];
  }

  getAllReadings() {
    this.appService.getReadings().pipe(takeUntil(this.destroy$)).subscribe((readings) => {      
        this.chartData = [];
        console.log(readings);
        const deviceIds = this.getDistinctDeviceId(readings);
        console.log(deviceIds);
        
        deviceIds.forEach(deviceId =>{
          this.chartData.push({ label: deviceId, data: this.getReadingsOfDeviceId(readings, deviceId) });
        });

        console.log(this.chartData);        
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getDistinctDeviceId(readings: Reading[]){
    return [...new Set(readings.map((reading) => reading.deviceId))]
  }

  getReadingsOfDeviceId(readings: Reading[], deviceId: string){
    return readings.filter(reading => reading.deviceId === deviceId).map(readings => readings.usage);
  }
}
