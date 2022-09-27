import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { Principal } from "@dfinity/principal";
import { AuthClient } from '@dfinity/auth-client';

//works but i dont know how to get what is returned back. can log what is inside a function but not outside.
// async function getUser(){
//   const authClient = await AuthClient.create();
//   //console.log(authClient.getIdentity());
//   const userPrincipal = authClient.getIdentity().getPrincipal().toString();
//   //console.log(userPrincipal);
//   return(userPrincipal);
// }
// console.log(getUser());

const CURRENT_USER_ID = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
export default CURRENT_USER_ID;

const init = async () => {
  const authClient = await AuthClient.create();
  
  //is already logged in within 8 days
  if (authClient.isAuthenticated() && ((await authClient.getIdentity().getPrincipal().isAnonymous()) === false )){
    //console.log("logged in");
    handleAuthenticated(authClient);
    
  } else {
    //log in
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess : () => {
        handleAuthenticated(authClient);
      }
    });
  }

};

async function handleAuthenticated(authClient){
  //console.log(authClient.getIdentity());
  const identity = await authClient.getIdentity();
  const userPrincipal = identity.getPrincipal().toString();
  //console.log(userPrincipal);
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App currentUSer={CURRENT_USER_ID}/>);
}
init();
