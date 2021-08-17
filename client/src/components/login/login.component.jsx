import React, { Component } from "react";
import { setAuthStatus } from "../../redux/auth/authActions";
import { 
  Grid, 
  Row, 
  Column, 
  Modal, 
  InlineNotification,
  TextInput,
  Button,
  Form,
  Loading,
  Link  } from "@carbon/ibm-security";
import axios from "axios";
import {
    
  } from "@carbon/ibm-security";
import { ArrowRight16 } from "@carbon/icons-react";
import { connect } from "react-redux";

class Login extends Component {

  state = {
    userName: '',
    password: '',
    loading: false,
    forgotPasswordHandler: false,
    invalidUserName: false,
    invalidPassword: false,
    userNameFieldWarn: '',
    passwordFieldWarn: '',
    invalidCredentialError: false
  }


  onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
      if (e.target.name === 'password') {
        this.setState({
          invalidPassword: e.target.value ? false : true,
        });
      } else {
        this.setState({
          invalidUserName: e.target.value ? false : true,
        });
      }
    }

  notificationProps = () => ({
    kind: 'error',
    lowContrast: false,
    role: 'alert',
    title: 'ERROR:',
    subtitle: 'Incorrect username or password. Try again.',
    iconDescription: 'Error occured.',
    statusIconDescription: 'Operation failed.',
    hideCloseButton: false,
    onCloseButtonClick: () => {
      this.setState({ invalidCredentialError: false, userName: '', password: '' })
    },
  });


  userNameProps = () => ({
    size: 'xl',
    placeholder: 'admin\\your AD ID',
    light: false,
    disabled: false,
    hideLabel: false,
    invalid: this.state.invalidUserName,
    invalidText: 'Username is required',
    value: this.state.userName,
    warn: false,
    inline: false,
    onChange: this.onChange,
  });

  PasswordInputProps = () => ({
    tooltipPosition: 'bottom',
    size: 'xl',
    value: this.state.password,
    placeholder: 'Enter Your Password',
    invalidText: 'Password is required',
    labelText : '',
    tooltipAlignment: 'center',
    onChange: this.onChange
  });


  submitForm = (event) => {
    event.preventDefault();
   
    this.setState({
        loading: true
    })

  if(this.state.userName && this.state.password) {
    axios.post('/login', {
      'user': this.state.userName.replace('/', '\\'),
      'password': this.state.password
    }).then((response) => {
      if (response.data.success) {
        this.setState({
          loading: false
        })
        this.props.setAuthStatus({
          loggedIn: response.data.success,
          token: response.data.token
        });
        sessionStorage.setItem('secretToken', response.data.token);
      }
    })
      .catch((error) => {
        this.setState({
          invalidCredentialError: true,
          loading: false
        })
      });
    } else {
        this.setState({
            loading: false,
            invalidPassword: !this.state.password,
            invalidUserName: !this.state.userName,
        })
      
    }

  }
      
    
  render() {
    const { invalidCredentialError, loading, invalidUserName, invalidPassword } = this.state;
    return (
        <Grid fullWidth className='inheritedHeight pr-0'>
          <Modal
      open={this.state.forgotPasswordHandler}
      onRequestClose={() => this.setState({ forgotPasswordHandler : false})}
      passiveModal
      modalHeading="Forgot Password?">
         <p style={{ marginBottom: '1rem' }}>
           If you have forgotten your password, you can reset your AD password at <Link target='_blank' href='https://passwordmanager.sec.ibm.com/PMUser'>One Identity Password Manager </Link>.
          </p>
      </Modal>
        <Row condensed={true} className='inheritedHeight' >
          <Column sm={4} md={3} lg={4} style={{ paddingRight: '1.5rem'}}>
           <div>
        <div className="login-form__title">
                Log in to IBM  <br></br>
                Aura Credential Manager
                <div className="login-form__create-account" style={{display : 'flex', justifyContent: 'space-between'}}>
                  </div>
                  <div className='login-alert-container'>
                  {
                    invalidCredentialError ?
                      <InlineNotification data-cy="InlineNotification"
                        {...this.notificationProps()}
                      /> : null}
                  </div>
                </div>
                <Form onSubmit={this.submitForm} method="post">
                    <div className='form-field'>
                    <TextInput className='mb-1'
                      labelText='Username'
                      name="userName"
                      id="userName"
                      data-cy="username"
                      onChange={this.onChange}
                      {...this.userNameProps()}
                    />
                    </div>
                    <div className='form-field'>
                    <label  className="bx--label w-100">
                    <div className='text-icon'>
                      <span>Password</span>
                      <span><Link className="cursor_pointer" onClick={() => this.setState({ forgotPasswordHandler : true})} >Forgot Password?</Link></span>
                     </div>
                    </label>
                    <TextInput.PasswordInput
                      id="password"
                      name="password"
                      invalid={invalidPassword}
                      data-cy="password"
                      onChange={this.onChange}
                      {...this.PasswordInputProps()}
                    />
                    </div>
                    <Button data-cy="submit" className="w-100 icon-btn" type="submit" disabled={loading || invalidUserName || invalidPassword}>
                      <div className='text-icon'>
                        <span>Log in</span>
                        <span><ArrowRight16 /></span>
                      </div>
                    </Button>
                </Form>
                {loading ? <Loading  withOverlay={true} /> : ''}
      </div>
                    
          </Column>
          <Column condensed="true" sm={0} md={5} lg={12} style={{position: 'absolute', right: '0', height: '100%'}} className='bg-square'>
          </Column>
         
        </Row>
      </Grid>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  setAuthStatus : authInfo => dispatch(setAuthStatus(authInfo))
});

export default connect(null, mapDispatchToProps)(Login);

