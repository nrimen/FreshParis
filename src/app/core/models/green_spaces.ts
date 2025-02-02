export interface GreenSpace {
  identifiant: string;
  nsq_espace_vert: number;
  nom: string;
  type: string;
  p_vegetation_h: number;
  proportion_vegetation_haute: number;
  adresse: string;
  arrondissement: string;
  statut_ouverture?: string;
  ouvert_24h: string;
  canicule_ouverture: string;
  ouverture_estivale_nocturne: string;
  horaires_periode?: string;
  horaires_lundi?: string;
  horaires_mardi?: string;
  horaires_mercredi?: string;
  horaires_jeudi?: string;
  horaires_vendredi?: string;
  horaires_samedi?: string;
  horaires_dimanche?: string;
  categorie: string;
  proposition_usager?: string;
  id_dicom?: string;
  geo_point_2d?: { lat: number; lon: number };
  surf_veget_sup8m_2024: number;
  indice_veget_sup8m_2024: number;
}
