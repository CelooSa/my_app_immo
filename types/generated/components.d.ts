import type { Schema, Struct } from '@strapi/strapi';

export interface AppartementsDossierEnCours extends Struct.ComponentSchema {
  collectionName: 'components_appartements_dossier_en_cours';
  info: {
    displayName: 'dossier en cours';
    icon: 'folder';
  };
  attributes: {
    descriptionLitige: Schema.Attribute.Blocks;
    fichiersLitige: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    typeLitige: Schema.Attribute.String;
  };
}

export interface AppartementsEntretienChaudiere extends Struct.ComponentSchema {
  collectionName: 'components_loyer_charges_entretien_chaudieres';
  info: {
    displayName: 'entretien chaudiere ';
  };
  attributes: {
    compriseDansLesCharges: Schema.Attribute.Boolean;
    frequenceEntretien: Schema.Attribute.Enumeration<
      ['annuel', 'semestriel', 'trimestriel']
    >;
    intervention: Schema.Attribute.Component<
      'entretien-chaudiere.fiche-entreprise',
      false
    >;
    prixEntretienChaudiere: Schema.Attribute.Decimal;
    prochainEntretienPrevu: Schema.Attribute.Date;
  };
}

export interface AppartementsLeBien extends Struct.ComponentSchema {
  collectionName: 'components_appartements_le_biens';
  info: {
    displayName: 'le Bien';
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
    displayName: 'loyer et charges';
    icon: 'shoppingCart';
  };
  attributes: {
    anneeIrl: Schema.Attribute.Integer;
    charges: Schema.Attribute.Decimal;
    entretienChaudiere: Schema.Attribute.Component<
      'appartements.entretien-chaudiere',
      true
    >;
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
    photoTrousseau: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface EntretienChaudiereFicheEntreprise
  extends Struct.ComponentSchema {
  collectionName: 'components_entretien_chaudiere_fiche_entreprises';
  info: {
    displayName: 'fiche Entreprise';
  };
  attributes: {
    adresse: Schema.Attribute.Text;
    dateIntervention: Schema.Attribute.Date;
    email: Schema.Attribute.Email;
    nomEntreprise: Schema.Attribute.String & Schema.Attribute.Required;
    numeroSiret: Schema.Attribute.String;
    technicien: Schema.Attribute.String;
    telephone: Schema.Attribute.String;
    typeIntervention: Schema.Attribute.Enumeration<
      ['entretien', 'reparation', 'installation', 'diagnostic']
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'appartements.dossier-en-cours': AppartementsDossierEnCours;
      'appartements.entretien-chaudiere': AppartementsEntretienChaudiere;
      'appartements.le-bien': AppartementsLeBien;
      'appartements.locataires': AppartementsLocataires;
      'appartements.loyer-charges': AppartementsLoyerCharges;
      'appartements.tom': AppartementsTom;
      'appartements.trousseaux': AppartementsTrousseaux;
      'entretien-chaudiere.fiche-entreprise': EntretienChaudiereFicheEntreprise;
    }
  }
}
