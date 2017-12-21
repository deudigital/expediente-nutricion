declare var google: any;

export class GoogleChartsBaseService {
  constructor() { 
    google.charts.load('current', {'packages':['corechart', 'line']});
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
		console.log('data');
		console.log(data);
		
		var datatable = new google.visualization.DataTable();
		/*datatable.addColumn('number', 'X');
		datatable.addColumn('number', 'Dogs');*/
		
		for(var i in columns)
			datatable.addColumn(columns[i].type, columns[i].label);
		

		datatable.addRows(data);
		chartFunc().draw(datatable, options);
    };   
    var callback = () => func(chartFunc, options);
    google.charts.setOnLoadCallback(callback);
  }

  
}