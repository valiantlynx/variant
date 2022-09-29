import React, { useState } from "react";
import {Principal} from "@dfinity/principal";
import {variant_backend} from "../../../declarations/variant_backend";

function Balance() {

  const [inputValue, setInput] = useState(""); 
  const [balanceResult, setBalance] = useState(""); 
  const [cryptoSymbol, setSymbol] = useState(""); 
  const [isHidden, setHidden] = useState(true); 
  
  
  async function handleClick() {
    //console.log(inputValue);
    const principal = Principal.fromText(inputValue);
    const balance = await variant_backend.balanceOf(principal);
    const symbol = await variant_backend.getSymbol();
    setBalance(balance.toLocaleString());
    setSymbol(symbol);
    setHidden(false)
  }


  return (
    <div className="window white">
      <label>Check account variant balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={inputValue}
          onChange={(e) => setInput(e.target.value)}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p hidden={isHidden}>This account has a balance of {balanceResult} {cryptoSymbol}.</p>
    </div>
  );
}

export default Balance;
