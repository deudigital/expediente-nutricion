import { Component, Input, OnInit } from '@angular/core';

import { GoogleLineChartService } from './../../Services/google-line-chart.service';
import { LineChartConfig } from './../../Models/LineChartConfig';

declare var google: any;


@Component({
  selector: 'line-chart',
  templateUrl: './linechart.component.html'
})
export class LineChartComponent implements OnInit {

    @Input() data: any[];
    @Input() config: LineChartConfig;
    @Input() elementId: String;

    constructor(private _lineChartService: GoogleLineChartService) {}

    ngOnInit(): void {
        this._lineChartService.BuildLineChart(this.elementId, this.data, this.config); 
    }
}