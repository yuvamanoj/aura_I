import React, { Component, Fragment } from "react";
import IAMHeader from "../customHeader/header";
import Credentials from "../credentials/credential.component";

export class Home extends Component {
  
  render() {
    return (
      <Fragment>
         <IAMHeader/>
         <Credentials/>
      </Fragment>
    
    );
  }
}

export default Home;
