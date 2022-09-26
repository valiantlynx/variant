import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { Principal } from "@dfinity/principal";
import { AuthClient } from '@dfinity/auth-client';

const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_USER_ID;

const init = async () => {
  const authClient = await AuthClient.create();
  
  //is already logged in within 8 days
  if (authClient.isAuthenticated() || ((await authClient.getIdentity().getPrincipal().isAnonymous()) === false )){
    console.log("logged in");
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
  console.log(authClient.getIdentity());
  const identity = await authClient.getIdentity();
  const userPrincipal = identity.getPrincipal().toString();
  console.log(userPrincipal);
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App currentUSer={CURRENT_USER_ID}/>);
}
init();
