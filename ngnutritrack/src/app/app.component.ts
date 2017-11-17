import { Component, OnInit, Input }   from '@angular/core';

import { FormDataService }            from './data/formData.service';
import { FormControlDataService }            from './control/data/formControlData.service';

@Component ({
    selector:     'nutri-track-app'
    ,templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
    title = 'Nutri Track';
    @Input() formData;
    @Input() formControlData;
    
    constructor(private formDataService: FormDataService, private formControlDataService: FormControlDataService) {
    }

    ngOnInit() {
        this.formData = this.formDataService.getFormData();
        this.formControlData = this.formControlDataService.getFormControlData();
        /*console.log(this.title + ' loaded!');*/
    }
	get currentFormControlData() {
		return JSON.stringify(this.formControlData);
	}
}