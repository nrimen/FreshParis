import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../core/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {Fountain} from "../../core/models/fountain";

@Component({
  selector: 'app-fontaines',
  templateUrl: './fontaines.component.html',
  styleUrls: ['./fontaines.component.css']
})
export class FontainesComponent implements OnInit {
  displayedColumns: string[] = ['modele','type_objet','voie', 'commune', 'dispo'];
  dataSource = new MatTableDataSource<Fountain>();
  uniqueCommunes: string[] = [];
  filterCommune: string = "";
  searchFilter: string = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.dataService.getFontaines().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.dataSource.data = data;
          this.uniqueCommunes = [...new Set(data.map((item: Fountain) => item.commune))];
        } else {
          console.warn("No fountain data received");
        }

        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error loading fontaines data:', error);
      }
    );

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true;

      const [searchText, selectedCommune] = filter.split('|');

      const type = data.type_objet ? data.type_objet.toLowerCase() : '';
      const modele = data.modele ? data.modele.toLowerCase() : '';
      const voie = data.voie ? data.voie.toLowerCase() : '';
      const commune = data.commune ? data.commune.toLowerCase() : '';

      const matchesCommune = selectedCommune ? commune === selectedCommune.toLowerCase() : true;
      const matchesText = type.includes(searchText) || modele.includes(searchText) || voie.includes(searchText);

      return matchesCommune && matchesText;
    };
  }

  applyFilter(event: Event): void {
    this.searchFilter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = `${this.searchFilter}|${this.filterCommune}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyCommuneFilter(selectedCommune: string): void {
    this.filterCommune = selectedCommune;
    this.dataSource.filter = `${this.searchFilter}|${this.filterCommune}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  selectedFountain: any = null;
  mapUrl: SafeResourceUrl | null = null;

  selectFountain(fountain: any) {
    if (this.selectedFountain === fountain){
      this.selectedFountain=null;
      this.mapUrl = null;
    } else {
      this.selectedFountain=fountain;

      if (fountain?.geo_point_2d?.lat !== undefined && fountain?.geo_point_2d?.lon !== undefined) {
        const url = `https://www.google.com/maps?q=${fountain.geo_point_2d.lat},${fountain.geo_point_2d.lon}&output=embed`;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else {
        this.mapUrl = null;
        console.warn('Invalid geo_point_2d:', fountain);
      }
    }
  }

}
