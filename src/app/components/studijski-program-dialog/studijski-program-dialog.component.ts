import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogConfigService } from '../generic-dialog/dialog-config.service';
import { DialogConfig } from '../generic-dialog/field-config.interface';
import { StudijskiProgram } from '../../models/studijskiProgram';
import { StudijskiProgramService } from '../../services/studijskiProgram/studijski-program.service';
import { FakultetService } from '../../services/fakultet/fakultet.service';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { Fakultet } from '../../models/fakultet';
import { Nastavnik } from '../../models/nastavnik';

export interface StudijskiProgramDialogData {
  studijskiProgram?: StudijskiProgram;
  isEdit: boolean;
}

@Component({
  selector: 'app-studijski-program-dialog',
  standalone: true,
  imports: [
    CommonModule,
    GenericDialogComponent,
    MatDialogModule
  ],
  templateUrl: './studijski-program-dialog.component.html',
  styleUrl: './studijski-program-dialog.component.css'
})
export class StudijskiProgramDialogComponent implements OnInit {
  dialogConfig: any;
  fakulteti: Fakultet[] = [];
  nastavnici: Nastavnik[] = [];

  constructor(
    private dialogRef: MatDialogRef<StudijskiProgramDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudijskiProgramDialogData,
    private studijskiProgramService: StudijskiProgramService,
    private fakultetService: FakultetService,
    private nastavnikService: NastavnikService,
    private configService: DialogConfigService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    
    Promise.all([
      this.fakultetService.getAll().toPromise(),
      this.nastavnikService.getAll().toPromise()
    ]).then(([fakulteti, nastavnici]) => {
      this.fakulteti = Array.from(fakulteti || []);
      this.nastavnici = Array.from(nastavnici || []);
      
      
      const isNew = !this.data.isEdit;
      const entityData = this.data.studijskiProgram || {};
      
      const config = this.configService.getStudijskiProgramConfig(
        entityData, 
        isNew, 
        this.fakulteti, 
        this.nastavnici
      );
      
      
      config.customSave = (formValue: any, isNewProgram: boolean) => {
        const studijskiProgram: StudijskiProgram = {
          naziv: formValue.naziv,
          fakultetId: formValue.fakultetId,
          rukovodilaId: formValue.rukovodilaId,
          godineStudijaIds: formValue.godineStudijaIds || []
        };

        if (!isNewProgram && this.data.studijskiProgram?.id) {
          studijskiProgram.id = this.data.studijskiProgram.id;
          return this.studijskiProgramService.update(studijskiProgram.id, studijskiProgram).toPromise()
            .then((result: any) => {
              return result;
            })
            .catch((error: any) => {
              console.error('Greška pri ažuriranju studijskog programa:', error);
              alert('Greška pri ažuriranju studijskog programa.');
              throw error;
            });
        } else {
          return this.studijskiProgramService.create(studijskiProgram).toPromise()
            .then((result: any) => {
              return result;
            })
            .catch((error: any) => {
              console.error('Greška pri kreiranju studijskog programa:', error);
              alert('Greška pri kreiranju studijskog programa.');
              throw error;
            });
        }
      };
      
      this.dialogConfig = config;
    }).catch(error => {
      console.error('Greška pri učitavanju podataka:', error);
      
      const isNew = !this.data.isEdit;
      const entityData = this.data.studijskiProgram || {};
      this.dialogConfig = this.configService.getStudijskiProgramConfig(entityData, isNew, [], []);
    });
  }
}
