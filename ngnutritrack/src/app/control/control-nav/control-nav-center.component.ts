import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-control-nav-center',
  templateUrl: './control-nav-center.component.html',
  styles: []
})
export class ControlNavCenterComponent implements OnInit {

  constructor(private commonService: CommonService) { }

  ngOnInit() {
  }

  mouseOut(){
    document.getElementById("invoice-menu-div").className = "dropdown";
  }	

  mouseOver(){
    document.getElementById("invoice-menu-div").className = "dropdown open";
  }

  openFactura(){
    this.commonService.notifyOther({option: 'openModalDatos'});
  }  

}
