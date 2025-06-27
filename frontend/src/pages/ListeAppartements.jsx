import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/listeAppartements.scss";

const colors = [
  "#F8D7DA",
  "#D1ECF1",
  "#D4EDDA",
  "#FFF3CD",
  "#E2E3E5",
  "#F0D9FF",
  "#FFEFD5",
];

const ListeAppartements = () => {
  const [appartements, setAppartements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mockAppartements = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      attributes: {
        nom: `Appartement #${i + 1}`,
        image: null,
      },
    }));
    setAppartements(mockAppartements);
  }, []);

  const handleAdd = () => {
    const newId = appartements.length
      ? appartements[appartements.length - 1].id + 1
      : 1;
    const newAppart = {
      id: newId,
      attributes: {
        nom: `Nouveau Appartement #${newId}`,
        image: null,
      },
    };
    setAppartements((prev) => [...prev, newAppart]);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Supprimer cet appartement ?");
    if (confirmed) {
      setAppartements((prev) => prev.filter((app) => app.id !== id));
    }
  };

  return (
    <div className="page-container">
      <h1>Liste des appartements</h1>

      <button className="add-new-button" onClick={handleAdd}>
        + New
      </button>

      <div className="grid-appartements">
        {appartements.map((item, index) => (
          <div
            key={item.id}
            className="appartement-card"
            style={{ backgroundColor: colors[index % colors.length] }}
          >
            <div
              className="card-content"
              onClick={() => navigate(`/detail/${item.id}`)}
            >
              <h2>{item.attributes.nom || "Nom non défini"}</h2>
              {item.attributes.image?.data ? (
                <img
                  src={`http://localhost:1337${item.attributes.image.data.attributes.url}`}
                  alt={item.attributes.nom}
                  className="image-appartement"
                />
              ) : (
                <div className="placeholder-image">
                  <p>Image vide</p>
                </div>
              )}
            </div>

            <div className="card-actions">
              <button
                type="button"
                className="save-button-small"
                onClick={() => alert("Sauvegarde à implémenter")}
                title="Sauvegarder cet appartement"
              >
                💾
              </button>

              <button
                type="button"
                className="delete-button-small"
                onClick={() => handleDelete(item.id)}
                title="Supprimer cet appartement"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeAppartements;
