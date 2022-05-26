import React, { useState } from "react";
import "./App.css";
import {
  Button,
  Paper,
  Switch,
  Typography,
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
  Grid,
  Container,
  Box,
  TextField,
  Input,
} from "@material-ui/core";
import { ethers } from "ethers";
function App() {
  const styles = {
    paperContainer: {
      backgroundImage: `url(https://www.pngmart.com/files/13/Pattern-Transparent-Background.png)`,
      
    backgroundSize: "cover",
        height: "100vh"
    }
};
  const [darkMode, setDarkMode] = useState(true);
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  });
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken);
  const onLogin = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    const nonceResponse = await fetch(
      "https://rapid-striped-advantage.glitch.me/api/metamask/login",
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      }
    );
    const { nonce } = await nonceResponse.json();
    const signature = await signer.signMessage(nonce);
    const loginResponse = await fetch(
      "https://rapid-striped-advantage.glitch.me/api/metamask/verify",
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress, signature }),
      }
    );
    const { token } = await loginResponse.json();
    localStorage.setItem("token", token);
    setToken(token);
  };
  const onLogout = () => {
    localStorage.clear();
    setToken(null);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper  style={styles.paperContainer} >
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        <Typography variant="h1">
          {/* {darkMode ? 'Dark Mode' : 'Light Mode'} */}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              hidden={!!token}
              disabled={!(window as any).ethereum}
              onClick={onLogin}
            >
              Login With Metamask
            </Button>
            {token && (
              <>
                <div>Successfully Logged in With Metamask!. JWT: </div>
                <div className="token-wrap">
                  <code style={{ width: "120px" }}>{token}</code>
                </div>
                <div>
                  <Button onClick={onLogout}>Logout</Button>
                </div>
              </>
            )}
          </Grid>
        </Grid>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Typography variant="h3" component="div" gutterBottom>
                Become A Member
              </Typography>
              <Typography variant="h5" gutterBottom component="div">
                Enter Your Valid info to get registered
              </Typography>
              <TextField
                fullWidth
                id="fullWidth"
                variant="filled"
                label="Full Name"
              />
              <TextField
                fullWidth
                id="fullWidth"
                variant="filled"
                label="Email Address"
              />
              <TextField
                fullWidth
                id="fullWidth"
                variant="filled"
                label="Company Name"
              />
              <TextField
                fullWidth
                id="fullWidth"
                variant="filled"
                label="Company Website"
              />
              <label htmlFor="contained-button-file">
                <Input id="contained-button-file" />
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
              <br />
              <Button variant="contained">Submit</Button>
            </Grid>
            <Grid item xs={7}></Grid>
          </Grid>
        </Container>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
