import React, {useEffect, useState} from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token_backend";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { openval_backend } from "../../../declarations/openval_backend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {

  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPrice] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setDisplay] = useState(true);

  const id = props.id; //is a principal id

 //the nft.mo canister is its own canister så instead of simply simply importing it and using its function, we have to send an http request to  it.
 // remember our main.mo(openval_backend) is our canister that we can just import
  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({host: localHost});

  //for working locally: TODO: when deploy live, remove the following line agent is configured to work with a hardcodded live rootkey.
  agent.fetchRootKey();
  let NFTActor;
  
  //load the nft from data to human visible image.
  async function loadNft(){
    //access the nft
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id
    });
    
    //set name
    const name = await NFTActor.getName();
    setName(name);
    //set owner
    const owner = await NFTActor.getOwner();
    setOwner(owner.toText());
    //set image
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], {type: "image/png" })
    );
    setImage(image);

      //if the nft is a collection or discover
    if (props.role == "collection"){
      //if nft is listed
      const nftIsListed = await openval_backend.isListed(props.id);
      if(nftIsListed){
        setOwner("OpenVal"); 
        setBlur({filter: "blur(4px"})
        setSellStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text={"Sell"}/>);
      }
    } else if (props.role == "discover"){
      const originalOwner = await openval_backend.getOriginalOwner(props.id);
      setOwner(originalOwner.toText());
      if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text={"Buy"}/>);
      }

      //check price of the nft
      const price = await openval_backend.getListedNFTPrice(props.id);
      console.log(price)
      setPriceLabel(<PriceLabel sellPrice={price.toString()}/>);
      
    }

    
  }

  //to define where and how many  times we call the function we use the useEffect hook. the second parameter is for how many times to call the fuction.
  //leaving it empty mean it will be called once.
  useEffect(() => {
    loadNft();
  }, [])


//handle sell on click cormfirm sell button  
let price;
function handleSell() {
  console.log("sell");
  setPrice(<input
    placeholder="Price in DANG"
    type="number"
    className="price-input"
    value={price}
    onChange={(e) => price=e.target.value}
  />);
  setButton(<Button handleClick={sellItem} text={"Cormfirm"} />);
  
}

//list item for sale on the openval canister
async function sellItem() {
  setBlur({filter: "blur(4px"})
  setLoaderHidden(false);
  console.log("Sold at set price = " +  price)
  const listingResult = await openval_backend.listItem(props.id, Number(price));
  console.log("Listing: " + listingResult);
  if (listingResult == "success") {
    const openvalId = await openval_backend.getOpenValCanisterID(); 
    const transferResults = await NFTActor.transferOwnership(openvalId);
    console.log("transfer: " + transferResults);
    if (transferResults == "Success") {
      setLoaderHidden(true);
      setButton();
      setPrice();
      setOwner("OpenVal");    
      setSellStatus("Listed");  
    }
  }
}
//handle buying tranfer procedure
async function handleBuy() {
  console.log("Buy triggered");
  setLoaderHidden(false);

  //create actor to access the token_backend using the idlfactory.
  const valPrincipal = Principal.fromText("renrk-eyaaa-aaaaa-aaada-cai");
  const tokenActor = await Actor.createActor(tokenIdlFactory, {
    agent,
    canisterId: valPrincipal,
  });

  //get hold of the sellers Pincipal id
  const sellerId = await openval_backend.getOriginalOwner(props.id);
  const itemPrice = await openval_backend.getListedNFTPrice(props.id);
  //transter val token for the nft
  const result = await tokenActor.transfer(sellerId, itemPrice);
  console.log(result);
  if (result == "success"){
    //Transfer ownership of nft
    const transferResult = await openval_backend.completePurchase(props.id, sellerId, CURRENT_USER_ID);
    console.log("Purchase " + transferResult);
    setLoaderHidden(true);
    setDisplay(false);
  }


}

  return (
    <div style={{display: shouldDisplay ? "inline" : "none"}} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
