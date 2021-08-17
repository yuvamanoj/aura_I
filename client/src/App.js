import React, { Suspense } from "react";
import "./App.css";
import { connect } from "react-redux";
import Login from "./components/login/login.component";

import { setAuthStatus } from "./redux/auth/authActions";
import axios from "axios";
import { Loading } from "@carbon/ibm-security";

const Home = React.lazy(() => import(/* webpackChunkName: "home" */ "./components/home/home.component"));

export class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading :true
    }
  }

/**
 * Restores Session if found else no change continue login 
 * 
 */
  validateAuth(auth) {
    axios.get('/auth', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`,
      }
    }).then((response) => {
      console.log("Restoring Session");
      if (response.data.success) {
        this.props.setAuthStatus({
          loggedIn: response.data.success,
          token: auth
        });
        this.setState({
          loading: false
        })
      }
    })
      .catch((error) => {
        this.setState({
          loading: false
        })
      });
  }

  componentDidMount(props) {
    const token = sessionStorage.getItem('secretToken');
    if(token && !this.props.loggedIn){
      console.log("Checking Session Status");
       this.validateAuth(token);
    } else {
      this.setState({
        loading: false
      })
    }
  }

  render() {
    const { loading } = this.state;
    const { loggedIn } = this.props;
   
    return (
      <div id="container" className="document-container">
        {loading ? <Loading
                    active
                    description="Initializing Application"
                    small={false}
                    withOverlay={true}
                  /> : loggedIn ? <Suspense fallback={<Loading
                    description="Initializing Application"
                    small={false}
                    withOverlay={true}
                  />}>
                <Home></Home>
                </Suspense>  :  <Login></Login>}
         
      </div>

     
    );
  }
}


const mapDispatchToProps = dispatch => ({
  setAuthStatus : authInfo => dispatch(setAuthStatus(authInfo))
});

const mapStateToProps = state => {
  return ({
    loggedIn: state.auth.loggedIn
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
