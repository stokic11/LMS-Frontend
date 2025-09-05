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

      let validators = this.buildValidators(field);
      let value = this.config.data ? (this.config.data[field.name] || null) : null;
      
      if (field.type === 'password') {
        value = '';
      }
      
      if (field.type === 'date' && value) {
        if (typeof value === 'string') {
          let date = new Date(value);
          if (!isNaN(date.getTime())) {
            value = date.toISOString().split('T')[0];
          }
        } else if (value instanceof Date) {
          value = value.toISOString().split('T')[0];
        }
      }

      if (field.type === 'datetime-local' && value) {
        if (typeof value === 'string') {
          let date = new Date(value);
          if (!isNaN(date.getTime())) {
            let year = date.getFullYear();
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let day = String(date.getDate()).padStart(2, '0');
            let hours = String(date.getHours()).padStart(2, '0');
            let minutes = String(date.getMinutes()).padStart(2, '0');
            value = `${year}-${month}-${day}T${hours}:${minutes}`;
          }
        } else if (value instanceof Date) {
          let year = value.getFullYear();
          let month = String(value.getMonth() + 1).padStart(2, '0');
          let day = String(value.getDate()).padStart(2, '0');
          let hours = String(value.getHours()).padStart(2, '0');
          let minutes = String(value.getMinutes()).padStart(2, '0');
          value = `${year}-${month}-${day}T${hours}:${minutes}`;
        }
      }

      if (field.type === 'datetime' && value) {
        if (typeof value === 'string') {
          if (value.includes('.') && value.includes(':')) {
            let parts = value.split(' ');
            if (parts.length >= 4) {
              let datePart = parts[0] + ' ' + parts[1] + ' ' + parts[2];
              let timePart = parts[3];
              
              let dateNumbers = datePart.replace(/\./g, '').split(' ').filter(p => p.trim());
              if (dateNumbers.length === 3) {
                let day = parseInt(dateNumbers[0]);
                let month = parseInt(dateNumbers[1]);
                let year = parseInt(dateNumbers[2]);
                
                let isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                value = `${isoDate}T${timePart}`;
              }
            }
          } else {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              value = date.toISOString().substring(0, 19);
            }
          }
        } else if (value instanceof Date) {
          value = value.toISOString().substring(0, 19);
        }
      }
      
      formControls[field.name] = this.fb.control(value, validators);
    });

    this.form = this.fb.group(formControls, { validators: this.dateRangeValidator });
  }

  dateRangeValidator = (group: AbstractControl): {[key: string]: any} | null => {
    const startDate = group.get('vremePocetka')?.value;
    const endDate = group.get('vremeZavrsetka')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        return { dateRangeInvalid: true };
      }
    }
    
    return null;
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

    if (field.min !== undefined) {
      validators.push(Validators.min(field.min));
    }

    if (field.max !== undefined) {
      validators.push(Validators.max(field.max));
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
      if (control.errors['min']) {
        const min = control.errors['min'].min;
        errors.push(`Vrednost mora biti najmanje ${min}`);
      }
      if (control.errors['max']) {
        const max = control.errors['max'].max;
        errors.push(`Vrednost može biti najviše ${max}`);
      }
    }

    return errors;
  }

  getDynamicText(field: FieldConfig): string {
    if (field.dynamicText && this.form) {
      return field.dynamicText(this.form.value);
    }
    return '';
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

  getDateFromDateTimeString(fieldName: string): Date | null {
    const value = this.form.get(fieldName)?.value;
    if (!value) return null;
    
    if (typeof value === 'string') {
      const cleanValue = value.replace(' ', 'T').split('T')[0];
      return new Date(cleanValue + 'T00:00:00');
    }
    
    return value instanceof Date ? value : null;
  }

  getTimeFromDateTimeString(fieldName: string): string {
    const value = this.form.get(fieldName)?.value;
    if (!value) return '';
    
    if (typeof value === 'string') {
      const timePart = value.replace(' ', 'T').split('T')[1];
      if (timePart) {
        return timePart.substring(0, 5);
      }
    } else if (value instanceof Date) {
      return value.toTimeString().substring(0, 5);
    }
    
    return '';
  }

  updateDate(fieldName: string, newDate: Date | null): void {
    if (!newDate) {
      this.form.get(fieldName)?.setValue('');
      return;
    }

    const currentTime = this.getTimeFromDateTimeString(fieldName) || '00:00';
    const dateStr = newDate.toISOString().split('T')[0];
    const newDateTime = `${dateStr}T${currentTime}:00`;
    
    this.form.get(fieldName)?.setValue(newDateTime);
  }

  updateTime(fieldName: string, newTime: string): void {
    if (!newTime) return;

    const currentDate = this.getDateFromDateTimeString(fieldName);
    if (!currentDate) {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const newDateTime = `${dateStr}T${newTime}:00`;
      this.form.get(fieldName)?.setValue(newDateTime);
    } else {
      const dateStr = currentDate.toISOString().split('T')[0];
      const newDateTime = `${dateStr}T${newTime}:00`;
      this.form.get(fieldName)?.setValue(newDateTime);
    }
  }
}
