import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { HashRouter, Link, Routes, Route } from "react-router-dom";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
import Anime from "./Anime";
import { openval_backend } from "../../../declarations/openval_backend";
import CURRENT_USER_ID from "../index";


function Header() {

  const [useOwnedGallery, setOwnedGallery] = useState();
  const [listingGallery, setListingGallery] = useState();

  async function getNFTs() {
    const userNFTIds = await openval_backend.getOwnedNFTs(CURRENT_USER_ID);
    console.log(userNFTIds);
    setOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} role="collection"/>);

    const listedNFTIds = await openval_backend.getListedNFTs();
    console.log(listedNFTIds);
    setListingGallery(<Gallery title="Discover" ids={listedNFTIds} role="discover"/>);
  };

  useEffect(() => {
    getNFTs();
  }, []); 

 
    


  return (
    <HashRouter>

      <div className="app-root-1"  >
        
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4" >
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenVal</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/minter">Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/collection">My NFTs</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/anime">Anime</Link>
            </button>
          </div>
        </header>
      </div>
      <Routes >
        <Route exact path="/" element={<img className="bottom-space" src={homeImage} />} component={()=><HomeContainer/>}/>
        <Route path="/discover" element={listingGallery} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/collection" element={useOwnedGallery} />
      </Routes>
    </HashRouter>
  );
}

export default Header;
