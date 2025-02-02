export interface Fountain {
  gid: string;
  type_objet: string;
  modele: string;
  no_voirie_pair: string | null;
  no_voirie_impair: string;
  voie: string;
  commune: string;
  dispo: string;
  debut_ind: string | null;
  fin_ind: string | null;
  motif_ind: string | null;
  geo_shape: {
    type: string;
    geometry: {
      coordinates: [number, number];
      type: string;
    };
    properties: object;
  };
  geo_point_2d: {
    lon: number;
    lat: number;
  };
}
