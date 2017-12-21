import { GoogleChartsBaseService } from './google-charts.base.service';
import { Injectable } from '@angular/core';
import { LineChartConfig } from './../Models/LineChartConfig';

declare var google: any;

@Injectable()
export class GoogleLineChartService extends GoogleChartsBaseService {

  constructor() { super(); }

  public BuildLineChart(elementId: String, data: any[], config: LineChartConfig) : void {  
    var chartFunc = () => { return new google.visualization.LineChart(document.getElementById(<string>elementId)); };
/*    var options = {
            title: config.title,
             hAxis: {
			  title: 'Time'
			},
			vAxis: {
			  title: 'Popularity'
			}
      };
	 var columns	= [
						{label: 'X', type: 'number'},
						{label: 'Dogsss', type: 'number'},						
					];*/
    this.buildLineChart(data, config.columns, chartFunc, config.options);
  }
}