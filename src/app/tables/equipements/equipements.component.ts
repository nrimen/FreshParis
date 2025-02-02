import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../core/data.service';
import { DomSanitizer } from "@angular/platform-browser";
import { Equipement } from "../../core/models/equipement";

@Component({
  selector: 'app-equipements',
  templateUrl: './equipements.component.html',
  styleUrls: ['./equipements.component.css']
})
export class EquipementsComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'type', 'adresse', 'statut_ouverture', 'payant'];
  dataSource = new MatTableDataSource<Equipement>();
  uniqueCommunes: string[] = [];
  filterCommune: string = '';
  searchFilter: string = '';
  mapUrl: any = null;
  selectedEquipment: Equipement | null = null;

  isTableView: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
   filterStatutOuverture: string='';
  private filterPayant: string='';
  filterType: string = '';
  uniqueTypes: string[] = [];
  paginatedData: any[] = [];
  pageSize: number = 10;
  currentPage: number = 0;
  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadEquipements();

    this.dataSource.filterPredicate = this.createFilterPredicate();

  }

  loadEquipements(): void {
    this.dataService.getEquipements().subscribe(
      (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          console.log('data',data);
          this.dataSource.data = data;
          this.dataSource.filter = '';
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uniqueTypes = [...new Set(data.map(item => item.type))];
          this.updatePaginatedData();
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
    return (data: Equipement, filter: string): boolean => {
      const [searchText, selectedCommune, statutOuverture, payant, type] = filter.split('|');

      const name = data.nom ? data.nom.toLowerCase() : '';
      const address = data.adresse ? data.adresse.toLowerCase() : '';
      const statut = data.statut_ouverture ? data.statut_ouverture.toLowerCase() : '';
      const isPayant = data.payant ? data.payant.toLowerCase() : '';
      const equipementType = data.type ? data.type.toLowerCase() : '';

      const matchesCommune = selectedCommune ? address.includes(selectedCommune.toLowerCase()) : true;
      const matchesText = name.includes(searchText);

      const matchesStatut = statutOuverture ? statut.includes(statutOuverture) : true;
      const matchesPayant = payant ? isPayant === payant : true;

      const matchesType = type ? equipementType.includes(type) : true;

      return matchesCommune && matchesText && matchesStatut && matchesPayant && matchesType;
    };
  }

  updatePaginatedData(): void {
    if (!this.isTableView) {
      const startIndex = this.currentPage * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedData = this.dataSource.filteredData.slice(startIndex, endIndex);
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

  selectEquipment(equipement: Equipement) {
    console.log("Selected Equipment:", equipement);
    if (this.selectedEquipment === equipement) {
      this.selectedEquipment = null;
    } else {
      this.selectedEquipment = equipement;
      if (equipement.geo_point_2d?.lat && equipement.geo_point_2d?.lon) {
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


  applyStatutOuvertureFilter(selectedStatutOuverture: string): void {
    this.filterStatutOuverture = selectedStatutOuverture.toLowerCase();
    this.updateFilteredData();
  }


  applyPayantFilter(selectedPayant: string): void {
    this.filterPayant = selectedPayant.toLowerCase();
    this.updateFilteredData();
  }
  updateFilteredData(): void {
    const filterValue = `${this.searchFilter}|${this.filterCommune}|${this.filterStatutOuverture}|${this.filterPayant}|${this.filterType}`;
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateMapUrl(equipement: Equipement): void {
    const lat = equipement.geo_point_2d?.lat;
    const lon = equipement.geo_point_2d?.lon;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://maps.google.com/maps?q=${lat},${lon}&hl=fr&z=14&output=embed`);
  }
}
