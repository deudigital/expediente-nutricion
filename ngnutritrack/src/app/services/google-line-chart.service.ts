import { GoogleChartsBaseService } from './google-charts.base.service';
import { Injectable } from '@angular/core';
import { LineChartConfig } from './../models/LineChartConfig';

declare var google: any;

@Injectable()
export class GoogleLineChartService extends GoogleChartsBaseService {
	constructor() { super(); }
	public BuildLineChart(elementId: String, data: any[], config: LineChartConfig) : void {  
		var chartFunc = () => { return new google.visualization.LineChart(document.getElementById(<string>elementId)); };
		this.buildLineChart(data, config.columns, chartFunc, config.options);
	}
}