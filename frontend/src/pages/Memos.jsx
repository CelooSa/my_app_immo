import React, { useState, useEffect } from 'react';
import '../styles/memos.scss';

const postItColors = [
  '#fff9b0', // jaune pastel
  '#ffb3ba', // rose clair
  '#bae1ff', // bleu clair
  '#baffc9', // vert clair
  '#ffffba', // jaune clair
  '#ffdfba', // pêche clair
];

const getRandomColor = () => {
  return postItColors[Math.floor(Math.random() * postItColors.length)];
};


const generateRandomRotation = () => {
  // rotation entre -5deg et +5deg pour chaque post-it
  return `${Math.random() * 10 - 5}deg`;
};

const Memos = () => {
  const [memos, setMemos] = useState([]);
  const [newMemo, setNewMemo] = useState('');

  // Simule un fetch vide au départ
  useEffect(() => {
    setMemos([]); // Vide pour l'instant,  à voir pr remplacer par fetch réel plus tard
  }, []);

  const handleAddMemo = () => {
    if (newMemo.trim() === '') return;
    const memoToAdd = {
      id: Date.now(),
      content: newMemo.trim(),
      rotation: generateRandomRotation(),
      color: getRandomColor(),
    };
    setMemos(prev => [...prev, memoToAdd]);
    setNewMemo('');
  };

  const handleDeleteMemo = (id) => {
    setMemos(prev => prev.filter(memo => memo.id !== id));
  };

  

  return (
    <div className="page-container">
      <h1>Mur de réflexions</h1>

      <div className="add-memo">
        <textarea
          placeholder="Ajouter une nouvelle note..."
          value={newMemo}
          onChange={e => setNewMemo(e.target.value)}
        />
        <button onClick={handleAddMemo}>Ajouter</button>
      </div>

      {memos.length === 0 ? (
        <p className="empty-message">Aucun mémo pour l'instant, ajoutez le vôtre !</p>
      ) : (
        <div className="memos-grid">
          {memos.map(memo => (
            <div
              key={memo.id}
              className="memo-card"
              style={{ 
                transform: `rotate(${memo.rotation})`,
                backgroundColor: memo.color,
          }}
            >

              <button
                className="delete-button"
                onClick={() => handleDeleteMemo(memo.id)}
                aria-label="Supprimer ce mémo"
              >
                x
              </button>

              {memo.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Memos;
