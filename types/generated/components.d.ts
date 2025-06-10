import type { Schema, Struct } from '@strapi/strapi';

export interface AppartementsAutresContacts extends Struct.ComponentSchema {
  collectionName: 'components_appartements_autres_contacts';
  info: {
    displayName: 'autres_contacts';
    icon: 'phone';
  };
  attributes: {
    coordonnees: Schema.Attribute.Blocks;
    nom: Schema.Attribute.String;
    notes: Schema.Attribute.Blocks;
    type_contact: Schema.Attribute.Enumeration<
      ['Agence immo', 'Plombier', 'Gestionnaire', 'Gardien', 'Autre']
    >;
  };
}

export interface AppartementsDecomptesAnnuels extends Struct.ComponentSchema {
  collectionName: 'components_appartements_decomptes_annuels';
  info: {
    displayName: 'decomptes_annuels';
  };
  attributes: {
    annee: Schema.Attribute.Integer;
    archive: Schema.Attribute.Boolean;
    fichier_decompte: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    montant_total: Schema.Attribute.Decimal;
    notes: Schema.Attribute.Blocks;
  };
}

export interface AppartementsEntretienChaudiere extends Struct.ComponentSchema {
  collectionName: 'components_loyer_charges_entretien_chaudieres';
  info: {
    displayName: 'entretien_chaudiere ';
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
    displayName: 'le_bien';
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
    displayName: 'loyer_et_charges';
    icon: 'shoppingCart';
  };
  attributes: {
    anneeIrl: Schema.Attribute.Integer;
    charges: Schema.Attribute.Decimal;
    decomptes_annuels_charges: Schema.Attribute.Component<
      'appartements.decomptes-annuels',
      true
    >;
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

export interface AppartementsRelocation extends Struct.ComponentSchema {
  collectionName: 'components_appartements_relocations';
  info: {
    displayName: 'relocation';
    icon: 'folder';
  };
  attributes: {
    agence_coordonnees: Schema.Attribute.Blocks;
    bail_fiinal: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    diagnostiques: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    dossier_candidature_locataire_retenu: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    etat_des_lieux_entree: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    etat_des_lieux_sortie: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    mandats_location: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    photos: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    travaux_fichiers: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    travaux_texte: Schema.Attribute.Blocks;
  };
}

export interface AppartementsSyndic extends Struct.ComponentSchema {
  collectionName: 'components_appartements_syndics';
  info: {
    displayName: 'syndic';
    icon: 'user';
  };
  attributes: {
    contacts_syndic: Schema.Attribute.Blocks;
    coordonnees_syndic: Schema.Attribute.Blocks;
    date_ag: Schema.Attribute.String;
    representants_syndicaux: Schema.Attribute.Blocks;
    url_intranet_syndic: Schema.Attribute.Blocks;
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

export interface DossierEnCoursLitiges extends Struct.ComponentSchema {
  collectionName: 'components_dossier_en_cours_litiges';
  info: {
    displayName: 'litiges';
  };
  attributes: {
    dateIncident: Schema.Attribute.Date & Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    documentsLitige: Schema.Attribute.Media<'images' | 'files', true>;
    notes: Schema.Attribute.Text;
    statut: Schema.Attribute.Enumeration<
      ['en-cours', 'resolu', 'en-attente', 'abandonne']
    > &
      Schema.Attribute.DefaultTo<'en-cours'>;
    type: Schema.Attribute.Enumeration<
      [
        'degat-des-eaux',
        'probleme-chauffage',
        'nuisances-sonores',
        'impaye-loyer',
        'deterioration',
        'autre',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface DossierEnCoursTravaux extends Struct.ComponentSchema {
  collectionName: 'components_dossier_en_cours_travaux';
  info: {
    displayName: 'travaux';
  };
  attributes: {
    archive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    budget: Schema.Attribute.Decimal;
    dateDebut: Schema.Attribute.Date;
    dateFin: Schema.Attribute.Date;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    documentsTravauxAmericainents: Schema.Attribute.Media<
      'images' | 'files',
      true
    >;
    entreprise: Schema.Attribute.String;
    notes: Schema.Attribute.Text;
    statut: Schema.Attribute.Enumeration<
      ['planifie', 'en-cours', 'termine', 'annule', 'archive']
    > &
      Schema.Attribute.DefaultTo<'planifie'>;
    titre: Schema.Attribute.String & Schema.Attribute.Required;
    typesTravaux: Schema.Attribute.Enumeration<
      [
        'renovation',
        'remise-en-etat',
        'changement-fenetres',
        'peinture',
        'plomberie',
        'electricite',
        'chauffage',
        'autre',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface EntretienChaudiereFicheEntreprise
  extends Struct.ComponentSchema {
  collectionName: 'components_entretien_chaudiere_fiche_entreprises';
  info: {
    displayName: 'fiche_entreprise';
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

export interface InterventionsHistoriqueInterventions
  extends Struct.ComponentSchema {
  collectionName: 'components_interventions_historique_interventions';
  info: {
    description: "Historique des interventions d'un contact sur les appartements";
    displayName: 'Historique Intervention';
  };
  attributes: {
    appartement: Schema.Attribute.Relation<
      'oneToOne',
      'api::appartement.appartement'
    >;
    cout: Schema.Attribute.Decimal;
    date_intervention: Schema.Attribute.Date & Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    documents_intervention: Schema.Attribute.Media<'images' | 'files', true>;
    notes: Schema.Attribute.Text;
    satisfaction: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    type_intervention: Schema.Attribute.Enumeration<
      [
        'R\u00E9paration',
        'Maintenance',
        'Installation',
        'Diagnostic',
        'Devis',
        'Autre',
      ]
    > &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'appartements.autres-contacts': AppartementsAutresContacts;
      'appartements.decomptes-annuels': AppartementsDecomptesAnnuels;
      'appartements.entretien-chaudiere': AppartementsEntretienChaudiere;
      'appartements.le-bien': AppartementsLeBien;
      'appartements.locataires': AppartementsLocataires;
      'appartements.loyer-charges': AppartementsLoyerCharges;
      'appartements.relocation': AppartementsRelocation;
      'appartements.syndic': AppartementsSyndic;
      'appartements.tom': AppartementsTom;
      'appartements.trousseaux': AppartementsTrousseaux;
      'dossier-en-cours.litiges': DossierEnCoursLitiges;
      'dossier-en-cours.travaux': DossierEnCoursTravaux;
      'entretien-chaudiere.fiche-entreprise': EntretienChaudiereFicheEntreprise;
      'interventions.historique_interventions': InterventionsHistoriqueInterventions;
    }
  }
}
