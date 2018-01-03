import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styles: []
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) {
	localStorage.removeItem('token');
	localStorage.removeItem('nutricionista_id');
	this.router.navigateByUrl('/login');
  }

  ngOnInit() {
  }

}
