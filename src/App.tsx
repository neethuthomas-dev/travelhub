

import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";

function App() {
  const {
  loginWithRedirect,
  logout,
  isAuthenticated,
  isLoading,
  user,
  getIdTokenClaims,
  getAccessTokenSilently,
} = useAuth0();

  if (isLoading) {
    return <h2>Loading TravelHub...</h2>;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>✈ TravelHub</h2>

        <div>
          <a href="#">Home</a>
          <a href="#flights">Flights</a>
          <a href="#hotels">Hotels</a>

          {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()}>
              Login
            </button>
          ) : (
            <button
              onClick={() =>
                logout({
                  logoutParams: {
                    returnTo: window.location.origin,
                  },
                })
              }
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>Explore the World with TravelHub</h1>
        <p>Find flights, hotels and amazing destinations.</p>

        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>
            Login to TravelHub
          </button>
        ) : (
          <div>
            <h2>Welcome, {user?.name}!</h2>
            <p>{user?.email}</p>
            <button
  onClick={async () => {
    const claims = await getIdTokenClaims();
    console.log("ID Token Claims:", claims);
  }}
>
  View ID Token Claims
</button>
<button
  onClick={async () => {
    try {
      // 1. Get Access Token
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://travelhub-api",
          scope: "openid profile email read:flights read:hotels",
        },
      });

      console.log("Access Token received:", !!token);
      if (!token) {
  throw new Error("Access token is undefined");
}

      // 2. Decode token payload
      const base64Payload = token.split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const payload = JSON.parse(atob(base64Payload));

      // 3. Display token claims
      console.log("Audience:", payload.aud);
      console.log("Scope:", payload.scope);
      console.log("Permissions:", payload.permissions);

    } catch (error) {
      console.error("Token error:", error);
    }
  }}
>
  Get TravelHub API Token
</button>
            {user?.picture && (
              <img
                src={user.picture}
                alt="User profile"
                width="70"
                style={{ borderRadius: "50%" }}
              />
            )}
          </div>
        )}
      </section>

      <section className="destinations" id="flights">
        <h2>Popular Destinations</h2>

        <div className="destination-list">
          <div className="destination">
            <h3>New York</h3>
            <p>Explore the city that never sleeps.</p>
          </div>

          <div className="destination">
            <h3>Paris</h3>
            <p>Experience the city of love.</p>
          </div>

          <div className="destination">
            <h3>Maldives</h3>
            <p>Enjoy beautiful beaches.</p>
          </div>
        </div>
      </section>

      <footer>
        © 2026 TravelHub. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
