import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { createGlobalStyle } from 'styled-components';

import Home from './views/home';
import BlockDetails from './views/block/details'
import TxDetails from './views/tx/details'
import BlockLatest from './views/block/latest';
import TxLatest from './views/tx/latest';
import Header from "./components/header";
import Footer from "./components/footer";
import { OCAlertsProvider } from '@opuscapita/react-alerts';

import './normalize.css';

const GlobalStyles = createGlobalStyle`
  body {
    @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700,900');
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap');
    font-family: 'Lato', sans-serif;
  }
`

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <OCAlertsProvider />
          <GlobalStyles />
          <Header />
          <Route exact path='/' component={Home}/>
          <Route path='/block/:id' component={BlockDetails}/>
          <Route path='/tx/:id' component={TxDetails}/>
          <Route exact path='/latest/block' component={BlockLatest}/>
          <Route exact path='/latest/tx' component={TxLatest}/>
          {/* <Route exact path='/latest' component={latest}></Route>
          <Route exact path='/detail' component={Detail}></Route>
          <Route exact path='/pockettestnet' component={pocket-testnet}></Route>
          <Route exact path='/pocketcore' component={pocket-core}></Route>
          <Route exact path='/addnetwork' component={add-network}></Route> */}
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;