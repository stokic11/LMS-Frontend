import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IshodService } from '../../services/ishod/ishod.service';
import { ObrazovniCiljService } from '../../services/obrazovniCilj/obrazovni-cilj.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Ishod } from '../../models/ishod';
import { ObrazovniCilj } from '../../models/obrazovniCilj';

interface IshodEdit extends Ishod {
  isCreatingNewCilj?: boolean;
  newCiljOpis?: string;
}

export interface SilabusDialogData {
  predmetId: number;
  predmetNaziv: string;
  ishodi: Ishod[];
}

@Component({
  selector: 'app-silabus-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './silabus-edit-dialog.component.html',
  styleUrl: './silabus-edit-dialog.component.css'
})
export class SilabusEditDialogComponent implements OnInit {
  ishodi: IshodEdit[] = [];
  dataSource = new MatTableDataSource<IshodEdit>([]);
  obrazovniCiljevi: ObrazovniCilj[] = [];
  displayedColumns: string[] = ['opis', 'obrazovniCilj', 'actions'];
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<SilabusEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SilabusDialogData,
    private ishodService: IshodService,
    private obrazovniCiljService: ObrazovniCiljService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.ishodi = [...this.data.ishodi];
    this.dataSource.data = this.ishodi;
    this.loadObrazovniCiljevi();
  }

  loadObrazovniCiljevi() {
    this.obrazovniCiljService.getAll().subscribe({
      next: (ciljevi) => {
        this.obrazovniCiljevi = Array.from(ciljevi);
      },
      error: (error) => {
        console.error('Greška pri učitavanju obrazovnih ciljeva:', error);
      }
    });
  }

  addNewIshod() {
    const newIshod: IshodEdit = {
      opis: '',
      predmetId: this.data.predmetId,
      obrazovniCilj: { opis: '', ishodiIds: [] },
      isCreatingNewCilj: false
    };
    this.ishodi.push(newIshod);
    this.dataSource.data = [...this.ishodi];
  }

  deleteIshod(index: number) {
    let ishod = this.ishodi[index];
    if (ishod.id) {
      this.loading = true;
      this.ishodService.delete(ishod.id).subscribe({
        next: () => {
          this.ishodi.splice(index, 1);
          this.dataSource.data = [...this.ishodi];
          this.loading = false;
        },
        error: (error) => {
          console.error('Greška pri brisanju ishoda:', error);
          this.loading = false;
        }
      });
    } else {
      this.ishodi.splice(index, 1);
      this.dataSource.data = [...this.ishodi];
    }
  }

  private convertToIshodDTO(ishod: IshodEdit): any {
    let ishodDTO = {
      id: ishod.id,
      opis: ishod.opis,
      predmetId: ishod.predmetId,
      obrazovniCilj: {
        id: ishod.obrazovniCilj?.id,
        opis: ishod.obrazovniCilj?.opis,
        ishodiIds: ishod.obrazovniCilj?.ishodiIds || []
      }
    };
    
    return ishodDTO;
  }

  saveChanges() {
    this.loading = true;
    const operations: Observable<any>[] = [];

    for (let i = 0; i < this.ishodi.length; i++) {
      let ishod = this.ishodi[i];
      
      if (ishod.opis.trim()) {
        if (ishod.id) {
          let ishodDTO = this.convertToIshodDTO(ishod);
          let putOp = this.ishodService.put(ishod.id, ishodDTO).pipe(
            catchError(error => {
              console.error('Greška pri ažuriranju ishoda:', error);
              throw error;
            })
          );
          operations.push(putOp);
        } else {
          let ishodDTO = this.convertToIshodDTO(ishod);
          let postOp = this.ishodService.create(ishodDTO).pipe(
            catchError(error => {
              console.error('Greška pri kreiranju ishoda:', error);
              throw error;
            })
          );
          operations.push(postOp);
        }
      }
    }

    if (operations.length === 0) {
      this.loading = false;
      this.dialogRef.close(true);
      return;
    }

    forkJoin(operations).subscribe({
      next: (results: any[]) => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error('Greška pri čuvanju izmena:', error);
        this.loading = false;
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  onObrazovniCiljChange(ishod: IshodEdit, ciljId: number | string) {
    if (ciljId === 'new') {
      ishod.isCreatingNewCilj = true;
      ishod.newCiljOpis = '';
    } else {
      let cilj = this.obrazovniCiljevi.find(c => c.id === Number(ciljId));
      if (cilj) {
        ishod.obrazovniCilj = cilj;
        ishod.isCreatingNewCilj = false;
      }
    }
  }

  saveNewObrazovniCilj(ishod: IshodEdit) {
    if (ishod.newCiljOpis && ishod.newCiljOpis.trim()) {
      let noviCiljDTO = {
        opis: ishod.newCiljOpis.trim(),
        ishodiIds: []
      };

      this.obrazovniCiljService.create(noviCiljDTO).subscribe({
        next: (createdCilj) => {
          this.obrazovniCiljevi.push(createdCilj);
          ishod.obrazovniCilj = createdCilj;
          ishod.isCreatingNewCilj = false;
          ishod.newCiljOpis = '';
        },
        error: (error) => {
          console.error('Greška pri kreiranju novog obrazovnog cilja:', error);
          ishod.isCreatingNewCilj = false;
        }
      });
    } else {
      ishod.isCreatingNewCilj = false;
    }
  }
}
