import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/detailAppartement.scss";
import BlocNotesContent from "./BlocNotesCompact";
import { FaPlus, FaTrash, FaArchive, FaSave } from "react-icons/fa"; // Added import for icons

const API_URL = "http://localhost:1337/api/appartements";

const Accordion = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-modern">
      <button
        className="accordion-header-modern"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title
          .replace(/\s+/g, "-")
          .toLowerCase()}`}
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

  // Gestionnaire pour les champs simples et booléens
  const handleChange = (
    section,
    field,
    value,
    isArray = false,
    index = null
  ) => {
    setAppart((prev) => {
      const updatedData = { ...prev };
      if (isArray && index !== null) {
        updatedData.attributes[section][field] = [
          ...(updatedData.attributes[section][field] || []),
        ];
        updatedData.attributes[section][field][index] = value;
      } else {
        updatedData.attributes[section] = {
          ...(updatedData.attributes[section] || {}),
          [field]: value,
        };
      }
      return updatedData;
    });
  };

  // Gestionnaire pour les champs texte riche (comme listeMeubles)
  const handleRichTextChange = (section, field, value) => {
    setAppart((prev) => {
      const updatedData = { ...prev };
      updatedData.attributes[section] = {
        ...(updatedData.attributes[section] || {}),
        [field]: [{ children: [{ text: value }] }],
      };
      return updatedData;
    });
  };

  // Sauvegarde via API Strapi et Détection des modif non sauve au cas où
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        JSON.stringify(appart) !==
        JSON.stringify(localStorage.getItem(`appartement_${id}`))
      ) {
        e.preventDefault();
        e.returnValue =
          "Vous avez des modifications non sauvegardées. Voulez-vous quitter ?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [appart, id]);
  const handleSave = async () => {
    if (!appart) return;

    try {
      const token = localStorage.getItem("token");
      const updatedData = { ...appart.attributes };

      await axios.put(
        `http://localhost:1337/api/appartements/${id}`,
        { data: updatedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Rafraîchir les données après sauvegarde
      const res = await axios.get(
        `http://localhost:1337/api/appartements/${id}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppart(res.data.data);
      alert("Modifications sauvegardées avec succès !");
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
      alert("Erreur lors de la sauvegarde.");
    }
  };
  // pour mes boutons d'action => de la partie locataire
  // Ajouter un locataire via API Strapi
  const handleAddTenant = async () => {
    try {
      const token = localStorage.getItem("token");
      const newTenant = {
        data: {
          nom: "Nouveau Locataire",
          email: "",
          telephone: "",
          dateEntree: "",
          appartement: id, // Lie le locataire à l'appartement actuel
        },
      };

      await axios.post(`http://localhost:1337/api/locataires`, newTenant, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Rafraîchir les données de l'appartement
      const res = await axios.get(
        `http://localhost:1337/api/appartements/${id}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppart(res.data.data);
      alert("Locataire ajouté avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'ajout du locataire :", err);
      alert("Erreur lors de l'ajout du locataire.");
    }
  };

  const handleDeleteTenant = () => {
    console.log("Supprimer la fiche locataire");
  };

  const handleArchiveTenant = () => {
    console.log("Archiver la fiche locataire");
  };

  // et ici pour la partie de mes contacts

  const handleAddContact = () => {
    console.log("Ajouter un contact");
  };

  const handleArchiveContact = () => {
    console.log("Archiver le contact");
  };

  const handleDeleteContact = () => {
    console.log("Supprimer le contact");
  };

  useEffect(() => {
    const fetchAppartement = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(
          "Réponse API loyer_et_charges:",
          res.data.data.attributes.loyer_et_charges
        );
        setAppart(res.data.data);
      } catch (err) {
        console.warn(
          "Aucune donnée trouvée, affichage en mode vide:",
          err.message
        );
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

      const uploadRes = await axios.post(
        "http://localhost:1337/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileIds = Array.isArray(uploadRes.data)
        ? uploadRes.data.map((file) => file.id)
        : [uploadRes.data.id];

      const updatedData = { ...appart.attributes };

      if (section.startsWith("dossier_en_cours.litiges")) {
        const index = parseInt(field.split("_")[1], 10);
        updatedData.dossier_en_cours = updatedData.dossier_en_cours || {};
        updatedData.dossier_en_cours.litiges =
          updatedData.dossier_en_cours.litiges || [];
        updatedData.dossier_en_cours.litiges[index] =
          updatedData.dossier_en_cours.litiges[index] || {};
        updatedData.dossier_en_cours.litiges[index].documentsLitige = fileIds;
      } else if (section.startsWith("dossier_en_cours.travaux")) {
        const index = parseInt(field.split("_")[1], 10);
        updatedData.dossier_en_cours = updatedData.dossier_en_cours || {};
        updatedData.dossier_en_cours.travaux =
          updatedData.dossier_en_cours.travaux || [];
        updatedData.dossier_en_cours.travaux[index] =
          updatedData.dossier_en_cours.travaux[index] || {};
        updatedData.dossier_en_cours.travaux[index].documentsTravaux = fileIds;
      } else if (
        section === "loyer_et_charges" &&
        field === "fichier_decompte"
      ) {
        updatedData[section] = updatedData[section] || {};
        updatedData[section].decomptes_annuels =
          updatedData[section].decomptes_annuels || [];
        if (updatedData[section].decomptes_annuels.length === 0) {
          updatedData[section].decomptes_annuels.push({});
        }
        updatedData[section].decomptes_annuels[0][field] = fileIds[0];
      } else {
        updatedData[section] = updatedData[section] || {};
        updatedData[section][field] =
          field === "bail" ||
          field === "bail_fiinal" ||
          field === "etat_des_lieux_sortie" ||
          field === "etat_des_lieux_entree" ||
          field === "photoTrousseau"
            ? fileIds[0]
            : fileIds;
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

      const res = await axios.get(
        `http://localhost:1337/api/appartements/${id}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        <button className="save-btn" onClick={handleSave}>
          <FaSave className="icon" /> Sauvegarder
        </button>
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
                <label className="label" htmlFor="proprietaire">
                  Propriétaire
                </label>
                <input
                  type="text"
                  id="proprietaire"
                  className="input-field"
                  value={leBien.proprietaire || ""}
                  onChange={(e) =>
                    handleChange("le_bien", "proprietaire", e.target.value)
                  }
                  placeholder="À remplir"
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="adresse">
                  Adresse
                </label>
                <input
                  type="text"
                  id="adresse"
                  className="input-field"
                  value={leBien.adresse || ""}
                  onChange={(e) =>
                    handleChange("le_bien", "adresse", e.target.value)
                  }
                  placeholder="À remplir"
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="etage">
                  Étage
                </label>
                <input
                  type="number"
                  id="etage"
                  className="input-field"
                  value={leBien.etage ?? ""}
                  onChange={(e) =>
                    handleChange("le_bien", "etage", Number(e.target.value))
                  }
                  placeholder="À remplir"
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="position">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  className="input-field"
                  value={leBien.position || ""}
                  onChange={(e) =>
                    handleChange("le_bien", "position", e.target.value)
                  }
                  placeholder="À remplir"
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="nombrePieces">
                  Pièces
                </label>
                <input
                  type="number"
                  id="nombrePieces"
                  className="input-field"
                  value={leBien.nombrePieces ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "le_bien",
                      "nombrePieces",
                      Number(e.target.value)
                    )
                  }
                  placeholder="À remplir"
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="nombreM2">
                  Surface
                </label>
                <input
                  type="number"
                  id="nombreM2"
                  className="input-field"
                  value={leBien.nombreM2 ?? ""}
                  onChange={(e) =>
                    handleChange("le_bien", "nombreM2", Number(e.target.value))
                  }
                  placeholder="À remplir"
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="cave">
                  Cave
                </label>
                <input
                  type="checkbox"
                  id="cave"
                  className="checkbox-field"
                  checked={leBien.cave || false}
                  onChange={(e) =>
                    handleChange("le_bien", "cave", e.target.checked)
                  }
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="caveNumeroLot">
                  N° Lot Cave
                </label>
                <input
                  type="text"
                  id="caveNumeroLot"
                  className="input-field"
                  value={leBien.caveNumeroLot || ""}
                  onChange={(e) =>
                    handleChange("le_bien", "caveNumeroLot", e.target.value)
                  }
                  placeholder="À remplir"
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="caveEmplacement">
                  Emplacement Cave
                </label>
                <input
                  type="text"
                  id="caveEmplacement"
                  className="input-field"
                  value={leBien.caveEmplacement || ""}
                  onChange={(e) =>
                    handleChange("le_bien", "caveEmplacement", e.target.value)
                  }
                  placeholder="À remplir"
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="parking">
                  Parking
                </label>
                <input
                  type="checkbox"
                  id="parking"
                  className="checkbox-field"
                  checked={leBien.parking || false}
                  onChange={(e) =>
                    handleChange("le_bien", "parking", e.target.checked)
                  }
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="parkingNumeroLot">
                  N° Lot Parking
                </label>
                <input
                  type="text"
                  id="parkingNumeroLot"
                  className="input-field"
                  value={leBien.parkingNumeroLot || ""}
                  onChange={(e) =>
                    handleChange("le_bien", "parkingNumeroLot", e.target.value)
                  }
                  placeholder="À remplir"
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="parkingEmplacement">
                  Emplacement Parking
                </label>
                <input
                  type="text"
                  id="parkingEmplacement"
                  className="input-field"
                  value={leBien.parkingEmplacement || ""}
                  onChange={(e) =>
                    handleChange(
                      "le_bien",
                      "parkingEmplacement",
                      e.target.value
                    )
                  }
                  placeholder="À remplir"
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="chaudiereIndividuelle">
                  Chaudière Individuelle
                </label>
                <input
                  type="checkbox"
                  id="chaudiereIndividuelle"
                  className="checkbox-field"
                  checked={leBien.chaudiereIndividuelle || false}
                  onChange={(e) =>
                    handleChange(
                      "le_bien",
                      "chaudiereIndividuelle",
                      e.target.checked
                    )
                  }
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="meuble">
                  Meublé
                </label>
                <input
                  type="checkbox"
                  id="meuble"
                  className="checkbox-field"
                  checked={leBien.meuble || false}
                  onChange={(e) =>
                    handleChange("le_bien", "meuble", e.target.checked)
                  }
                />
              </div>
              <div className="info-item">
                <label className="label" htmlFor="energie">
                  Énergie
                </label>
                <input
                  type="text"
                  id="energie"
                  className="input-field"
                  value={leBien.energie || ""}
                  onChange={(e) =>
                    handleChange("le_bien", "energie", e.target.value)
                  }
                  placeholder="À remplir"
                />
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
                        onChange={(e) =>
                          handleFileUpload(e, "le_bien", "plans", true)
                        }
                      />
                      <button onClick={() => uploadFiles("le_bien", "plans")}>
                        Ajouter
                      </button>
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
                        onChange={(e) =>
                          handleFileUpload(e, "le_bien", "photos", true)
                        }
                      />
                      <button onClick={() => uploadFiles("le_bien", "photos")}>
                        Ajouter
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </Accordion>

            <div className="info-block">
              <h4>🪑 Liste des meubles</h4>
              <div className="rich-text">
                <textarea
                  className="textarea-field"
                  value={
                    leBien.listeMeubles?.length > 0
                      ? leBien.listeMeubles[0]?.children?.[0]?.text || ""
                      : ""
                  }
                  onChange={(e) =>
                    handleRichTextChange(
                      "le_bien",
                      "listeMeubles",
                      e.target.value
                    )
                  }
                  placeholder="Non renseigné"
                  rows="4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fiche Locataire */}
        <div className="card card-locataire">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2>👤 Locataire</h2>
            <div className="locataire-actions">
              <button
                className="btn-locataire-action btn-add"
                onClick={handleAddTenant}
                title="Ajouter une fiche locataire"
                aria-label="Ajouter une fiche locataire"
              >
                <FaPlus />
                <span>Ajouter</span>
              </button>
              <button
                className="btn-locataire-action btn-archive"
                onClick={handleArchiveTenant}
                title="Archiver la fiche locataire"
                aria-label="Archiver la fiche locataire"
              >
                <FaArchive />
                <span>Archiver</span>
              </button>
              <button
                className="btn-locataire-action btn-delete"
                onClick={handleDeleteTenant}
                title="Supprimer la fiche locataire"
                aria-label="Supprimer la fiche locataire"
              >
                <FaTrash />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Nom</span>
                <span className="value">
                  {appart?.attributes?.locataires?.nom || "À remplir"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Email</span>
                <span className="value">
                  {appart?.attributes?.locataires?.email || "À remplir"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Téléphone</span>
                <span className="value">
                  {appart?.attributes?.locataires?.telephone || "À remplir"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Date d'entrée</span>
                <span className="value">
                  {appart?.attributes?.locataires?.dateEntree || "À remplir"}
                </span>
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
                        onChange={(e) =>
                          handleFileUpload(e, "locataires", "bail", false)
                        }
                      />
                      <button onClick={() => uploadFiles("locataires", "bail")}>
                        Ajouter
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">État des lieux entrée</span>
                    <span className="value">
                      {appart?.attributes?.locataires?.etatDesLieuxEntree?.data
                        ?.length > 0 ? (
                        appart.attributes.locataires.etatDesLieuxEntree.data.map(
                          (file, i) => (
                            <a
                              key={i}
                              href={`http://localhost:1337${file.attributes.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link"
                            >
                              📝 État des lieux entrée {i + 1}
                            </a>
                          )
                        )
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "locataires",
                            "etatDesLieuxEntree",
                            true
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          uploadFiles("locataires", "etatDesLieuxEntree")
                        }
                      >
                        Ajouter
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">État des lieux sortie</span>
                    <span className="value">
                      {appart?.attributes?.locataires?.etatDesLieuxSortie?.data
                        ?.length > 0 ? (
                        appart.attributes.locataires.etatDesLieuxSortie.data.map(
                          (file, i) => (
                            <a
                              key={i}
                              href={`http://localhost:1337${file.attributes.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link"
                            >
                              📝 État des lieux sortie {i + 1}
                            </a>
                          )
                        )
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "locataires",
                            "etatDesLieuxSortie",
                            true
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          uploadFiles("locataires", "etatDesLieuxSortie")
                        }
                      >
                        Ajouter
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Assurance locataire</span>
                    <span className="value">
                      {appart?.attributes?.locataires?.assuranceLocataire?.data
                        ?.length > 0 ? (
                        appart.attributes.locataires.assuranceLocataire.data.map(
                          (file, i) => (
                            <a
                              key={i}
                              href={`http://localhost:1337${file.attributes.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link"
                            >
                              🛡️ Assurance locataire {i + 1}
                            </a>
                          )
                        )
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "locataires",
                            "assuranceLocataire",
                            true
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          uploadFiles("locataires", "assuranceLocataire")
                        }
                      >
                        Ajouter
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Assurance PNO</span>
                    <span className="value">
                      {appart?.attributes?.locataires?.assurancePno?.data
                        ?.length > 0 ? (
                        appart.attributes.locataires.assurancePno.data.map(
                          (file, i) => (
                            <a
                              key={i}
                              href={`http://localhost:1337${file.attributes.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link"
                            >
                              🧾 Assurance PNO {i + 1}
                            </a>
                          )
                        )
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "locataires",
                            "assurancePno",
                            true
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          uploadFiles("locataires", "assurancePno")
                        }
                      >
                        Ajouter
                      </button>
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
                <span className="amount">
                  {loyerEtCharges.loyerTtc ?? "---"} €
                </span>
                <span className="label">Loyer TTC</span>
              </div>
              <div className="loyer-breakdown">
                <div className="breakdown-item">
                  <span className="amount">
                    {loyerEtCharges.loyerHc ?? "---"} €
                  </span>
                  <span className="label">Hors charges</span>
                </div>
                <div className="breakdown-item">
                  <span className="amount">
                    {loyerEtCharges.charges ?? "---"} €
                  </span>
                  <span className="label">Charges</span>
                </div>
              </div>
            </div>

            <div className="irl-info">
              <h4>📊 Indice IRL</h4>
              <div className="irl-details">
                <div className="irl-item">
                  <span className="label">Trimestre</span>
                  <span className="value">
                    {loyerEtCharges.trimestreIrl || "---"}
                  </span>
                </div>
                <div className="irl-item">
                  <span className="label">Année</span>
                  <span className="value">
                    {loyerEtCharges.anneeIrl ?? "---"}
                  </span>
                </div>
                <div className="irl-item">
                  <span className="label">Valeur</span>
                  <span className="value">
                    {loyerEtCharges.indiceValeurIrl ?? "---"}
                  </span>
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
                            <span className="value">
                              {tom.anneeTom ?? "À remplir"}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Montant</span>
                            <span className="value">
                              {tom.montantTom ?? "0"} €
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Incluse dans charges</span>
                            <span className="value">
                              {tom.incluseDansLesCharges ? "✅ Oui" : "❌ Non"}
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
                {loyerEtCharges.entretien_chaudieres &&
                loyerEtCharges.entretien_chaudieres.length > 0 ? (
                  <div className="items-list">
                    {loyerEtCharges.entretien_chaudieres.map(
                      (entretien, index) => (
                        <div key={index} className="mini-card">
                          <div className="info-grid">
                            <div className="info-item">
                              <span className="label">Prix entretien</span>
                              <span className="value">
                                {entretien.prixEntretienChaudiere ?? "0"} €
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">
                                Comprise dans charges
                              </span>
                              <span className="value">
                                {entretien.compriseDansLesCharges
                                  ? "✅ Oui"
                                  : "❌ Non"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Fréquence entretien</span>
                              <span className="value">
                                {entretien.frequenceEntretien || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">
                                Prochain entretien prévu
                              </span>
                              <span className="value">
                                {entretien.prochainEntretienPrevu ??
                                  "À remplir"}
                              </span>
                            </div>
                          </div>
                          <Accordion title="Intervention" icon="🛠️">
                            <div className="info-grid">
                              <div className="info-item">
                                <span className="label">Nom Entreprise</span>
                                <span className="value">
                                  {entretien.intervention?.nomEntreprise ||
                                    "À remplir"}
                                </span>
                              </div>
                              <div className="info-item">
                                <span className="label">Adresse</span>
                                <span className="value">
                                  {entretien.intervention?.adresse ||
                                    "À remplir"}
                                </span>
                              </div>
                              <div className="info-item">
                                <span className="label">Téléphone</span>
                                <span className="value">
                                  {entretien.intervention?.telephone ||
                                    "À remplir"}
                                </span>
                              </div>
                              <div className="info-item">
                                <span className="label">Email</span>
                                <span className="value">
                                  {entretien.intervention?.email || "À remplir"}
                                </span>
                              </div>
                              <div className="info-item">
                                <span className="label">Numéro Siret</span>
                                <span className="value">
                                  {entretien.intervention?.numeroSiret ||
                                    "À remplir"}
                                </span>
                              </div>
                              <div className="info-item">
                                <span className="label">Technicien</span>
                                <span className="value">
                                  {entretien.intervention?.technicien ||
                                    "À remplir"}
                                </span>
                              </div>
                              <div className="info-item">
                                <span className="label">
                                  Type d'intervention
                                </span>
                                <span className="value">
                                  {entretien.intervention?.typeIntervention ||
                                    "Non spécifié"}
                                </span>
                              </div>
                              <div className="info-item">
                                <span className="label">
                                  Date d'intervention
                                </span>
                                <span className="value">
                                  {entretien.intervention?.dateIntervention ||
                                    "À remplir"}
                                </span>
                              </div>
                            </div>
                          </Accordion>
                        </div>
                      )
                    )}
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
                          <span className="label">
                            Prochain entretien prévu
                          </span>
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
                {loyerEtCharges.decomptes_annuels &&
                loyerEtCharges.decomptes_annuels.length > 0 ? (
                  <div className="items-list">
                    {loyerEtCharges.decomptes_annuels.map((decompte, index) => (
                      <div key={index} className="mini-card">
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="label">Année</span>
                            <span className="value">
                              {decompte.annee ?? "À remplir"}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Montant total</span>
                            <span className="value">
                              {decompte.montant_total ?? "0"} €
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Archivé</span>
                            <span className="value">
                              {decompte.archive ? "✅ Oui" : "❌ Non"}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Notes</span>
                            <div className="rich-text">
                              {decompte.notes?.length > 0 ? (
                                decompte.notes.map((block, i) => (
                                  <div key={i}>
                                    {block.children?.[0]?.text || "À remplir"}
                                  </div>
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
                                onChange={(e) =>
                                  handleFileUpload(
                                    e,
                                    "loyer_et_charges",
                                    "fichier_decompte",
                                    false
                                  )
                                }
                              />
                              <button
                                className="upload-btn"
                                onClick={() =>
                                  uploadFiles(
                                    "loyer_et_charges",
                                    "fichier_decompte"
                                  )
                                }
                              >
                                Ajouter
                              </button>
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
                              onChange={(e) =>
                                handleFileUpload(
                                  e,
                                  "loyer_et_charges",
                                  "fichier_decompte",
                                  false
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                uploadFiles(
                                  "loyer_et_charges",
                                  "fichier_decompte"
                                )
                              }
                            >
                              Ajouter
                            </button>
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
            <Accordion title="Syndic" icon="👤">
              <div className="documents-section">
                {appart?.attributes?.syndic?.length > 0 ? (
                  <div className="items-list">
                    {appart.attributes.syndic.map((syndic, index) => (
                      <div key={index} className="mini-card">
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="label">Date AG</span>
                            <span className="value">
                              {syndic.date_ag || "À remplir"}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Coordonnées Syndic</span>
                            <div className="rich-text">
                              {syndic.coordonnees_syndic?.length > 0 ? (
                                syndic.coordonnees_syndic.map((block, i) => (
                                  <div key={i}>
                                    {block.children?.[0]?.text || "À remplir"}
                                  </div>
                                ))
                              ) : (
                                <span className="empty-state">À remplir</span>
                              )}
                            </div>
                          </div>
                          <div className="info-item">
                            <span className="label">Contacts Syndic</span>
                            <div className="rich-text">
                              {syndic.contacts_syndic?.length > 0 ? (
                                syndic.contacts_syndic.map((block, i) => (
                                  <div key={i}>
                                    {block.children?.[0]?.text || "À remplir"}
                                  </div>
                                ))
                              ) : (
                                <span className="empty-state">À remplir</span>
                              )}
                            </div>
                          </div>
                          <div className="info-item">
                            <span className="label">URL Intranet Syndic</span>
                            <div className="rich-text">
                              {syndic.url_intranet_syndic?.length > 0 ? (
                                syndic.url_intranet_syndic.map((block, i) => (
                                  <div key={i}>
                                    {block.children?.[0]?.text || "À remplir"}
                                  </div>
                                ))
                              ) : (
                                <span className="empty-state">À remplir</span>
                              )}
                            </div>
                          </div>
                          <div className="info-item">
                            <span className="label">
                              Représentants Syndicaux
                            </span>
                            <div className="rich-text">
                              {syndic.representants_syndicaux?.length > 0 ? (
                                syndic.representants_syndicaux.map(
                                  (block, i) => (
                                    <div key={i}>
                                      {block.children?.[0]?.text || "À remplir"}
                                    </div>
                                  )
                                )
                              ) : (
                                <span className="empty-state">À remplir</span>
                              )}
                            </div>
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
                          <span className="label">Date AG</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Coordonnées Syndic</span>
                          <div className="rich-text">
                            <span className="empty-state">À remplir</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <span className="label">Contacts Syndic</span>
                          <div className="rich-text">
                            <span className="empty-state">À remplir</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <span className="label">URL Intranet Syndic</span>
                          <div className="rich-text">
                            <span className="empty-state">À remplir</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <span className="label">Représentants Syndicaux</span>
                          <div className="rich-text">
                            <span className="empty-state">À remplir</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Accordion>
          </div>
        </div>

        {/* Fiche DOSSIER EN COURS qui inclue litiges et travaux*/}
        <div className="card card-dossier">
          <div className="card-header">
            <h2>🗂️ Dossier en cours</h2>
          </div>
          <div className="card-content">
            <Accordion title="Litiges" icon="⚖️">
              <div className="documents-section">
                {appart?.attributes?.dossier_en_cours?.litiges?.length > 0 ? (
                  <div className="items-list">
                    {appart.attributes.dossier_en_cours.litiges.map(
                      (litige, index) => (
                        <div key={index} className="mini-card">
                          <div className="info-grid">
                            <div className="info-item">
                              <span className="label">Type</span>
                              <span className="value">
                                {litige.type || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Description</span>
                              <span className="value">
                                {litige.description || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Date de l'incident</span>
                              <span className="value">
                                {litige.dateIncident || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Statut</span>
                              <span className="value">
                                {litige.statut || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Notes</span>
                              <div className="rich-text">
                                {litige.notes ? (
                                  <p>{litige.notes}</p>
                                ) : (
                                  <span className="empty-state">À remplir</span>
                                )}
                              </div>
                            </div>
                            <div className="info-item">
                              <span className="label">Documents</span>
                              <span className="value">
                                {litige.documentsLitige?.data?.length > 0 ? (
                                  litige.documentsLitige.data.map((file, i) => (
                                    <a
                                      key={i}
                                      href={`http://localhost:1337${file.attributes.url}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="doc-link"
                                    >
                                      📎 Document {i + 1}
                                    </a>
                                  ))
                                ) : (
                                  <span className="no-doc">Aucun fichier</span>
                                )}
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  multiple
                                  onChange={(e) =>
                                    handleFileUpload(
                                      e,
                                      "dossier_en_cours.litiges",
                                      `documentsLitige_${index}`,
                                      true
                                    )
                                  }
                                />
                                <button
                                  onClick={() =>
                                    uploadFiles(
                                      "dossier_en_cours.litiges",
                                      `documentsLitige_${index}`
                                    )
                                  }
                                >
                                  Ajouter
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="items-list">
                    <div className="mini-card">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Type</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Description</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Date de l'incident</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Statut</span>
                          <span className="value">en-cours</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Notes</span>
                          <div className="rich-text">
                            <span className="empty-state">À remplir</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <span className="label">Documents</span>
                          <span className="value">
                            <span className="no-doc">Aucun fichier</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              multiple
                              onChange={(e) =>
                                handleFileUpload(
                                  e,
                                  "dossier_en_cours.litiges",
                                  `documentsLitige_0`,
                                  true
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                uploadFiles(
                                  "dossier_en_cours.litiges",
                                  `documentsLitige_0`
                                )
                              }
                            >
                              Ajouter
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Accordion>

            <Accordion title="Travaux" icon="🛠️">
              <div className="documents-section">
                {appart?.attributes?.dossier_en_cours?.travaux?.length > 0 ? (
                  <div className="items-list">
                    {appart.attributes.dossier_en_cours.travaux.map(
                      (travaux, index) => (
                        <div key={index} className="mini-card">
                          <div className="info-grid">
                            <div className="info-item">
                              <span className="label">Titre</span>
                              <span className="value">
                                {travaux.titre || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Type</span>
                              <span className="value">
                                {travaux.typesTravaux || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Description</span>
                              <span className="value">
                                {travaux.description || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Date de début</span>
                              <span className="value">
                                {travaux.dateDebut || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Date de fin</span>
                              <span className="value">
                                {travaux.dateFin || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Entreprise</span>
                              <span className="value">
                                {travaux.entreprise || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Statut</span>
                              <span className="value">
                                {travaux.statut || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Budget</span>
                              <span className="value">
                                {travaux.budget
                                  ? `${travaux.budget} €`
                                  : "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Archivé</span>
                              <span className="value">
                                {travaux.archive ? "✅ Oui" : "❌ Non"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Notes</span>
                              <div className="rich-text">
                                {travaux.notes ? (
                                  <p>{travaux.notes}</p>
                                ) : (
                                  <span className="empty-state">À remplir</span>
                                )}
                              </div>
                            </div>
                            <div className="info-item">
                              <span className="label">Documents</span>
                              <span className="value">
                                {travaux.documentsTravaux?.data?.length > 0 ? (
                                  travaux.documentsTravaux.data.map(
                                    (file, i) => (
                                      <a
                                        key={i}
                                        href={`http://localhost:1337${file.attributes.url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="doc-link"
                                      >
                                        📎 Document {i + 1}
                                      </a>
                                    )
                                  )
                                ) : (
                                  <span className="no-doc">Aucun fichier</span>
                                )}
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  multiple
                                  onChange={(e) =>
                                    handleFileUpload(
                                      e,
                                      "dossier_en_cours.travaux",
                                      `documentsTravaux_${index}`,
                                      true
                                    )
                                  }
                                />
                                <button
                                  onClick={() =>
                                    uploadFiles(
                                      "dossier_en_cours.travaux",
                                      `documentsTravaux_${index}`
                                    )
                                  }
                                >
                                  Ajouter
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="items-list">
                    <div className="mini-card">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Titre</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Type</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Description</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Date de début</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Date de fin</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Entreprise</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Statut</span>
                          <span className="value">planifie</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Budget</span>
                          <span className="value">0 €</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Archivé</span>
                          <span className="value">❌ Non</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Notes</span>
                          <div className="rich-text">
                            <span className="empty-state">À remplir</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <span className="label">Documents</span>
                          <span className="value">
                            <span className="no-doc">Aucun fichier</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              multiple
                              onChange={(e) =>
                                handleFileUpload(
                                  e,
                                  "dossier_en_cours.travaux",
                                  `documentsTravaux_0`,
                                  true
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                uploadFiles(
                                  "dossier_en_cours.travaux",
                                  `documentsTravaux_0`
                                )
                              }
                            >
                              Ajouter
                            </button>
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
                    {appart.attributes.trousseaux.identifiantTrousseau ||
                      "Non renseigné"}
                  </span>
                </div>
                <div className="trousseau-holder">
                  <span className="label">Détenteur:</span>
                  <span className="value">
                    {appart.attributes.trousseaux.detenteurTrousseau ||
                      "Non renseigné"}
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
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                "trousseaux",
                                "photoTrousseau",
                                false
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              uploadFiles("trousseaux", "photoTrousseau")
                            }
                          >
                            Ajouter
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </Accordion>
                <div className="trousseau-content">
                  <h4>📋 Contenu</h4>
                  <div className="rich-text">
                    {appart.attributes.trousseaux.contenuTrousseau?.length >
                    0 ? (
                      appart.attributes.trousseaux.contenuTrousseau.map(
                        (block, i) => (
                          <div key={i}>
                            {block.children?.[0]?.text || "Contenu"}
                          </div>
                        )
                      )
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
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                "trousseaux",
                                "photoTrousseau",
                                false
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              uploadFiles("trousseaux", "photoTrousseau")
                            }
                          >
                            Ajouter
                          </button>
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
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2>📞 Autres Contacts</h2>
            <div className="contacts-actions">
              <button
                className="btn-contacts-action btn-add"
                onClick={handleAddContact}
                title="Ajouter un contact"
                aria-label="Ajouter un contact"
              >
                <FaPlus />
                <span>Ajouter</span>
              </button>
              <button
                className="btn-contacts-action btn-archive"
                onClick={handleArchiveContact}
                title="Archiver le contact"
                aria-label="Archiver le contact"
              >
                <FaArchive />
                <span>Archiver</span>
              </button>
              <button
                className="btn-contacts-action btn-delete"
                onClick={handleDeleteContact}
                title="Supprimer le contact"
                aria-label="Supprimer le contact"
              >
                <FaTrash />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
          <div className="card-content">
            <Accordion title="Divers" icon="📱">
              <div className="documents-section">
                {appart?.attributes?.autres_contacts?.length > 0 ? (
                  <div className="items-list">
                    {appart.attributes.autres_contacts.map((contact, index) => (
                      <div key={index} className="mini-card">
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="label">Nom</span>
                            <span className="value">
                              {contact.nom || "À remplir"}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Type de contact</span>
                            <span className="value">
                              {contact.type_contact || "À remplir"}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Coordonnées</span>
                            <div className="rich-text">
                              {contact.coordonnees?.length > 0 ? (
                                contact.coordonnees.map((block, i) => (
                                  <div key={i}>
                                    {block.children?.[0]?.text || "À remplir"}
                                  </div>
                                ))
                              ) : (
                                <span className="empty-state">À remplir</span>
                              )}
                            </div>
                          </div>
                          <div className="info-item">
                            <span className="label">Notes</span>
                            <div className="rich-text">
                              {contact.notes?.length > 0 ? (
                                contact.notes.map((block, i) => (
                                  <div key={i}>
                                    {block.children?.[0]?.text || "À remplir"}
                                  </div>
                                ))
                              ) : (
                                <span className="empty-state">À remplir</span>
                              )}
                            </div>
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
                          <span className="label">Nom</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Type de contact</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Coordonnées</span>
                          <div className="rich-text">
                            <span className="empty-state">À remplir</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <span className="label">Notes</span>
                          <div className="rich-text">
                            <span className="empty-state">À remplir</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Accordion>
          </div>
        </div>

        {/* Fiche Interventions */}
        <div className="card card-interventions">
          <div className="card-header">
            <h2>🔧 Interventions</h2>
          </div>
          <div className="card-content">
            <Accordion title="Historique Interventions" icon="🛠️">
              <div className="documents-section">
                {appart?.attributes?.historique_interventions?.length > 0 ? (
                  <div className="items-list">
                    {appart.attributes.historique_interventions.map(
                      (intervention, index) => (
                        <div key={index} className="mini-card">
                          <div className="info-grid">
                            <div className="info-item">
                              <span className="label">Type d'intervention</span>
                              <span className="value">
                                {intervention.type_intervention || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Nom de l'entreprise</span>
                              <span className="value">
                                {intervention.nom_entreprise || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">
                                Nom de l'intervenant
                              </span>
                              <span className="value">
                                {intervention.nom_intervenant || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Date d'intervention</span>
                              <span className="value">
                                {intervention.date_intervention || "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Description</span>
                              <div className="rich-text">
                                {intervention.description ? (
                                  <p>{intervention.description}</p>
                                ) : (
                                  <span className="empty-state">À remplir</span>
                                )}
                              </div>
                            </div>
                            <div className="info-item">
                              <span className="label">Coût</span>
                              <span className="value">
                                {intervention.cout
                                  ? `${intervention.cout} €`
                                  : "À remplir"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Satisfaction</span>
                              <span className="value">
                                {intervention.satisfaction
                                  ? `${intervention.satisfaction}/5`
                                  : "Non évalué"}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Notes</span>
                              <div className="rich-text">
                                {intervention.notes ? (
                                  <p>{intervention.notes}</p>
                                ) : (
                                  <span className="empty-state">À remplir</span>
                                )}
                              </div>
                            </div>
                            <div className="info-item">
                              <span className="label">Documents</span>
                              <span className="value">
                                {intervention.documents_intervention?.data
                                  ?.length > 0 ? (
                                  intervention.documents_intervention.data.map(
                                    (file, i) => (
                                      <a
                                        key={i}
                                        href={`http://localhost:1337${file.attributes.url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="doc-link"
                                      >
                                        📎 Document {i + 1}
                                      </a>
                                    )
                                  )
                                ) : (
                                  <span className="no-doc">Aucun fichier</span>
                                )}
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  multiple
                                  onChange={(e) =>
                                    handleFileUpload(
                                      e,
                                      "historique_interventions",
                                      `documents_intervention_${index}`,
                                      true
                                    )
                                  }
                                />
                                <button
                                  className="upload-btn"
                                  onClick={() =>
                                    uploadFiles(
                                      "historique_interventions",
                                      `documents_intervention_${index}`
                                    )
                                  }
                                >
                                  Ajouter
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="items-list">
                    <div className="mini-card">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Type d'intervention</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Nom de l'entreprise</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Nom de l'intervenant</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Date d'intervention</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Description</span>
                          <div className="rich-text">
                            <span className="empty-state">À remplir</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <span className="label">Coût</span>
                          <span className="value">À remplir</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Satisfaction</span>
                          <span className="value">Non évalué</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Notes</span>
                          <div className="rich-text">
                            <span className="empty-state">À remplir</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <span className="label">Documents</span>
                          <span className="value">
                            <span className="no-doc">Aucun fichier</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              multiple
                              onChange={(e) =>
                                handleFileUpload(
                                  e,
                                  "historique_interventions",
                                  `documents_intervention_0`,
                                  true
                                )
                              }
                            />
                            <button
                              className="upload-btn"
                              onClick={() =>
                                uploadFiles(
                                  "historique_interventions",
                                  `documents_intervention_0`
                                )
                              }
                            >
                              Ajouter
                            </button>
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
                {appart?.attributes?.relocation?.agence_coordonnees?.length >
                0 ? (
                  appart.attributes.relocation.agence_coordonnees.map(
                    (block, i) => (
                      <div key={i}>
                        {block.children?.[0]?.text || "Contenu"}
                      </div>
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
                      {appart?.attributes?.relocation?.mandats_location?.data
                        ?.length > 0 ? (
                        appart.attributes.relocation.mandats_location.data.map(
                          (file, i) => (
                            <a
                              key={i}
                              href={`http://localhost:1337${file.attributes.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link"
                            >
                              📁 Mandat {i + 1}
                            </a>
                          )
                        )
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "relocation",
                            "mandats_location",
                            true
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          uploadFiles("relocation", "mandats_location")
                        }
                      >
                        Ajouter
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Diagnostiques</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.diagnostiques?.data
                        ?.length > 0 ? (
                        appart.attributes.relocation.diagnostiques.data.map(
                          (file, i) => (
                            <a
                              key={i}
                              href={`http://localhost:1337${file.attributes.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link"
                            >
                              🧪 Diagnostic {i + 1}
                            </a>
                          )
                        )
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "relocation",
                            "diagnostiques",
                            true
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          uploadFiles("relocation", "diagnostiques")
                        }
                      >
                        Ajouter
                      </button>
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
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "relocation",
                            "bail_fiinal",
                            false
                          )
                        }
                      />
                      <button
                        onClick={() => uploadFiles("relocation", "bail_fiinal")}
                      >
                        Ajouter
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">État des lieux sortie</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.etat_des_lieux_sortie
                        ?.data ? (
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
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "relocation",
                            "etat_des_lieux_sortie",
                            false
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          uploadFiles("relocation", "etat_des_lieux_sortie")
                        }
                      >
                        Ajouter
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">État des lieux entrée</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.etat_des_lieux_entree
                        ?.data ? (
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
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "relocation",
                            "etat_des_lieux_entree",
                            false
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          uploadFiles("relocation", "etat_des_lieux_entree")
                        }
                      >
                        Ajouter
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Dossier locataire retenu</span>
                    <span className="value">
                      {appart?.attributes?.relocation
                        ?.dossier_candidature_locataire_retenu?.data?.length >
                      0 ? (
                        appart.attributes.relocation.dossier_candidature_locataire_retenu.data.map(
                          (file, i) => (
                            <a
                              key={i}
                              href={`http://localhost:1337${file.attributes.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link"
                            >
                              🗂️ Dossier {i + 1}
                            </a>
                          )
                        )
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "relocation",
                            "dossier_candidature_locataire_retenu",
                            true
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          uploadFiles(
                            "relocation",
                            "dossier_candidature_locataire_retenu"
                          )
                        }
                      >
                        Ajouter
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Photos</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.photos?.data?.length >
                      0 ? (
                        appart.attributes.relocation.photos.data.map(
                          (file, i) => (
                            <a
                              key={i}
                              href={`http://localhost:1337${file.attributes.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link"
                            >
                              🖼️ Photo {i + 1}
                            </a>
                          )
                        )
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) =>
                          handleFileUpload(e, "relocation", "photos", true)
                        }
                      />
                      <button
                        onClick={() => uploadFiles("relocation", "photos")}
                      >
                        Ajouter
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Fichiers travaux</span>
                    <span className="value">
                      {appart?.attributes?.relocation?.travaux_fichiers?.data
                        ?.length > 0 ? (
                        appart.attributes.relocation.travaux_fichiers.data.map(
                          (file, i) => (
                            <a
                              key={i}
                              href={`http://localhost:1337${file.attributes.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link"
                            >
                              📎 Fichier travaux {i + 1}
                            </a>
                          )
                        )
                      ) : (
                        <span className="no-doc">Aucun fichier</span>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*,audio/*"
                        multiple
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "relocation",
                            "travaux_fichiers",
                            true
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          uploadFiles("relocation", "travaux_fichiers")
                        }
                      >
                        Ajouter
                      </button>
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
