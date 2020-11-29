import React,{Fragment} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar"
import MailState from './context/MailContext/MailState'
import LeadState from './context/lead/LeadState'
import Dunder from "./components/Dunder"
import "./App.css";
import SorryDave from './components/SorryDave'





const App = () => {
  return (
    <MailState>
      <LeadState>


        <Router>
        <Fragment>
        <Navbar/>
        </Fragment>
          <Fragment>
              <Switch>
                 <Route exact path='/' component={Dunder} />
                 <Route exact path='/sorrydave' component={SorryDave} />
             </Switch>
          </Fragment>
        </Router>
    
      </LeadState>
    </MailState>
  )
}

export default App



