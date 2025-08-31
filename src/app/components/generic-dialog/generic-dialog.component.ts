import { Component, Inject, OnInit, Input, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogConfig, FieldConfig } from './field-config.interface';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.css'
})
export class GenericDialogComponent implements OnInit {
  @Input() data?: DialogConfig;
  
  form!: FormGroup;
  config: DialogConfig;
  isNew: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<GenericDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public injectedData: DialogConfig
  ) {
    
    this.config = this.data || this.injectedData || {} as DialogConfig;
    this.isNew = this.config.isNew || false;
    if (this.config.fields) {
      this.buildForm();
    }
  }

  ngOnInit(): void {
    
    if (!this.config.fields && this.data) {
      this.config = this.data;
      this.isNew = this.config.isNew || false;
      this.buildForm();
    }
  }

  private buildForm(): void {
    const formControls: { [key: string]: AbstractControl } = {};

    this.config.fields.forEach(field => {
      
      if (!this.isFieldVisible(field)) {
        return;
      }

      const validators = this.buildValidators(field);
      const value = this.config.data ? (this.config.data[field.name] || null) : null;
      
      formControls[field.name] = this.fb.control(value, validators);
    });

    this.form = this.fb.group(formControls);
  }

  private buildValidators(field: FieldConfig): any[] {
    const validators: any[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    if (field.minLength) {
      validators.push(Validators.minLength(field.minLength));
    }

    if (field.maxLength) {
      validators.push(Validators.maxLength(field.maxLength));
    }

    return validators;
  }

  private isFieldVisible(field: FieldConfig): boolean {
    if (field.showOnNew === undefined && field.showOnEdit === undefined) {
      return true;
    }
    if (field.showOnNew !== undefined && field.showOnNew === this.isNew) {
      return true;
    }
    if (field.showOnEdit !== undefined && field.showOnEdit !== this.isNew) {
      return true;
    }
    return false;
  }

  getVisibleFields(): FieldConfig[] {
    return this.config.fields.filter(field => this.isFieldVisible(field));
  }

  getFieldErrors(fieldName: string): string[] {
    const control = this.form.get(fieldName);
    const errors: string[] = [];

    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        const field = this.config.fields.find(f => f.name === fieldName);
        errors.push(`${field?.label || fieldName} je obavezno`);
      }
      if (control.errors['email']) {
        errors.push('Email format nije valjan');
      }
      if (control.errors['minlength']) {
        const minLength = control.errors['minlength'].requiredLength;
        errors.push(`Mora imati najmanje ${minLength} karaktera`);
      }
      if (control.errors['maxlength']) {
        const maxLength = control.errors['maxlength'].requiredLength;
        errors.push(`Može imati najviše ${maxLength} karaktera`);
      }
    }

    return errors;
  }

  onSave(): void {
    if (this.form.valid) {
      let formValue = { ...this.form.value };
      
      
      if (!this.isNew && this.config.data?.id) {
        formValue.id = this.config.data.id;
      }

      
      if (this.config.customProcessing) {
        formValue = this.config.customProcessing(formValue, this.isNew);
      }

      
      if (this.config.customSave) {
        this.isLoading = true;
        this.config.customSave(formValue, this.isNew).then((result) => {
          this.isLoading = false;
          if (this.dialogRef) {
            this.dialogRef.close(result);
          }
        }).catch((error) => {
          this.isLoading = false;
          console.error('Error in custom save:', error);
          
        });
      } else {
        
        if (this.dialogRef) {
          this.dialogRef.close(formValue);
        }
      }
    }
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  get title(): string {
    return this.config.title;
  }
}
