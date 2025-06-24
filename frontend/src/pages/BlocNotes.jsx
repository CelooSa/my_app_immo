import React, { useState, useEffect } from 'react';
import MinimalNavbar from '../components/MinimalNavbar';
import '../styles/blocNotes.scss';

const LOCAL_STORAGE_KEY = 'myhappyblocnotes';

const BlocNotes = () => {
    const [notes, setNotes] = useState('');

    // Charger les notes depuis le localStorage au chargement
    useEffect(() => {
        const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedNotes) {
            setNotes(savedNotes);
        }
    }, []);

    // Sauvegarder les notes à chaque changement
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, notes);
    }, [notes]);

    const handleChange = (e) => {
        setNotes(e.target.value);
    };

    const handleClear = () => {
        const confirmClear = window.confirm('🧹 Es-tu sûr(e) de vouloir effacer toutes les notes ?');
        if (confirmClear) {
            setNotes('');
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    };

    const handleExport = () => {
        const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'notes_de_visite.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };



    return (
        <>
            <MinimalNavbar />
            <div className="blocnote-container">
                <h1>Bloc Notes</h1>

                <textarea
                    value={notes}
                    onChange={handleChange}
                    placeholder="Tapez vos notes ici..."
                    rows={15}
                />

                <button className="clear-button" onClick={handleClear}>
                    🧹 Effacer les notes
                </button>
                
                <button className="export-button" onClick={handleExport}>
                     💾 Téléchargement
                </button>
            </div>
        </>
    );
};

export default BlocNotes;
