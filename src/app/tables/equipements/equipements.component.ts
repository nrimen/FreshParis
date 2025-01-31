import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../core/data.service';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-equipements',
  templateUrl: './equipements.component.html',
  styleUrls: ['./equipements.component.css']
})
export class EquipementsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'capacity', 'arrondissement', 'status'];
  dataSource = new MatTableDataSource<any>();
  uniqueCommunes: string[] = [];
  filterCommune: string = '';
  searchFilter: string = '';
  bikesAvailable: any = null;
  mapUrl: any = null;
  selectedEquipment: any = null;

  isTableView: boolean = true;
  paginatedData: any[] = [];
  pageSize: number = 10;
  currentPage: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dataService.getEquipements().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.uniqueCommunes = [...new Set(data.map((item: any) => item.nom_arrondissement_communes))];
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updatePaginatedData();
      },
      (error) => {
        console.error('Error loading equipements data:', error);
      }
    );

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const [searchText, selectedCommune] = filter.split('|');

      const name = data.name ? data.name.toLowerCase() : '';
      const arrondissement = data.nom_arrondissement_communes ? data.nom_arrondissement_communes.toLowerCase() : '';
      const matchesCommune = selectedCommune ? arrondissement === selectedCommune.toLowerCase() : true;
      const matchesText = name.includes(searchText);

      return matchesCommune && matchesText;
    };
  }

  applyFilter(event: Event): void {
    this.searchFilter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = `${this.searchFilter}|${this.filterCommune}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.updatePaginatedData();
  }

  applyCommuneFilter(selectedCommune: string): void {
    this.filterCommune = selectedCommune;
    this.dataSource.filter = `${this.searchFilter}|${this.filterCommune}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.updatePaginatedData();
  }

  selectEquipment(equipement: any) {
    if (this.selectedEquipment === equipement) {
      this.selectedEquipment = null;
      this.bikesAvailable = null;
    } else {
      this.selectedEquipment = equipement;
      this.bikesAvailable = {
        total: equipement.numbikesavailable || 0,
        mechanical: equipement.mechanical || 0,
        ebike: equipement.ebike || 0
      };
      if (equipement?.coordonnees_geo?.lat && equipement?.coordonnees_geo?.lon) {
        this.updateMapUrl(equipement);
      } else {
        this.mapUrl = null;
        console.warn('Invalid geo coordinates:', equipement);
      }
    }
  }

  toggleView(): void {
    this.isTableView = !this.isTableView;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    if (!this.isTableView) {
      const startIndex = this.currentPage * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedData = this.dataSource.filteredData.slice(startIndex, endIndex);
    }
  }

  changePage(event: any): void {
    this.currentPage = event.pageIndex;
    this.updatePaginatedData();
  }

  private updateMapUrl(equipement: any) {
    if (equipement?.coordonnees_geo?.lat && equipement?.coordonnees_geo?.lon) {
      const url = `https://www.google.com/maps?q=${equipement.coordonnees_geo.lat},${equipement.coordonnees_geo.lon}&output=embed`;
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}
