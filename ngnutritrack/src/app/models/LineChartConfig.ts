export class LineChartConfig {
    title: string;
	options:any;
	columns:any;

    constructor(title: string, options:any, columns:any) {
        this.title 		=	title;
        this.options	=	options;
        this.columns	=	columns;
    }
}