import type { Schema, Struct } from '@strapi/strapi';

export interface AppartementsLeBien extends Struct.ComponentSchema {
  collectionName: 'components_appartements_le_biens';
  info: {
    displayName: 'leBien';
    icon: 'house';
  };
  attributes: {
    adresse: Schema.Attribute.Text;
    cave: Schema.Attribute.Boolean;
    caveEmplacement: Schema.Attribute.String;
    caveNumeroLot: Schema.Attribute.String;
    chaudiereIndividuelle: Schema.Attribute.Boolean;
    energie: Schema.Attribute.Enumeration<['gaz', 'electricite', 'autre']>;
    etage: Schema.Attribute.Integer;
    listeMeubles: Schema.Attribute.Blocks;
    meuble: Schema.Attribute.Boolean;
    nombreM2: Schema.Attribute.Decimal;
    nombrePieces: Schema.Attribute.Integer;
    parking: Schema.Attribute.Boolean;
    parkingEmplacement: Schema.Attribute.String;
    parkingNumeroLot: Schema.Attribute.String;
    photos: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    plans: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    position: Schema.Attribute.String;
    proprietaire: Schema.Attribute.String;
  };
}

export interface AppartementsLocataires extends Struct.ComponentSchema {
  collectionName: 'components_appartements_locataires';
  info: {
    displayName: 'locataires';
    icon: 'user';
  };
  attributes: {
    assuranceLocataire: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    assurancePno: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    bail: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    dateEntree: Schema.Attribute.Date;
    email: Schema.Attribute.Email;
    etatDesLieuxEntree: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    etatDesLieuxSortie: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    indiceIrl: Schema.Attribute.Enumeration<['T1', 'T2', 'T3', 'T4']>;
    nom: Schema.Attribute.String;
    telephone: Schema.Attribute.String;
  };
}

export interface AppartementsLoyerCharges extends Struct.ComponentSchema {
  collectionName: 'components_appartements_loyer_charges';
  info: {
    displayName: 'loyerCharges';
    icon: 'shoppingCart';
  };
  attributes: {
    anneeIrl: Schema.Attribute.Integer;
    charges: Schema.Attribute.Decimal;
    indiceValeurIrl: Schema.Attribute.Decimal;
    loyerHc: Schema.Attribute.Decimal;
    loyerTtc: Schema.Attribute.Decimal;
    taxeOrduresMenageres: Schema.Attribute.Component<'appartements.tom', true>;
    trimestreIrl: Schema.Attribute.Enumeration<['T1', 'T2', 'T3', 'T4']>;
  };
}

export interface AppartementsTom extends Struct.ComponentSchema {
  collectionName: 'components_appartements_toms';
  info: {
    displayName: 'tom';
  };
  attributes: {
    anneeTom: Schema.Attribute.Integer;
    incluseDansLesCharges: Schema.Attribute.Boolean;
    montantTom: Schema.Attribute.Decimal;
  };
}

export interface AppartementsTrousseaux extends Struct.ComponentSchema {
  collectionName: 'components_appartements_trousseaux';
  info: {
    displayName: 'trousseaux';
    icon: 'key';
  };
  attributes: {
    contenuTrousseau: Schema.Attribute.Blocks;
    detenteurTrousseau: Schema.Attribute.Enumeration<['agence', 'locataire']>;
    identifiantTrousseau: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'appartements.le-bien': AppartementsLeBien;
      'appartements.locataires': AppartementsLocataires;
      'appartements.loyer-charges': AppartementsLoyerCharges;
      'appartements.tom': AppartementsTom;
      'appartements.trousseaux': AppartementsTrousseaux;
    }
  }
}
