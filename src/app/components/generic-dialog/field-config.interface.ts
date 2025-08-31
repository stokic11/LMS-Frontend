export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: { value: any; label: string }[];
  fullWidth?: boolean;
  rows?: number; 
  minLength?: number;
  maxLength?: number;
  showOnNew?: boolean;
  showOnEdit?: boolean;
}

export interface DialogConfig {
  title: string;
  subtitle?: string;
  icon?: string;
  fields: FieldConfig[];
  data?: any;
  isNew?: boolean;
  customProcessing?: (formValue: any, isNew: boolean) => any;
  customSave?: (formValue: any, isNew: boolean) => Promise<any>;
}
