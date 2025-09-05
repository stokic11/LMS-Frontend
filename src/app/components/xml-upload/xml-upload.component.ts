import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { XmlService } from '../../services/xml.service';

@Component({
  selector: 'app-xml-upload',
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './xml-upload.component.html',
  styleUrl: './xml-upload.component.css'
})
export class XmlUploadComponent {
  selectedFile: File | null = null;
  xmlContent: string = '';
  xmlExample = ``;

  constructor(
    private xmlService: XmlService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.xmlService.uploadXmlFile(this.selectedFile).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Zatvori', { duration: 3000 });
          this.selectedFile = null;
        },
        error: (error) => {
          this.snackBar.open(error.error.error || 'Greška pri upload-u', 'Zatvori', { duration: 5000 });
        }
      });
    }
  }

  submitXmlContent() {
    if (this.xmlContent) {
      this.xmlService.submitXmlContent(this.xmlContent).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Zatvori', { duration: 3000 });
          this.xmlContent = '';
        },
        error: (error) => {
          this.snackBar.open(error.error.error || 'Greška pri obradi XML-a', 'Zatvori', { duration: 5000 });
        }
      });
    }
  }
}
