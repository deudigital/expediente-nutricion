import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  showResetPassword:boolean=false;
  showFormLogin:boolean=true;
  constructor() { }

  ngOnInit() {
  }
  resetPassword(){
    this.showResetPassword=true;
    this.showFormLogin=false;
  }
  showLogin(){
    this.showResetPassword=false;
    this.showFormLogin=true;
  }

}
