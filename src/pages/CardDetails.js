import React from 'react';
import Header from '../components/Header';
import { Helmet } from 'react-helmet';
import Background from '../components/Background';
import Footer from '../components/Footer';
import grass from '../assets/images/grass.png';
import fire from '../assets/images/fire.png';
import normal from '../assets/images/normal.png';

const CardDetails = () => {
  const cardName = "Celebi & Venusaur-GX";
  return (
    <>
    <Helmet>
        <title>PokeDB - {cardName} </title>
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
              src="https://images.pokemontcg.io/sm9/1_hires.png"
              alt="Card"
            />
          </div>
          <div className="column is-6 is-offset-1">
            <div className="content card-details">
              <nav className="card-details_head level">
                <div className="level-left">
                  <div className="level-item">
                  <span className="title is-3">{cardName}
                      <div className="title is-5 has-text-muted">
                        Pokémon - Basic, TAG TEAM, GX
                      </div>
                    </span>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <span className="title is-5 is-flex is-align-items-center">
                      <span className="mr-2">HP 270</span>
                      <img
                        className="energy"
                        src={grass}
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
                    Prices: 40 euro
                  </div>
                </div>
              </section>
              <hr className="mb-0" />
              <section>
                <p className="heading">Attacks</p>
                <table>
                  <tbody className="card-details_attack">
                    <tr>
                      <td className="nowrap">
                        <img
                          className="energy"
                          src={grass}
                          alt="Energy"
                        />
                        <img
                          className="energy"
                          src={normal}
                          alt="Energy"
                        />
                        <img
                          className="energy"
                          src={normal}
                          alt="Energy"
                        />
                      </td>
                      <td className="attack-name">
                        <span className="title is-4">Pollen Hazard</span>
                      </td>
                      <td>
                        <span className="title is-4 is-muted nowrap">50</span>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <p className='info'>
                          Your opponent's Active Pokémon is now Burned, Confused,
                          and Poisoned.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                  </tbody>
                  <tbody className="card-details_attack">
                    <tr>
                      <td className="nowrap">
                        <img
                          className="energy"
                          src={grass}
                          alt="Energy"
                        />
                        <img
                          className="energy"
                          src={grass}
                          alt="Energy"
                        />
                        <img
                          className="energy"
                          src={normal}
                          alt="Energy"
                        />
                        <img
                          className="energy"
                          src={normal}
                          alt="Energy"
                        />
                      </td>
                      <td className="attack-name">
                        <span className="title is-4">Solar Beam</span>
                      </td>
                      <td>
                        <span className="title is-4 is-muted nowrap">150</span>
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                  </tbody>
                  <tbody className="card-details_attack">
                    <tr>
                      <td className="nowrap">
                        <img
                          className="energy"
                          src={grass}
                          alt="Energy"
                        />
                        <img
                          className="energy"
                          src={grass}
                          alt="Energy"
                        />
                        <img
                          className="energy"
                          src={normal}
                          alt="Energy"
                        />
                        <img
                          className="energy"
                          src={normal}
                          alt="Energy"
                        />
                      </td>
                      <td className="attack-name">
                        <span className="title is-4">Evergreen-GX</span>
                      </td>
                      <td>
                        <span className="title is-4 is-muted nowrap">180</span>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <p className='info'>
                          Heal all damage from this Pokémon. If this Pokémon has at
                          least 1 extra Grass Energy attached to it (in addition to
                          this attack's cost), shuffle all cards from your discard
                          pile into your deck. (You can't use more than 1 GX attack
                          in a game.)
                        </p>
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                  </tbody>
                </table>
              </section>
              <section>
                <div className="card-details_ability">
                  <p className="heading">Rules</p>
                  <p className="is-flex is-flex-direction-column">
                    TAG TEAM rule: When your TAG TEAM is Knocked Out, your opponent
                    takes 3 Prize cards.
                  </p>
                </div>
              </section>
              <section>
                <div className="columns is-flex-wrap-wrap is-mobile">
                  <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                    <div className="card-details_weakness">
                      <p className="heading">weakness</p>
                      <p className="title is-5 is-flex is-align-items-center">
                        <img
                          className="energy"
                          src={fire}
                          alt="Weakness"
                        />
                        <span className="ml-1">×2</span>
                      </p>
                    </div>
                  </div>
                  <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                    <div className="card-details_resistance">
                      <p className="heading">resistance</p>
                      <p className="title is-5">N/A</p>
                    </div>
                  </div>
                  <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                    <div className="card-details_retreat">
                      <p className="heading">retreat cost</p>
                      <img
                        className="energy"
                        src={normal}
                        alt="Retreat Cost"
                      />
                      <img
                        className="energy"
                        src={normal}
                        alt="Retreat Cost"
                      />
                      <img
                        className="energy"
                        src={normal}
                        alt="Retreat Cost"
                      />
                      <img
                        className="energy"
                        src={normal}
                        alt="Retreat Cost"
                      />
                    </div>
                  </div>
                  <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                    <div className="card-details_artist">
                      <p className="heading">artist</p>
                      <p className="title is-5">Shin Nagasawa</p>
                    </div>
                  </div>
                  <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                    <div className="card-details_rarity">
                      <p className="heading">rarity</p>
                      <p className="title is-5">Promo</p>
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
                          SM Black Star Promos
                          
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                    <div className="card-details_number">
                      <p className="heading">number</p>
                      <p className="title is-5">SM167 / 248</p>
                    </div>
                  </div>
                </div>
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
