import ReactDOM from 'react-dom/client'
import React from 'react'
import App from "./components/App";
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from "@dfinity/agent";
import Button from './components/Button';

const init = async () => {

  const authClient = await AuthClient.create();

  // //must remove before deploying live
  // const localHost = "http://localhost:8081/";
  // const agent = new HttpAgent({host: localHost});
  // agent.fetchRootKey();




  //if user is already logged in within 8 days
  if (authClient.isAuthenticated() && ((await authClient.getIdentity().getPrincipal().isAnonymous()) === false)) {
    console.log("logged in");
    handleAuthenticated(authClient);

  } else {
    // handleAuthenticated(authClient);
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(

      <div className="blue window container" id="not-logged">
        <center>
          <h1>Internet Identity Client</h1>
          <h2 style={{ color: '#ff9966' }} >You are not authenticated</h2>
          <p>To log in, click this button!</p>
          <Button handleClick={login} text={"login"} />
        </center>

      </div>
    );
  }

  //logging in
  async function login() {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        handleAuthenticated(authClient);
      },

    });

  }

}

async function handleAuthenticated(authClient) {
  const identity = await authClient.getIdentity();
  const userPrincipal = identity.getPrincipal().toString();
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App loggedInPrincipal={userPrincipal} />);
}

init();


