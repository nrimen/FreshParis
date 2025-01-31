import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GreenSpacesComponent} from "./tables/green-spaces/green-spaces.component";
import {EquipementsComponent} from "./tables/equipements/equipements.component";
import {FontainesComponent} from "./tables/fontaines/fontaines.component";
import {HomeComponent} from "./components/home/home.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'green-spaces', component: GreenSpacesComponent },
  { path: 'equipements', component: EquipementsComponent },
  { path: 'fontaines', component: FontainesComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
