import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-nav-center',
  templateUrl: './control-nav-center.component.html',
  styles: []
})
export class ControlNavCenterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
   mouseOut(){
    document.getElementById("invoice-menu-div").className = "dropdown";
  }	

  mouseOver(){
    document.getElementById("invoice-menu-div").className = "dropdown open";
  }

}
