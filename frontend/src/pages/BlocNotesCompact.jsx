import React, { useState, useEffect } from "react";
import "../styles/blocNotesCompact.scss";

const LOCAL_STORAGE_KEY = "myhappyblocnotes";

const BlocNotesCompact = () => {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedNotes) setNotes(savedNotes);
  }, []);

  const handleChange = (e) => {
    setNotes(e.target.value);
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, notes);
    setSaved(true);
  };

  const handleExport = () => {
    const blob = new Blob([notes], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "notes_de_visite.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setNotes("");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSaved(false);
  };

  return (
    <div className="blocnote-compact">
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Tapez vos notes ici..."
        rows={4}
      />

      <div className="buttons-row">
        <button className="save-button" onClick={handleSave} title="Sauvegarder">
          💾 Sauvegarder
        </button>

        <button className="export-button" onClick={handleExport} title="Télécharger">
          ⬇️ Télécharger
        </button>

        <button className="clear-button" onClick={handleClear} title="Effacer tout">
          🗑️ Effacer
        </button>
      </div>

      {saved && <span className="saved-msg">Notes sauvegardées !</span>}
    </div>
  );
};

export default BlocNotesCompact;
