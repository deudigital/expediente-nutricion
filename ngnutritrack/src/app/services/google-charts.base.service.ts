declare var google: any;

export class GoogleChartsBaseService {
  constructor() { 
    google.charts.load('current', {'packages':['corechart', 'line'], 'language':'es'});
  }

  protected buildChart(data: any[], chartFunc: any, options: any) : void {
    var func = (chartFunc, options) => {
      var datatable = google.visualization.arrayToDataTable(data);
      chartFunc().draw(datatable, options);
    };   
    var callback = () => func(chartFunc, options);
    google.charts.setOnLoadCallback(callback);
  }
  protected buildLineChart(data: any[], columns: any, chartFunc: any, options: any) : void {
    var func = (chartFunc, options) => {
		var datatable = new google.visualization.DataTable();		
		for(var i in columns)
			datatable.addColumn(columns[i]);//datatable.addColumn(columns[i].type, columns[i].label);	

		datatable.addRows(data);
		chartFunc().draw(datatable, options);
    };   
    var callback = () => func(chartFunc, options);
    google.charts.setOnLoadCallback(callback);
  }
}