import React, { useState } from 'react';
import logo from "../../assets/logo.png"

function Header(props) {
  const [copySuccess, setCopySuccess] = useState('');

  const copyToClipBoard = async copyMe => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess('Copied!');
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };
  return (
    <header>
      <div className="blue window" id="logo">



        <h1>
          <div role="img" aria-label="tap emoji">
            <a
              href="https://52nbc-syaaa-aaaak-acxcq-cai.ic0.app"
              className="">
              <img
                src={logo}
                alt="logo of anime variant"
                className="blue window-small"
                width="80"
                height="80"
                role="img"

                aria-label="Bootstrap" />
            </a>
          </div>
          <center>Variant Coin <br />(VAR)</center>
        </h1>
        <center>
          <h6>Your wallet Principal ID:</h6>
          <span
            className="principal "
            onClick={() => copyToClipBoard(props.currentPrincipalID)}
            type="text">
            {props.currentPrincipalID}
            <i className="fa-solid fa-copy"></i>
          </span>
          {copySuccess}
        </center>


      </div>

    </header>
  );
}

export default Header;
