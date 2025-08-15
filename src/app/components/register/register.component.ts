import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AuthenticationService, RegistrationRequest } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      korisnickoIme: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      datumRodjenja: [''],
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
    });
  }

  get fval() { return this.registerForm.controls; }

  onFormSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const registrationRequest: RegistrationRequest = {
      korisnickoIme: this.fval['korisnickoIme'].value,
      email: this.fval['email'].value,
      password: this.fval['password'].value,
      ime: this.fval['ime'].value,
      prezime: this.fval['prezime'].value,
      datumRodjenja: this.fval['datumRodjenja'].value ? new Date(this.fval['datumRodjenja'].value) : undefined
    };

    this.authService.register(registrationRequest).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.error = error.error?.message || 'Registration failed. Please try again.';
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

