import {Component, OnInit, ViewChild} from '@angular/core';
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime, Observable, switchMap, of } from "rxjs";
import { DataService } from "../../core/data.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchControl: FormControl;
  combinedData: any[] = [];
  filteredData: any[] = [];
  selectedItem: any = null;
  @ViewChild('infoModal') infoModal: any;

  constructor(private dataService: DataService, private router: Router,private modalService: NgbModal) {
    this.searchControl = new FormControl('');
  }
  onSelectItem(item: any) {
    this.selectedItem = item;
    this.modalService.open(this.infoModal, { centered: true });

  }
  ngOnInit(): void {
    this.loadData();
    this.searchControl.valueChanges.subscribe(searchTerm => {
      this.filterData(searchTerm);
    });
  }

  loadData() {
    this.dataService.getEquipements().subscribe(equipements => {
      this.dataService.getEspacesVerts().subscribe(greenSpaces => {
        this.dataService.getFontaines().subscribe(fountains => {
          this.combinedData = [
            ...equipements.map(item => ({ ...item, type: 'equipment' })),
            ...greenSpaces.map(item => ({ ...item, type: 'green_space' })),
            ...fountains.map(item => ({ ...item, type: 'fountain' }))
          ];
          this.filteredData = [...this.combinedData];
        });
      });
    });
  }

  searchData = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      switchMap((term) => this.filterData(term))
    );

  filterData(term: string): Observable<any[]> {
    if (!term) {
      return of(this.combinedData);
    } else {
      const filtered = this.combinedData.filter(item =>
        (item.name?.toLowerCase().includes(term.toLowerCase()) ||
          item.nom?.toLowerCase().includes(term.toLowerCase()) ||
          item.modele?.toLowerCase().includes(term.toLowerCase()) ||
          item.voie?.toLowerCase().includes(term.toLowerCase()))
      );
      return of(filtered);
    }
  }
  onEnter() {
    const term = this.searchControl.value;
    if (!term) return;

    const matchedItem = this.filteredData.find(
      (item) => item.name?.toLowerCase() === term.toLowerCase()
    );

    if (matchedItem) {
      this.selectedItem = matchedItem;
      this.modalService.open(this.infoModal, { centered: true });
    }
  }


  formatItem = (item: any) => item.name || item.nom || item.modele ;

  getImages(item: any): string[] {
    if (!item) return [];

    if (item?.identifiant) {
      return [
        'assets/images/equipements/img.png',
        'assets/images/equipements/img_1.png',
        'assets/images/equipements/img_2.png'
      ];
    } else if (item?.nsq_espace_vert) {
      return [
        'assets/images/greenSpaces/img.png',
        'assets/images/greenSpaces/img_1.png',
        'assets/images/greenSpaces/img_2.png'
      ];
    } else if (item?.gid) {
      return [
        'assets/images/fontains/img.png',
        'assets/images/fontains/img_1.png',
        'assets/images/fontains/img_2.png'
      ];
    } else {
      return ['assets/images/default.jpg'];
    }
  }

}
