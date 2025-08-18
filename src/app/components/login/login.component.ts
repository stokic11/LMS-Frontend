import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { NgClass, NgIf } from '@angular/common';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  loading = false;
  submitted = false;
  returnUrl: string = '';
  error: string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }
  
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      korisnickoIme: ['', Validators.required], 
      password: ['', Validators.required]
    });

   
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
 
  get fval() { return this.loginForm.controls; }
  
  onFormSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }
  
    this.loading = true;
    
   
    this.authenticationService.login(this.fval['korisnickoIme'].value, this.fval['password'].value)
      .subscribe({
        next: (data) => {
          console.log('Login successful:', data);
          
          // Proverim da li je korisnik student i redirectujem ga na odgovarajuću stranicu
          if (this.authenticationService.hasRole('student')) {
            this.router.navigate(['/student-homepage']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.error = error.error?.message || 'Login failed. Please try again.';
          this.loading = false;
          this.submitted = false;
        },
        complete: () => {
          this.loading = false;
          this.submitted = false;
        }
      });
  }
}