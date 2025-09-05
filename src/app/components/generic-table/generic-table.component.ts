import { Component, Input, Output, EventEmitter } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface TableColumn {
  key: string;
  label: string;
  isAction?: boolean; 
  pipe?: string;
  pipeArgs?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: string;
  action: (item: any) => void;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent {
  showDownloadModal: boolean = false;

  openDownloadModal(): void {
    this.showDownloadModal = true;
  }

  closeDownloadModal(): void {
    this.showDownloadModal = false;
  }

  downloadAs(format: 'pdf' | 'xml'): void {
    this.closeDownloadModal();
    if (format === 'pdf') {
      this.downloadPdf();
    } else if (format === 'xml') {
      this.downloadXml();
    }
  }

  downloadXml(): void {
    if (!this.columns?.length || !this.sortedData?.length) return;
    
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<table>\n';
    
    this.sortedData.forEach(row => {
      xmlContent += '  <row>\n';
      this.columns.forEach(col => {
        let value = row[col.key] !== undefined ? String(row[col.key]) : '';
        let escapedValue = value
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
        xmlContent += `    <${col.key}>${escapedValue}</${col.key}>\n`;
      });
      xmlContent += '  </row>\n';
    });
    
    xmlContent += '</table>';
    
    let blob = new Blob([xmlContent], { type: 'application/xml' });
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = 'tabela.xml';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  downloadPdf(): void {
    if (!this.columns?.length || !this.sortedData?.length) return;
    let doc = new jsPDF();
    
    let cleanText = (text: string) => text
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[а-я]/gi, (match) => {
        const map: any = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'z','з':'z','и':'i','ј':'j','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c','ч':'c','ш':'s','ћ':'c','џ':'dz'};
        return map[match.toLowerCase()] || match;
      })
      .replace(/[ćčšžđ]/gi, (match) => {
        const map: any = {'ć':'c','č':'c','š':'s','ž':'z','đ':'dj','Ć':'C','Č':'C','Š':'S','Ž':'Z','Đ':'Dj'};
        return map[match] || match;
      });
    
    let head = [this.columns.map(col => cleanText(col.label))];
    let body = this.sortedData.map(row => 
      this.columns.map(col => {
        let value = row[col.key] !== undefined ? String(row[col.key]) : '';
        return cleanText(value);
      })
    );
    
    autoTable(doc, {
      head,
      body,
      styles: {
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [36, 72, 85],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 248, 248],
      },
      margin: { top: 20 },
    });
    doc.save('tabela.pdf');
  }
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() pageSize: number = 10;
  @Input() rowClickable: boolean = false;
  @Input() actions: TableAction[] = []; 
  @Input() showAddButton: boolean = false;
  @Input() showDownloadButton: boolean = true;
  @Input() addButtonLabel: string = 'Dodaj';
  @Input() addButtonIcon: string = 'add';
  @Output() rowClick = new EventEmitter<any>();
  @Output() addClick = new EventEmitter<void>();

  currentPage: number = 1;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  get sortedData(): any[] {
    if (!this.sortColumn) return this.data;
    return [...this.data].sort((a, b) => {
      let aValue = a[this.sortColumn];
      let bValue = b[this.sortColumn];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (aValue === bValue) return 0;
      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  get pagedData(): any[] {
    let start = (this.currentPage - 1) * this.pageSize;
    return this.sortedData.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  setSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onRowClick(row: any) {
    if (this.rowClickable) {
      this.rowClick.emit(row);
    }
  }

  onActionClick(action: TableAction, item: any, event: Event) {
    event.stopPropagation(); 
    action.action(item);
  }

  get hasActions(): boolean {
    return this.actions && this.actions.length > 0;
  }

  onAddClick() {
    this.addClick.emit();
  }

  trackByFn(index: number, item: any): any {
    return item.id !== undefined ? item.id : index;
  }

  static createEditAction(callback: (item: any) => void): TableAction {
    return {
      label: 'Izmeni',
      color: 'accent',
      action: callback
    };
  }

  static createDeleteAction(callback: (item: any) => void): TableAction {
    return {
      label: 'Obriši',
      color: 'warn',
      action: callback
    };
  }

  static createDefaultActions(
    editCallback: (item: any) => void,
    deleteCallback: (item: any) => void
  ): TableAction[] {
    return [
      this.createEditAction(editCallback),
      this.createDeleteAction(deleteCallback)
    ];
  }

  parseDate(dateValue: any): Date | null {
    if (!dateValue) return null;
    
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    if (typeof dateValue === 'string') {

      let parsed = new Date(dateValue);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    
    return null;
  }

  formatDate(dateValue: any, includeTime: boolean = true): string {
    let date = this.parseDate(dateValue);
    if (!date) return '';
    
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    
    if (includeTime) {
      let hours = date.getHours().toString().padStart(2, '0');
      let minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } else {
      return `${day}/${month}/${year}`;
    }
  }

  isDateField(fieldKey: string): boolean {
    let dateFieldNames = [
      'datum', 'vreme', 'vremePocetka', 'vremeZavrsetka', 'vremePostavljanja', 
      'datumUpisa', 'datumPolaganja', 'datumIzdanja', 'datumKreiranja',
      'createdAt', 'updatedAt', 'timestamp'
    ];
    return dateFieldNames.some(name => fieldKey.toLowerCase().includes(name.toLowerCase()));
  }

  formatDateAuto(dateValue: any): string {
    if (!dateValue) return '';
    
    let date = this.parseDate(dateValue);
    if (!date) return dateValue;
    
    let hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
    
    return this.formatDate(dateValue, hasTime);
  }
}
