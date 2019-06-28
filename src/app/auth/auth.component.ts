import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../api/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  private form: FormGroup;
  private returnUrl: string;
  private submitted = false;
  private invalid = false;
  private logged = false;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl('', {validators: [Validators.required, this.validatePassword]})
    }, {updateOn: 'submit'});
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/planets';
  }
  get password(): string {
    return this.form.get('password').value;
  }

  validatePassword(c: FormControl) {
    const password = 'Alamakota1';
    return c.value === password ? null : {validatePassword: {valid: false}};
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.invalid = true;
      setTimeout(() => {
        this.invalid = false;
      }, 500);
      return;
    }
    this.authService.login(this.password);
    this.logged = true;
    this.router.navigate([this.returnUrl]);
  }

}
