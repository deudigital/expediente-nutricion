import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-otros-habitos',
  templateUrl: './otros-habitos.component.html',
  styles: []
})
export class OtrosHabitosComponent implements OnInit {

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
