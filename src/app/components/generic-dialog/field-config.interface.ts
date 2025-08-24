export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: any; label: string }[];
  fullWidth?: boolean;
  minLength?: number;
  maxLength?: number;
  showOnNew?: boolean;
  showOnEdit?: boolean;
}

export interface DialogConfig {
  title: string;
  fields: FieldConfig[];
  data?: any;
  isNew?: boolean;
  customProcessing?: (formValue: any, isNew: boolean) => any;
  customSave?: (formValue: any, isNew: boolean) => Promise<any>;
}
