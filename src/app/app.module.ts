import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {FlexLayoutModule} from "@angular/flex-layout";
import { GreenSpacesComponent } from './tables/green-spaces/green-spaces.component';
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSortModule} from "@angular/material/sort";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { EquipementsComponent } from './tables/equipements/equipements.component';
import { FontainesComponent } from './tables/fontaines/fontaines.component';
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component'; // Importing routing module
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GreenSpacesComponent,
    EquipementsComponent,
    FontainesComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    RouterModule.forRoot([]),
    NgbDropdownModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    CommonModule,
    MatSelectModule,
    MatCardModule,
    NgbTypeaheadModule,
    ReactiveFormsModule


  ],
  exports: [],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
