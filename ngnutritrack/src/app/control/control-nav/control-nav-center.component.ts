import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { FormControlDataService }     from '../data/formControlData.service';


@Component({
  selector: 'app-control-nav-center',
  templateUrl: './control-nav-center.component.html',
  styles: []
})
export class ControlNavCenterComponent implements OnInit {

	agregadoAPI:number;
	enable_agenda:boolean;

  constructor(private commonService: CommonService, private formControlDataService: FormControlDataService) { }

  ngOnInit() {
	this.getAgregadoAPI();
	this.enable_agenda	=	this.formControlDataService.getFormControlData().canAccessAgenda;
  }

  mouseOut(){
    document.getElementById("invoice-menu-div").className = "dropdown";
  }	

  mouseOver(){
    document.getElementById("invoice-menu-div").className = "dropdown open";
  }


  getAgregadoAPI(){
    this.formControlDataService.getNutricionista()
    .subscribe(
      response => {
        localStorage.setItem("agregadoAPI", response[0].agregadoAPI);
        this.agregadoAPI = response[0].agregadoAPI;
      }, 
      error => {
        console.log(<any>error);
      }
    );
  }

  openFactura(){
    this.commonService.notifyOther({option: 'openModalDatosVacia', prompt: true});
  }  

}
