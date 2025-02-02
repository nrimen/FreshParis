export interface Equipement {
  identifiant: string;
  nom: string;
  type: string;
  payant: string;
  adresse: string;
  code_postal: string;
  statut_ouverture: string;
  horaires_periode: string;
  horaires_lundi?: string;
  horaires_mardi?: string;
  horaires_mercredi?: string;
  horaires_jeudi?: string;
  horaires_vendredi?: string;
  horaires_samedi?: string;
  horaires_dimanche?: string;
  geo_point_2d?: { lat: number; lon: number };
}
