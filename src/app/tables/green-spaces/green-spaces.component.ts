import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../core/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-green-spaces',
  templateUrl: './green-spaces.component.html',
  styleUrls: ['./green-spaces.component.css']
})
export class GreenSpacesComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'type', 'adresse'];
  dataSource = new MatTableDataSource<any>();
  uniqueTypes: string[] = [];
  filterType: string = "";
  mapUrl: SafeResourceUrl | null = null;
  selectedRow: any = null;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef , private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.dataService.getEspacesVerts().subscribe(
      (data) => {
        console.log("Fetched Data:", data);
        this.dataSource.data = data;

        this.uniqueTypes = [...new Set(data.map((item: any) => item.type))];

        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error loading green spaces data:', error);
      }
    );

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true;

      const [searchText, selectedType] = filter.split('|');

      const nom = data.nom ? data.nom.toLowerCase() : '';
      const adresse = data.adresse ? data.adresse.toLowerCase() : '';
      const type = data.type ? data.type.toLowerCase() : '';

      const matchesType = selectedType ? type === selectedType.toLowerCase() : true;
      const matchesText = nom.includes(searchText) || adresse.includes(searchText);

      return matchesType && matchesText;
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = `${filterValue}|${this.filterType}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyTypeFilter(selectedType: string): void {
    this.filterType = selectedType;
    this.dataSource.filter = `${this.dataSource.filter.split('|')[0]}|${this.filterType}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectRow(row: any) {
    if (this.selectedRow === row) {
      this.selectedRow = null;
      this.mapUrl = null;
    } else {
      this.selectedRow = row;

      if (row?.geo_point_2d?.lat !== undefined && row?.geo_point_2d?.lon !== undefined) {
        const url = `https://www.google.com/maps?q=${row.geo_point_2d.lat},${row.geo_point_2d.lon}&output=embed`;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else {
        this.mapUrl = null;
        console.warn('Invalid geo_point_2d:', row);
      }
    }
  }


}
