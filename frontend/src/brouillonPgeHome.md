La partie de cartes  biens locataire ect.. sur la page home:


<section className="features">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              style={{
                transitionDelay: `${i * 100}ms`,
                boxShadow: `0 6px 20px ${f.color}44`
              }}
            >
              <Icon icon={f.icon} style={{ color: f.color }} className="feature-icon" />
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </>
  );
};

/////////////////////////////////////::::::::

et la partie du scss avec le  .feature qui englobe toutes les cartes je mets ce q je veux dedans:

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  padding: 1rem;

  .feature-card {
    background: #fff;
    border-radius: 1rem;
    padding: 1.2rem;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    h3 {
      font-size: 1.3rem;
      margin-bottom: 0.3rem;
    }

    p {
      font-size: 1rem;
      color: #555;
    }
  }
}
