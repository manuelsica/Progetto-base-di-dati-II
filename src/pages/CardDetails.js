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
                          <div className="title is-5 has-text-muted">
                            Pokémon - {card.subtypes?.join(', ') || ''}
                          </div>
                        </span>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="level-item">
                        <span className="title is-5 is-flex is-align-items-center">
                          <span className="mr-2">HP {card.hp || ''}</span>
                          <img
                            className="energy"
                            src={card.types?.includes('Grass') ? grass :
                              card.types?.includes('Fire') ? fire :
                                card.types?.includes('Water') ? water :
                                  card.types?.includes('Darkness') ? darkness :
                                    card.types?.includes('Dragon') ? dragon :
                                      card.types?.includes('Fairy') ? fairy :
                                        card.types?.includes('Psychic') ? psychic :
                                          card.types?.includes('Fighting') ? fighting :
                                            card.types?.includes('Lightning') ? lightning :
                                              card.types?.includes('Metal') ? metal : normal
                            }
                            alt="Energy"
                          />
                        </span>
                      </div>
                    </div>
                  </nav>
                  <hr />
                  <section className="pt-0 mb-4">
                    <div className="is-flex is-align-items-center mb-4">
                      <div className="title is-4 has-text-muted mb-0 mr-2">
                        Prices: {card.tcgplayer?.prices?.holofoil?.mid || 'N/A'} euro
                      </div>
                    </div>
                  </section>
                  <hr className="mb-0" />
                  <section>
                    <p className="heading">Abilities</p>
                    {card.abilities && card.abilities.map((ability, index) => (
                      <div className="card-details_ability" key={index}>
                        <p className="title is-5">{ability.type || ''}: {ability.name || ''}</p>
                        <p>{ability.text || ''}</p>
                      </div>
                    ))}

                  </section>
                  <section>
                    <p className="heading">Attacks</p>
                    <table>
                      {card.attacks ? card.attacks.map((attack, index) => (
                        <tbody className="card-details_attack" key={index}>
                          <tr>
                            <td className="nowrap">
                              {attack.cost.map((type, idx) => (
                                <img
                                  key={idx}
                                  className="energy"
                                  src={
                                    type === 'Grass' ? grass :
                                      type === 'Water' ? water :
                                        type === 'Fire' ? fire :
                                          type === 'Darkness' ? darkness :
                                            type === 'Dragon' ? dragon :
                                              type === 'Fairy' ? fairy :
                                                type === 'Psychic' ? psychic :
                                                  type === 'Fighting' ? fighting :
                                                    type === 'Lightning' ? lightning :
                                                      type === 'Metal' ? metal : normal
                                  }
                                  alt="Energy"
                                />
                              ))}
                            </td>
                            <td className="attack-name">
                              <span className="title is-4">{attack.name || ''}</span>
                            </td>
                            <td>
                              <span className="title is-4 is-muted nowrap">{attack.damage || ''}</span>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="3">
                              <p className='info'>{attack.text || ''}</p>
                            </td>
                          </tr>
                        </tbody>
                      )) : null}
                    </table>
                  </section>
                  <section>
                    <div className="card-details_ability">
                      <p className="heading">Rules</p>
                      {card.rules && card.rules.map((rule, idx) => (
                        <p className="is-flex is-flex-direction-column" key={idx}>{rule}</p>
                      ))}
                    </div>
                  </section>
                  <section>
                    <div className="columns is-flex-wrap-wrap is-mobile">
                      <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                        <div className="card-details_weakness">
                          <p className="heading">weakness</p>
                          {card.weaknesses && card.weaknesses.map((weakness, idx) => (
                            <p className="title is-5 is-flex is-align-items-center" key={idx}>
                              <img
                                className="energy"
                                src={
                                  weakness.type === 'Grass' ? grass :
                                    weakness.type === 'Fire' ? fire :
                                      weakness.type === 'Water' ? water :
                                        weakness.type === 'Darkness' ? darkness :
                                          weakness.type === 'Dragon' ? dragon :
                                            weakness.type === 'Fairy' ? fairy :
                                              weakness.type === 'Psychic' ? psychic :
                                                weakness.type === 'Fighting' ? fighting :
                                                  weakness.type === 'Lightning' ? lightning :
                                                    weakness.type === 'Metal' ? metal : normal
                                }
                                alt="Weakness"
                              />
                              <span className="ml-1">{weakness.value || ''}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                        {card.resistances && card.resistances.map((resistance, idx) => (
                          <div className="card-details_resistance" key={idx}>
                            <p className="heading">resistance</p>
                            <p className="title is-5">
                              <img
                                className="energy"
                                src={
                                  resistance.type === 'Grass' ? grass :
                                    resistance.type === 'Fire' ? fire :
                                      resistance.type === 'Water' ? water :
                                        resistance.type === 'Darkness' ? darkness :
                                          resistance.type === 'Dragon' ? dragon :
                                            resistance.type === 'Fairy' ? fairy :
                                              resistance.type === 'Psychic' ? psychic :
                                                resistance.type === 'Fighting' ? fighting :
                                                  resistance.type === 'Lightning' ? lightning :
                                                    resistance.type === 'Metal' ? metal : normal
                                }
                                alt="Resistance"
                              />
                              <span className="ml-1">{resistance.value || ''}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                        <div className="card-details_retreat">
                          <p className="heading">retreat cost</p>
                          {card.retreatCost ? card.retreatCost.map((type, idx) => (
                            <img
                              key={idx}
                              className="energy"
                              src={
                                type === 'Grass' ? grass :
                                  type === 'Fire' ? fire :
                                    type === 'Water' ? water :
                                      type === 'Darkness' ? darkness :
                                        type === 'Dragon' ? dragon :
                                          type === 'Fairy' ? fairy :
                                            type === 'Psychic' ? psychic :
                                              type === 'Fighting' ? fighting :
                                                type === 'Lightning' ? lightning :
                                                  type === 'Metal' ? metal : normal
                              }
                              alt="Retreat Cost"
                            />
                          )) : null}
                        </div>
                      </div>
                      <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                        <div className="card-details_artist">
                          <p className="heading">artist</p>
                          <p className="title is-5">{card.artist || ''}</p>
                        </div>
                      </div>
                      <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                        <div className="card-details_rarity">
                          <p className="heading">rarity</p>
                          <p className="title is-5">{card.rarity || ''}</p>
                        </div>
                      </div>
                      <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                        <div className="card-details_set">
                          <p className="heading">set</p>
                          <p className="title is-5">
                            <a
                              className="is-flex is-align-items-center"
                              href=""
                            >
                              {card.set ? card.set.name || '' : ''}
                            </a>
                          </p>
                        </div>
                      </div>
                      <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                        <div className="card-details_number">
                          <p className="heading">number</p>
                          <p className="title is-5">{card.number || ''} / {card.set ? card.set.printedTotal || '' : ''}</p>
                        </div>
                      </div>
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