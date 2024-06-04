import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { Helmet } from 'react-helmet';
import Background from '../components/Background';
import Footer from '../components/Footer';
import grass from '../assets/images/grass.png';
import fire from '../assets/images/fire.png';
import water from '../assets/images/water.png';
import normal from '../assets/images/normal.png';
import darkness from '../assets/images/darkness.png';
import dragon from '../assets/images/dragon.png';
import fairy from '../assets/images/fairy.png';
import fighting from '../assets/images/fighting.png';
import lightning from '../assets/images/lightning.png';
import metal from '../assets/images/metal.png';
import psychic from '../assets/images/psychic.png';

const CardDetails = () => {
  const { id } = useParams();
  const [card, setCard] = useState(null);

  const handleDownloadJSON = () => {
    const json = JSON.stringify(card, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const response = await axios.get(`https://api.pokemontcg.io/v2/cards/${id}`, {
          headers: {
            'X-Api-Key': 'dcd81c77-600b-4649-ae91-8a317c4cd62e'
          }
        });
        setCard(response.data.data);
      } catch (err) {
        console.error('Error fetching card details:', err.message);
      }
    };

    fetchCardDetails();
  }, [id]);

  if (!card) {
    return <div>Loading...</div>;
  }

  const getImageSrc = (type) => {
    switch (type) {
      case 'Grass': return grass;
      case 'Fire': return fire;
      case 'Water': return water;
      case 'Darkness': return darkness;
      case 'Dragon': return dragon;
      case 'Fairy': return fairy;
      case 'Psychic': return psychic;
      case 'Fighting': return fighting;
      case 'Lightning': return lightning;
      case 'Metal': return metal;
      default: return normal;
    }
  };

  return (
    <>
      <Helmet>
        <title>PokeDB - {card.name}</title>
      </Helmet>
      <Background />
      <Header />
      <div id="wrapper">
        <div className="card_details">
          <div className="container">
            <div id="card-details" className="columns" data-controller="card">
              <div className="column is-one-third">
                <img
                  className="card-image"
                  src={card.images.large || ''}
                  alt={card.name}
                />
              </div>
              <div className="column is-6 is-offset-1">
                <div className="content card-details">
                  <nav className="card-details_head level">
                    <div className="level-left">
                      <div className="level-item">
                        <span className="title is-3">{card.name || ''}
                          {card.subtypes && (
                            <div className="title is-5 has-text-muted">
                              Pokémon - {card.subtypes.join(', ')}
                            </div>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="level-item">
                        <span className="title is-5 is-flex is-align-items-center">
                          {card.hp && <span className="mr-2">HP {card.hp}</span>}
                          {card.types && (
                            <img
                              className="energy"
                              src={getImageSrc(card.types[0])}
                              alt="Energy"
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  </nav>
                  <hr />
                  <section className="pt-0 mb-4">
                    <div className="is-flex is-align-items-center mb-4">
                    <div className="title is-4 has-text-muted mb-0 mr-2">
                        Prices: {
                          card.tcgplayer?.prices?.unlimited?.mid ||
                          card.tcgplayer?.prices?.unlimited?.high ||
                          card.tcgplayer?.prices?.normal?.high ||
                          'N/A'
                        } euro
                      </div>
                    </div>
                  </section>
                  <hr className="mb-0" />
                  {card.abilities && (
                    <section>
                      <p className="heading">Abilities</p>
                      {card.abilities.map((ability, index) => (
                        <div className="card-details_ability" key={index}>
                          <p className="title is-5">{ability.type}: {ability.name}</p>
                          <p>{ability.text}</p>
                        </div>
                      ))}
                    </section>
                  )}
                  {card.attacks && (
                    <section>
                      <p className="heading">Attacks</p>
                      <table>
                        {card.attacks.map((attack, index) => (
                          <tbody className="card-details_attack" key={index}>
                            <tr>
                              <td className="nowrap">
                                {attack.cost.map((type, idx) => (
                                  <img
                                    key={idx}
                                    className="energy"
                                    src={getImageSrc(type)}
                                    alt="Energy"
                                  />
                                ))}
                              </td>
                              <td className="attack-name">
                                <span className="title is-4">{attack.name}</span>
                              </td>
                              <td>
                                <span className="title is-4 is-muted nowrap">{attack.damage}</span>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="3">
                                <p className='info'>{attack.text}</p>
                              </td>
                            </tr>
                          </tbody>
                        ))}
                      </table>
                    </section>
                  )}
                  {card.rules && (
                    <section>
                      <div className="card-details_ability">
                        <p className="heading">Rules</p>
                        {card.rules.map((rule, idx) => (
                          <p className="is-flex is-flex-direction-column" key={idx}>{rule}</p>
                        ))}
                      </div>
                    </section>
                  )}
                  <section>
                    <div className="columns is-flex-wrap-wrap is-mobile">
                      {card.weaknesses && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_weakness">
                            <p className="heading">Weakness</p>
                            {card.weaknesses.map((weakness, idx) => (
                              <p className="title is-5 is-flex is-align-items-center" key={idx}>
                                <img
                                  className="energy"
                                  src={getImageSrc(weakness.type)}
                                  alt="Weakness"
                                />
                                <span className="ml-1">{weakness.value}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {card.resistances && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_resistance">
                            <p className="heading">Resistance</p>
                            {card.resistances.map((resistance, idx) => (
                              <p className="title is-5 is-flex is-align-items-center" key={idx}>
                                <img
                                  className="energy"
                                  src={getImageSrc(resistance.type)}
                                  alt="Resistance"
                                />
                                <span className="ml-1">{resistance.value}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {card.retreatCost && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_retreat">
                            <p className="heading">Retreat Cost</p>
                            {card.retreatCost.map((type, idx) => (
                              <img
                                key={idx}
                                className="energy"
                                src={getImageSrc(type)}
                                alt="Retreat Cost"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {card.artist && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_artist">
                            <p className="heading">Artist</p>
                            <p className="title is-5">{card.artist}</p>
                          </div>
                        </div>
                      )}
                      {card.rarity && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_rarity">
                            <p className="heading">Rarity</p>
                            <p className="title is-5">{card.rarity}</p>
                          </div>
                        </div>
                      )}
                      {card.set && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_set">
                            <p className="heading">Set</p>
                            <p className="title is-5">
                              <a
                                className="is-flex is-align-items-center"
                                href=""
                              >
                                {card.set.name}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                      {card.number && card.set && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_number">
                            <p className="heading">Number</p>
                            <p className="title is-5">{card.number} / {card.set.printedTotal}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button onClick={handleDownloadJSON}>Download JSON</button>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CardDetails;
