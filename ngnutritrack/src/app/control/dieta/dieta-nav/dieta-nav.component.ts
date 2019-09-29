import { Component, OnInit } from '@angular/core';

import { FormControlDataService }     from '../../data/formControlData.service';

@Component({
  selector: 'app-dieta-nav',
  templateUrl: './dieta-nav.component.html',
  styles: []
})
export class DietaNavComponent implements OnInit {

  constructor(private formControlDataService: FormControlDataService) {
  }

  ngOnInit() {
  }

}
