import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../core/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GreenSpace } from '../../core/models/green_spaces';

@Component({
  selector: 'app-green-spaces',
  templateUrl: './green-spaces.component.html',
  styleUrls: ['./green-spaces.component.css']
})
export class GreenSpacesComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'type', 'adresse'];
  dataSource = new MatTableDataSource<GreenSpace>();
  uniqueTypes: string[] = [];
  filterType: string = '';
  searchFilter: string = '';
  mapUrl: any = null;
  selectedGreenSpace: GreenSpace | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadGreenSpaces();
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }

  loadGreenSpaces(): void {
    this.dataService.getEspacesVerts().subscribe(
      (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.dataSource.data = data;
          this.dataSource.filter = '';
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uniqueTypes = [...new Set(data.map(item => item.type))];
          this.cdr.detectChanges();
        } else {
          console.error('Fetched data is empty or not an array:', data);
        }
      },
      (error) => {
        console.error('Error loading data:', error);
      }
    );
  }

  createFilterPredicate() {
    return (data: GreenSpace, filter: string): boolean => {
      const [searchText, selectedType] = filter.split('|');

      const name = data.nom ? data.nom.toLowerCase() : '';
      const address = data.adresse ? data.adresse.toLowerCase() : '';
      const type = data.type ? data.type.toLowerCase() : '';

      const matchesText = name.includes(searchText);
      const matchesType = selectedType ? type === selectedType.toLowerCase() : true;

      return matchesText && matchesType;
    };
  }

  updateFilteredData(): void {
    const filterValue = `${this.searchFilter}|${this.filterType}`;
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event): void {
    this.searchFilter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.updateFilteredData();
  }

  applyTypeFilter(selectedType: string): void {
    this.filterType = selectedType ? selectedType.toLowerCase() : '';
    this.updateFilteredData();
  }

  selectGreenSpace(greenSpace: GreenSpace): void {
    if (this.selectedGreenSpace === greenSpace) {
      this.selectedGreenSpace = null;
    } else {
      this.selectedGreenSpace = greenSpace;
      if (greenSpace.geo_point_2d?.lat && greenSpace.geo_point_2d?.lon) {
        this.updateMapUrl(greenSpace);
      } else {
        this.mapUrl = null;
        console.warn('Invalid geo coordinates:', greenSpace);
      }
    }
  }

  updateMapUrl(greenSpace: GreenSpace): void {
    const lat = greenSpace.geo_point_2d?.lat;
    const lon = greenSpace.geo_point_2d?.lon;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://maps.google.com/maps?q=${lat},${lon}&hl=fr&z=14&output=embed`);
  }
}
