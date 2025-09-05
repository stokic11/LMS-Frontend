import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogConfigService } from '../generic-dialog/dialog-config.service';
import { DialogConfig } from '../generic-dialog/field-config.interface';

@Component({
  selector: 'app-korisnik-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    GenericDialogComponent,
    MatDialogModule
  ],
  templateUrl: './korisnik-edit-dialog.component.html',
  styleUrl: './korisnik-edit-dialog.component.css'
})
export class KorisnikEditDialogComponent implements OnInit {
  dialogConfig: DialogConfig;

  constructor(
    private dialogRef: MatDialogRef<KorisnikEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private configService: DialogConfigService
  ) {
    
    let isNew = data.isNew || false;
    this.dialogConfig = this.configService.getKorisnikConfig(data, isNew);
  }

  ngOnInit(): void {}
}
