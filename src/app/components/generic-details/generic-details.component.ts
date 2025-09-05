import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

export interface InfoSection {
  title: string;
  icon: string;
  items: InfoItem[];
}

export interface InfoItem {
  label: string;
  value: any;
  type?: 'text' | 'email' | 'link' | 'paragraph';
  href?: string;
}

export interface TableSection {
  title: string;
  icon: string;
  data: any[];
  displayedColumns: string[];
  columnLabels: { [key: string]: string };
  expandable?: boolean;
  groupBy?: string;
  groupLabelFunction?: (group: any, index: number) => string;
  groupDescriptionFunction?: (group: any) => string;
  editable?: boolean;
}

@Component({
  selector: 'app-generic-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './generic-details.component.html',
  styleUrl: './generic-details.component.css'
})
export class GenericDetailsComponent {
  @Input() title: string = '';
  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Input() backButtonText: string = 'Nazad';
  @Input() backButtonRoute: string = '';
  @Input() infoSections: InfoSection[] = [];
  @Input() tableSections: TableSection[] = [];
  
  @Output() backButtonClick = new EventEmitter<void>();
  @Output() editTableSectionClick = new EventEmitter<TableSection>();

  constructor(private router: Router) {}

  goBack(): void {
    if (this.backButtonRoute) {
      this.router.navigate([this.backButtonRoute]);
    } else {
      this.backButtonClick.emit();
    }
  }

  editTableSection(tableSection: TableSection): void {
    this.editTableSectionClick.emit(tableSection);
  }

  getGroupedData(tableSection: TableSection): any[] {
    if (!tableSection.groupBy) {
      return [{ items: tableSection.data }];
    }

    const grouped: { [key: string]: any[] } = {};
    tableSection.data.forEach(item => {
      let groupKey = item[tableSection.groupBy!];
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(item);
    });

    return Object.keys(grouped).map((key, index) => ({
      groupKey: key,
      items: grouped[key],
      label: tableSection.groupLabelFunction ? 
        tableSection.groupLabelFunction(grouped[key], index) : 
        `Grupa ${index + 1}`,
      description: tableSection.groupDescriptionFunction ? 
        tableSection.groupDescriptionFunction(grouped[key]) : 
        `${grouped[key].length} stavki`
    }));
  }

  getTotalESPB(predmeti: any[]): number {
    if (!predmeti) return 0;
    return predmeti.reduce((total, predmet) => total + (predmet.espb || 0), 0);
  }

  formatValue(item: InfoItem): string {
    if (item.value === null || item.value === undefined) {
      return '';
    }
    
    if (typeof item.value === 'boolean') {
      return item.value ? 'Da' : 'Ne';
    }
    
    return item.value.toString();
  }

  isEmail(type?: string): boolean {
    return type === 'email';
  }

  isLink(type?: string): boolean {
    return type === 'link';
  }

  isParagraph(type?: string): boolean {
    return type === 'paragraph';
  }
}
