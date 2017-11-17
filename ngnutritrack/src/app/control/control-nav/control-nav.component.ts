import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-nav',
  templateUrl: './control-nav.component.html',
  styles: []
})
export class ControlNavComponent implements OnInit {
  showDatosPaciente:boolean=false;
  class_toggle:string='';
  constructor() { }

  ngOnInit() {
  }
  toggleDatosPaciente(){
    this.showDatosPaciente  = !this.showDatosPaciente;
    this.class_toggle = (this.showDatosPaciente? ' opened':'');

  }

}
