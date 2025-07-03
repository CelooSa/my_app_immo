import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/detailAppartement.scss";
import BlocNotesContent from "./BlocNotesCompact";

const API_URL = "http://localhost:1337/api/appartements";

const Accordion = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-modern">
      <button
        className="accordion-header-modern"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <span className="accordion-title">
          {icon && <span className="accordion-icon">{icon}</span>}
          {title}
        </span>
        <span className={`accordion-arrow ${isOpen ? "open" : ""}`}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      <div
        className={`accordion-content-modern ${isOpen ? "open" : ""}`}
        id={`accordion-content-${title.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <div className="accordion-inner">{children}</div>
      </div>
    </div>
  );
};

const DetailAppartement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appart, setAppart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filesToUpload, setFilesToUpload] = useState({});

  useEffect(() => {
    const fetchAppartement = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Réponse API loyer_et_charges:", res.data.data.attributes.loyer_et_charges);
        setAppart(res.data.data);
      } catch (err) {
        console.warn("Aucune donnée trouvée, affichage en mode vide:", err.message);
        setAppart(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAppartement();
  }, [id]);

  const handleFileUpload = (e, section, field, isMultiple) => {
    const files = isMultiple ? Array.from(e.target.files) : e.target.files[0];
    setFilesToUpload((prev) => ({
      ...prev,
      [`${section}.${field}`]: files,
    }));
  };

  const uploadFiles = async (section, field) => {
    const key = `${section}.${field}`;
    if (!filesToUpload[key]) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      if (Array.isArray(filesToUpload[key])) {
        filesToUpload[key].forEach((file) => {
          formData.append(`files`, file);
        });
      } else {
        formData.append(`files`, filesToUpload[key]);
      }

      const uploadRes = await axios.post("http://localhost:1337/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const fileIds = Array.isArray(uploadRes.data)
        ? uploadRes.data.map((file) => file.id)
        : [uploadRes.data.id];

      const updatedData = { ...appart.attributes };
      if (section === "loyer_et_charges" && field === "fichier_decompte") {
        updatedData[section].decomptes_annuels = updatedData[section].decomptes_annuels || [];
        if (updatedData[section].decomptes_annuels.length === 0) {
          updatedData[section].decomptes_annuels.push({});
        }
        updatedData[section].decomptes_annuels[0][field] = fileIds[0];
      } else {
        updatedData[section] = updatedData[section] || {};
        updatedData[section][field] = field === "bail" || field === "bail_fiinal" || field === "etat_des_lieux_sortie" || field === "etat_des_lieux_entree" || field === "photoTrousseau" ? fileIds[0] : fileIds;
      }

      await axios.put(
        `http://localhost:1337/api/appartements/${id}`,
        { data: updatedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await axios.get(`${API_URL}/${id}?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppart(res.data.data);
      setFilesToUpload((prev) => ({ ...prev, [key]: null }));
      alert("Fichier(s) ajouté(s) avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'upload :", err);
      alert("Erreur lors de l'ajout du fichier.");
    }
  };

  if (loading) return <div className="loading-spinner">🏠 Chargement...</div>;

  const leBien = appart?.attributes?.le_bien || {};
  const loyerEtCharges = appart?.attributes?.loyer_et_charges || {};

  return (
    <div className="detail-container">
      <div className="header-section">
        <button className="btn-retour" onClick={() => navigate(-1)}>
          ← Retour
        </button>
        <h1 className="main-title">🏠 Appartement #{id}</h1>
      </div>

      <div className="masonry-grid">
        {/* Fiche Le Bien */}
        <div className="card card-bien">
          <div className="card-header">
            <h2>🏡 Le Bien</h2>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Propriétaire</span>
                <span className="value">{leBien.proprietaire || "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Adresse</span>
                <span className="value">{leBien.adresse || "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Étage</span>
                <span className="value">{leBien.etage ?? "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Position</span>
                <span className="value">{leBien.position || "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Pièces</span>
                <span className="value">{leBien.nombrePieces ?? "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Surface</span>
                <span className="value">{leBien.nombreM2 ?? "À remplir"} m²</span>
              </div>
              <div className="info-item">
                <span className="label">Cave</span>
                <span className="value">{leBien.cave ? "✅ Oui" : "❌ Non"}</span>
              </div>
              <div className="info-item">
                <span className="label">N° Lot Cave</span>
                <span className="value">{leBien.caveNumeroLot || "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Emplacement Cave</span>
                <span className="value">{leBien.caveEmplacement || "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Parking</span>
                <span className="value">{leBien.parking ? "✅ Oui" : "❌ Non"}</span>
              </div>
              <div className="info-item">
                <span className="label">N° Lot Parking</span>
                <span className="value">{leBien.parkingNumeroLot || "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Emplacement Parking</span>
                <span className="value">{leBien.parkingEmplacement || "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Chaudière Individuelle</span>
                <span className="value">{leBien.chaudiereIndividuelle ? "✅ Oui" : "❌ Non"}</span>
              </div>
              <div className="info-item">
                <span className="label">Meublé</span>
                <span className="value">{leBien.meuble ? "✅ Oui" : "❌ Non"}</span>
              </div>
              <div className="info-item">
                <span className="label">Énergie</span>
                <span className="value">{leBien.energie || "À remplir"}</span>
              </div>
            </div>

            <Accordion title="Documents" icon="📄">
              <div className="documents-section">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Plans</span>
                    <span className="value">
                      {leBien.plans?.data?.length > 0 ? (
                        leBien.plans.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            📎 Plan {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "le_bien", "plans", true)}
                      />
                      <button onClick={() => uploadFiles("le_bien", "plans")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Photos</span>
                    <span className="value">
                      {leBien.photos?.data?.length > 0 ? (
                        leBien.photos.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            🖼️ Photo {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "le_bien", "photos", true)}
                      />
                      <button onClick={() => uploadFiles("le_bien", "photos")}>Ajouter</button>
                    </span>
                  </div>
                </div>
              </div>
            </Accordion>

            <div className="info-block">
              <h4>🪑 Liste des meubles</h4>
              <div className="rich-text">
                {leBien.listeMeubles?.length > 0 ? (
                  leBien.listeMeubles.map((block, i) => (
                    <div key={i}>{block.children?.[0]?.text || "Contenu"}</div>
                  ))
                ) : (
                  <p className="empty-state">Non renseigné</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fiche Locataire */}
        <div className="card card-locataire">
          <div className="card-header">
            <h2>👤 Locataire</h2>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Nom</span>
                <span className="value">{appart?.attributes?.locataires?.nom || "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Email</span>
                <span className="value">{appart?.attributes?.locataires?.email || "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Téléphone</span>
                <span className="value">{appart?.attributes?.locataires?.telephone || "À remplir"}</span>
              </div>
              <div className="info-item">
                <span className="label">Date d'entrée</span>
                <span className="value">{appart?.attributes?.locataires?.dateEntree || "À remplir"}</span>
              </div>
            </div>

            <Accordion title="Documents" icon="📄">
              <div className="documents-section">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Bail</span>
                    <span className="value">
                      {appart?.attributes?.locataires?.bail?.data ? (
                        <a
                          href={`http://localhost:1337${appart.attributes.locataires.bail.data.attributes.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="doc-link"
                        >
                          📄 Télécharger
                        </a>
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        onChange={(e) => handleFileUpload(e, "locataires", "bail", false)}
                      />
                      <button onClick={() => uploadFiles("locataires", "bail")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">État des lieux entrée</span>
                    <span className="value">
                      {appart?.attributes?.locataires?.etatDesLieuxEntree?.data?.length > 0 ? (
                        appart.attributes.locataires.etatDesLieuxEntree.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            📝 État des lieux entrée {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "locataires", "etatDesLieuxEntree", true)}
                      />
                      <button onClick={() => uploadFiles("locataires", "etatDesLieuxEntree")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">État des lieux sortie</span>
                    <span className="value">
                      {appart?.attributes?.locataires?.etatDesLieuxSortie?.data?.length > 0 ? (
                        appart.attributes.locataires.etatDesLieuxSortie.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            📝 État des lieux sortie {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "locataires", "etatDesLieuxSortie", true)}
                      />
                      <button onClick={() => uploadFiles("locataires", "etatDesLieuxSortie")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Assurance locataire</span>
                    <span className="value">
                      {appart?.attributes?.locataires?.assuranceLocataire?.data?.length > 0 ? (
                        appart.attributes.locataires.assuranceLocataire.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            🛡️ Assurance locataire {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "locataires", "assuranceLocataire", true)}
                      />
                      <button onClick={() => uploadFiles("locataires", "assuranceLocataire")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Assurance PNO</span>
                    <span className="value">
                      {appart?.attributes?.locataires?.assurancePno?.data?.length > 0 ? (
                        appart.attributes.locataires.assurancePno.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            🧾 Assurance PNO {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "locataires", "assurancePno", true)}
                      />
                      <button onClick={() => uploadFiles("locataires", "assurancePno")}>Ajouter</button>
                    </span>
                  </div>
                </div>
              </div>
            </Accordion>

            <div className="irl-info">
              <h4>📊 Indice IRL (contrat)</h4>
              <p>{appart?.attributes?.locataires?.indiceIrl || "À remplir"}</p>
            </div>
          </div>
        </div>

        {/* Fiche Loyer & Charges */}
        <div className="card card-loyer">
          <div className="card-header">
            <h2>💰 Loyer & Charges</h2>
          </div>
          <div className="card-content">
            <div className="loyer-summary">
              <div className="loyer-item main">
                <span className="amount">{loyerEtCharges.loyerTtc ?? "---"} €</span>
                <span className="label">Loyer TTC</span>
              </div>
              <div className="loyer-breakdown">
                <div className="breakdown-item">
                  <span className="amount">{loyerEtCharges.loyerHc ?? "---"} €</span>
                  <span className="label">Hors charges</span>
                </div>
                <div className="breakdown-item">
                  <span className="amount">{loyerEtCharges.charges ?? "---"} €</span>
                  <span className="label">Charges</span>
                </div>
              </div>
            </div>

            <div className="irl-info">
              <h4>📊 Indice IRL</h4>
              <div className="irl-details">
                <div className="irl-item">
                  <span className="label">Trimestre</span>
                  <span className="value">{loyerEtCharges.trimestreIrl || "---"}</span>
                </div>
                <div className="irl-item">
                  <span className="label">Année</span>
                  <span className="value">{loyerEtCharges.anneeIrl ?? "---"}</span>
                </div>
                <div className="irl-item">
                  <span className="label">Valeur</span>
                  <span className="value">{loyerEtCharges.indiceValeurIrl ?? "---"}</span>
                </div>
              </div>
            </div>

            <Accordion title="Taxe Ordures Ménagères (TOM)" icon="🗑️">
              <div className="taxe-ordures-menageres">
                {loyerEtCharges.toms && loyerEtCharges.toms.length > 0 ? (
                  <div className="items-list">
                    {loyerEtCharges.toms.map((tom, index) => (
                      <div key={index} className="mini-card">
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="label">Année</span>
                            <span className="value">{tom.anneeTom ?? "À remplir"}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Montant</span>
                            <span className="value">{tom.montantTom ?? "0"} €</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Incluse dans charges</span>
                            <span className="value">{tom.incluseDansLesCharges ? "✅ Oui" : "❌ Non"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="items-list">
                    <div className="mini-card">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Année</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Montant</span>
                          <span className="value">0 €</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Incluse dans charges</span>
                          <span className="value">❌ Non</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Accordion>

            <Accordion title="Entretien Chaudière" icon="🔥">
              <div className="entretien-chaudiere">
                {loyerEtCharges.entretien_chaudieres && loyerEtCharges.entretien_chaudieres.length > 0 ? (
                  <div className="items-list">
                    {loyerEtCharges.entretien_chaudieres.map((entretien, index) => (
                      <div key={index} className="mini-card">
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="label">Prix entretien</span>
                            <span className="value">{entretien.prixEntretienChaudiere ?? "0"} €</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Comprise dans charges</span>
                            <span className="value">{entretien.compriseDansLesCharges ? "✅ Oui" : "❌ Non"}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Fréquence entretien</span>
                            <span className="value">{entretien.frequenceEntretien || "À remplir"}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Prochain entretien prévu</span>
                            <span className="value">{entretien.prochainEntretienPrevu ?? "À remplir"}</span>
                          </div>
                        </div>
                        <Accordion title="Intervention" icon="🛠️">
                          <div className="info-grid">
                            <div className="info-item">
                              <span className="label">Nom Entreprise</span>
                              <span className="value">{entretien.intervention?.nomEntreprise || "À remplir"}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Adresse</span>
                              <span className="value">{entretien.intervention?.adresse || "À remplir"}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Téléphone</span>
                              <span className="value">{entretien.intervention?.telephone || "À remplir"}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Email</span>
                              <span className="value">{entretien.intervention?.email || "À remplir"}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Numéro Siret</span>
                              <span className="value">{entretien.intervention?.numeroSiret || "À remplir"}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Technicien</span>
                              <span className="value">{entretien.intervention?.technicien || "À remplir"}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Type d'intervention</span>
                              <span className="value">{entretien.intervention?.typeIntervention || "Non spécifié"}</span>
                            </div>
                            <div className="info-item">
                              <span className="label">Date d'intervention</span>
                              <span className="value">{entretien.intervention?.dateIntervention || "À remplir"}</span>
                            </div>
                          </div>
                        </Accordion>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="items-list">
                    <div className="mini-card">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Prix entretien</span>
                          <span className="value">0 €</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Comprise dans charges</span>
                          <span className="value">❌ Non</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Fréquence entretien</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Prochain entretien prévu</span>
                          <span className="value">À remplir</span>
                        </div>
                      </div>
                      <Accordion title="Intervention" icon="🛠️">
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="label">Nom Entreprise</span>
                            <span className="value">À remplir</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Adresse</span>
                            <span className="value">À remplir</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Téléphone</span>
                            <span className="value">À remplir</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Email</span>
                            <span className="value">À remplir</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Numéro Siret</span>
                            <span className="value">À remplir</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Technicien</span>
                            <span className="value">À remplir</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Type d'intervention</span>
                            <span className="value">Non spécifié</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Date d'intervention</span>
                            <span className="value">À remplir</span>
                          </div>
                        </div>
                      </Accordion>
                    </div>
                  </div>
                )}
              </div>
            </Accordion>

            <Accordion title="Décomptes Annuels Charges" icon="📁">
              <div className="documents-section">
                {loyerEtCharges.decomptes_annuels && loyerEtCharges.decomptes_annuels.length > 0 ? (
                  <div className="items-list">
                    {loyerEtCharges.decomptes_annuels.map((decompte, index) => (
                      <div key={index} className="mini-card">
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="label">Année</span>
                            <span className="value">{decompte.annee ?? "À remplir"}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Montant total</span>
                            <span className="value">{decompte.montant_total ?? "0"} €</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Archivé</span>
                            <span className="value">{decompte.archive ? "✅ Oui" : "❌ Non"}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Notes</span>
                            <div className="rich-text">
                              {decompte.notes?.length > 0 ? (
                                decompte.notes.map((block, i) => (
                                  <div key={i}>{block.children?.[0]?.text || "À remplir"}</div>
                                ))
                              ) : (
                                <span>À remplir</span>
                              )}
                            </div>
                          </div>
                          <div className="info-item">
                            <span className="label">Fichier</span>
                            <span className="value">
                              {decompte.fichier_decompte?.data ? (
                                <a
                                  href={`http://localhost:1337${decompte.fichier_decompte.data.attributes.url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="doc-link"
                                >
                                  📎 Télécharger
                                </a>
                              ) : (
                                <span className="no-doc">Aucun fichier</span>
                              )}
                              <input
                                type="file"
                                accept="image/*,application/pdf,video/*,audio/*"
                                onChange={(e) => handleFileUpload(e, "loyer_et_charges", "fichier_decompte", false)}
                              />
                              <button className="upload-btn" onClick={() => uploadFiles("loyer_et_charges", "fichier_decompte")}>Ajouter</button>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="items-list">
                    <div className="mini-card">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Année</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Montant total</span>
                          <span className="value">0 €</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Archivé</span>
                          <span className="value">❌ Non</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Notes</span>
                          <div className="rich-text">
                            <span>À remplir</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <span className="label">Fichier</span>
                          <span className="value">
                            <span className="no-doc">Aucun fichier</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf,video/*,audio/*"
                              onChange={(e) => handleFileUpload(e, "loyer_et_charges", "fichier_decompte", false)}
                            />
                            <button onClick={() => uploadFiles("loyer_et_charges", "fichier_decompte")}>Ajouter</button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Accordion>
          </div>
        </div>

        {/* Fiche Syndic */}
        <div className="card card-syndic">
          <div className="card-header">
            <h2>🏢 Syndic</h2>
          </div>
          <div className="card-content">
            <div className="syndic-info">
              <div className="info-block">
                <h4>📞 Coordonnées</h4>
                <div className="rich-text">
                  {appart?.attributes?.syndic?.coordonnees_syndic?.length > 0
                    ? appart.attributes.syndic.coordonnees_syndic.map(
                        (block, i) => (
                          <div key={i}>
                            {block.children?.[0]?.text || "Contenu"}
                          </div>
                        )
                      )
                    : "À remplir"}
                </div>
              </div>

              <div className="info-block">
                <h4>📅 Date AG</h4>
                <p>{appart?.attributes?.syndic?.date_ag || "À remplir"}</p>
              </div>

              <div className="info-block">
                <h4>👥 Représentants</h4>
                <div className="rich-text">
                  {appart?.attributes?.syndic?.representants_syndicaux?.length >
                  0
                    ? appart.attributes.syndic.representants_syndicaux.map(
                        (block, i) => (
                          <div key={i}>
                            {block.children?.[0]?.text || "Contenu"}
                          </div>
                        )
                      )
                    : "À remplir"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fiche Travaux/Litiges */}
        <div className="card card-dossier">
          <div className="card-header">
            <h2>🗂️ Dossier en cours</h2>
          </div>
          <div className="card-content">
            <div className="dossier-section">
              <h4>⚖️ Litiges</h4>
              {appart?.attributes?.dossier_en_cours?.litiges?.length > 0 ? (
                <div className="items-list">
                  {appart.attributes.dossier_en_cours.litiges.map(
                    (litige, index) => (
                      <div key={index} className="mini-card">
                        <div className="mini-card-header">
                          <span className="status">{litige.statut}</span>
                          <span className="date">{litige.dateIncident}</span>
                        </div>
                        <p>
                          <strong>{litige.type}</strong>
                        </p>
                        <p>{litige.description}</p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="empty-state">✨ Aucun litige</p>
              )}
            </div>

            <div className="dossier-section">
              <h4>🛠️ Travaux</h4>
              {appart?.attributes?.dossier_en_cours?.travaux?.length > 0 ? (
                <div className="items-list">
                  {appart.attributes.dossier_en_cours.travaux.map(
                    (travaux, index) => (
                      <div key={index} className="mini-card">
                        <div className="mini-card-header">
                          <span className="status">{travaux.statut}</span>
                          <span className="budget">
                            {travaux.budget ?? "---"} €
                          </span>
                        </div>
                        <p>
                          <strong>{travaux.titre}</strong>
                        </p>
                        <p>{travaux.description}</p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="empty-state">✨ Aucun travaux</p>
              )}
            </div>
          </div>
        </div>

        {/* Fiche Trousseau */}
        <div className="card card-trousseau">
          <div className="card-header">
            <h2>🗝️ Trousseau</h2>
          </div>
          <div className="card-content">
            {appart?.attributes?.trousseaux ? (
              <div className="trousseau-info">
                <div className="trousseau-id">
                  <span className="label">ID:</span>
                  <span className="value">
                    {appart.attributes.trousseaux.identifiantTrousseau || "Non renseigné"}
                  </span>
                </div>
                <div className="trousseau-holder">
                  <span className="label">Détenteur:</span>
                  <span className="value">
                    {appart.attributes.trousseaux.detenteurTrousseau || "Non renseigné"}
                  </span>
                </div>
                <Accordion title="Documents" icon="📄">
                  <div className="documents-section">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Photo du trousseau</span>
                        <span className="value">
                          {appart.attributes.trousseaux.photoTrousseau?.data ? (
                            <a
                              href={`http://localhost:1337${appart.attributes.trousseaux.photoTrousseau.data.attributes.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link"
                            >
                              🖼️ Télécharger
                            </a>
                          ) : (
                            <span className="no-doc">Aucun fichier</span>
                          )}
                          <input
                            type="file"
                            accept="image/*,application/pdf,video/*,audio/*"
                            onChange={(e) => handleFileUpload(e, "trousseaux", "photoTrousseau", false)}
                          />
                          <button onClick={() => uploadFiles("trousseaux", "photoTrousseau")}>Ajouter</button>
                        </span>
                      </div>
                    </div>
                  </div>
                </Accordion>
                <div className="trousseau-content">
                  <h4>📋 Contenu</h4>
                  <div className="rich-text">
                    {appart.attributes.trousseaux.contenuTrousseau?.length > 0 ? (
                      appart.attributes.trousseaux.contenuTrousseau.map((block, i) => (
                        <div key={i}>{block.children?.[0]?.text || "Contenu"}</div>
                      ))
                    ) : (
                      <p className="empty-state">Aucun contenu</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="trousseau-info">
                <div className="trousseau-id">
                  <span className="label">ID:</span>
                  <span className="value">Non renseigné</span>
                </div>
                <div className="trousseau-holder">
                  <span className="label">Détenteur:</span>
                  <span className="value">Non renseigné</span>
                </div>
                <Accordion title="Documents" icon="📄">
                  <div className="documents-section">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Photo du trousseau</span>
                        <span className="value">
                          <span className="no-doc">Aucun fichier</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf,video/*,audio/*"
                            onChange={(e) => handleFileUpload(e, "trousseaux", "photoTrousseau", false)}
                          />
                          <button onClick={() => uploadFiles("trousseaux", "photoTrousseau")}>Ajouter</button>
                        </span>
                      </div>
                    </div>
                  </div>
                </Accordion>
                <div className="trousseau-content">
                  <h4>📋 Contenu</h4>
                  <div className="rich-text">
                    <p className="empty-state">Aucun contenu</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fiche Contacts */}
        <div className="card card-contacts">
          <div className="card-header">
            <h2>📇 Contacts</h2>
          </div>
          <div className="card-content">
            {appart?.attributes?.autres_contacts?.length > 0 ? (
              <div className="contacts-list">
                {appart.attributes.autres_contacts.map((contact, i) => (
                  <div className="contact-item" key={i}>
                    <div className="contact-header">
                      <h4>{contact.nom || "Nom inconnu"}</h4>
                      <span className="contact-type">
                        {contact.type_contact || "Non spécifié"}
                      </span>
                    </div>
                    <div className="contact-details">
                      {contact.coordonnees?.length > 0 &&
                        contact.coordonnees.map((block, j) => (
                          <div key={j} className="contact-info">
                            {block.children?.[0]?.text || "Contenu"}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">📞 Aucun contact ajouté</p>
            )}
          </div>
        </div>

        {/* Fiche Interventions */}
        <div className="card card-interventions">
          <div className="card-header">
            <h2>🔧 Interventions</h2>
          </div>
          <div className="card-content">
            {appart?.attributes?.historique_interventions?.length > 0 ? (
              <div className="interventions-list">
                {appart.attributes.historique_interventions.map(
                  (intervention, index) => (
                    <div key={index} className="intervention-item">
                      <div className="intervention-header">
                        <span className="date">
                          {intervention.date_intervention || "---"}
                        </span>
                        <span className="cost">
                          {intervention.cout ? `${intervention.cout} €` : "---"}
                        </span>
                      </div>
                      <h4>
                        {intervention.type_intervention || "Intervention"}
                      </h4>
                      <p>{intervention.description || "Pas de description"}</p>
                      {intervention.satisfaction && (
                        <div className="satisfaction">
                          Satisfaction:{" "}
                          <span className="rating">
                            {intervention.satisfaction}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="empty-state">🔧 Aucune intervention</p>
            )}
          </div>
        </div>

        {/* Fiche Notes */}
        <div className="card card-notes">
          <div className="card-header">
            <h2>📝 Notes</h2>
          </div>
          <div className="card-content">
            <BlocNotesContent />
          </div>
        </div>

        {/* Fiche Relocation */}
        <div className="card card-relocation">
          <div className="card-header">
            <h2>📦 Relocation</h2>
          </div>
          <div className="card-content">
            <div className="info-block">
              <h4>📌 Coordonnées Agence</h4>
              <div className="rich-text">
                {appart?.attributes?.relocation?.agence_coordonnees?.length > 0 ? (
                  appart.attributes.relocation.agence_coordonnees.map(
                    (block, i) => (
                      <div key={i}>{block.children?.[0]?.text || "Contenu"}</div>
                    )
                  )
                ) : (
                  <p className="empty-state">Non renseigné</p>
                )}
              </div>
            </div>

            <Accordion title="Documents" icon="📄">
              <div className="documents-section">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Mandats de location</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.mandats_location?.data?.length > 0 ? (
                        appart.attributes.relocation.mandats_location.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            📁 Mandat {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "relocation", "mandats_location", true)}
                      />
                      <button onClick={() => uploadFiles("relocation", "mandats_location")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Diagnostiques</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.diagnostiques?.data?.length > 0 ? (
                        appart.attributes.relocation.diagnostiques.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            🧪 Diagnostic {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "relocation", "diagnostiques", true)}
                      />
                      <button onClick={() => uploadFiles("relocation", "diagnostiques")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Bail final</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.bail_fiinal?.data ? (
                        <a
                          href={`http://localhost:1337${appart.attributes.relocation.bail_fiinal.data.attributes.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="doc-link"
                        >
                          📄 Télécharger
                        </a>
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        onChange={(e) => handleFileUpload(e, "relocation", "bail_fiinal", false)}
                      />
                      <button onClick={() => uploadFiles("relocation", "bail_fiinal")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">État des lieux sortie</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.etat_des_lieux_sortie?.data ? (
                        <a
                          href={`http://localhost:1337${appart.attributes.relocation.etat_des_lieux_sortie.data.attributes.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="doc-link"
                        >
                          🚪 Télécharger
                        </a>
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        onChange={(e) => handleFileUpload(e, "relocation", "etat_des_lieux_sortie", false)}
                      />
                      <button onClick={() => uploadFiles("relocation", "etat_des_lieux_sortie")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">État des lieux entrée</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.etat_des_lieux_entree?.data ? (
                        <a
                          href={`http://localhost:1337${appart.attributes.relocation.etat_des_lieux_entree.data.attributes.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="doc-link"
                        >
                          🚪 Télécharger
                        </a>
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        onChange={(e) => handleFileUpload(e, "relocation", "etat_des_lieux_entree", false)}
                      />
                      <button onClick={() => uploadFiles("relocation", "etat_des_lieux_entree")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Dossier locataire retenu</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.dossier_candidature_locataire_retenu?.data?.length > 0 ? (
                        appart.attributes.relocation.dossier_candidature_locataire_retenu.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            🗂️ Dossier {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "relocation", "dossier_candidature_locataire_retenu", true)}
                      />
                      <button onClick={() => uploadFiles("relocation", "dossier_candidature_locataire_retenu")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Photos</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.photos?.data?.length > 0 ? (
                        appart.attributes.relocation.photos.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            🖼️ Photo {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "relocation", "photos", true)}
                      />
                      <button onClick={() => uploadFiles("relocation", "photos")}>Ajouter</button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Fichiers travaux</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.travaux_fichiers?.data?.length > 0 ? (
                        appart.attributes.relocation.travaux_fichiers.data.map((file, i) => (
                          <a
                            key={i}
                            href={`http://localhost:1337${file.attributes.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-link"
                          >
                            📎 Fichier travaux {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, "relocation", "travaux_fichiers", true)}
                      />
                      <button onClick={() => uploadFiles("relocation", "travaux_fichiers")}>Ajouter</button>
                    </span>
                  </div>
                </div>
              </div>
            </Accordion>

            <div className="info-block">
              <h4>🛠️ Travaux (texte)</h4>
              <div className="rich-text">
                {appart?.attributes?.relocation?.travaux_texte?.length > 0 ? (
                  appart.attributes.relocation.travaux_texte.map((block, i) => (
                    <div key={i}>{block.children?.[0]?.text || "Contenu"}</div>
                  ))
                ) : (
                  <p className="empty-state">Non renseigné</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAppartement;