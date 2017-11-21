import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-valoracion-dietetica',
  templateUrl: './valoracion-dietetica.component.html',
  styles: []
})
export class ValoracionDieteticaComponent implements OnInit {
	body:any;
  constructor() { }

	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.body.classList.add('menu-parent-habito');	
	}
	ngOnDestroy(){
		this.body.classList.remove('menu-parent-habito');	
	}

}
