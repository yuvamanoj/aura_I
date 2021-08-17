import React, { Component } from 'react';
import { connect } from "react-redux";
import { Column, Grid, InlineNotification, Modal, Row, TextArea } from "carbon-components-react";
import { Fragment } from "react";
import axios from 'axios';
import { LoadingMessage } from "@carbon/ibm-security/lib/components/Loading";
import CopyButton from "@carbon/ibm-security/lib/components/CopyButton";
import { setCredentials, setFilteredList } from "../../redux/credentials/credentialsActions";

 class Checkout extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            checkoutSucess : false,
            buttonText : { primary: "Check Out Credentials", secondary: "Cancel"},
            checkoutError : false,
            submittingRequest: false,
            errorMSg: "",
            password: "",
            reason: ''
        }
    }

    componentDidUpdate(prevState, nextState) {
      // console.log(prevState);
        if(!prevState.openModal) {
            this.setState({
                checkoutSucess : false,
                buttonText : { primary: "Check Out Credentials", secondary: "Cancel"},
                checkoutError : false,
                password: "",
                reason: ''
            });
}
    }

     errorNotificationProps = () => ({
        kind: 'error',
        lowContrast: false,
        role: 'alert',
        title: 'ERROR:',
        subtitle: this.state.errorMSg,
        iconDescription:
          'describes the close button'
        ,
        statusIconDescription:
          'describes the status icon'
        ,
        hideCloseButton: false,
        onCloseButtonClick: () => {
            this.setState({
               checkoutError : false 
            })
        },
      });
    
       successNotificationProps = () => ({
        kind: 'success',
        lowContrast: false,
        role: 'alert',
        title: 'SUCCESS:',
        subtitle: 'You have successfully checked out credentials.',
        iconDescription:
          'describes the close button'
        ,
        statusIconDescription:
          'describes the status icon'
        ,
        hideCloseButton: false,
        onCloseButtonClick: () => {
          
        },
      });
      
       TextAreaProps = () => ({
        className: '',
        disabled: false,
        light: false,
        hideLabel: false,
        labelText:  'Reason',
        invalid:  false,
        invalidText: 
          'A valid value is required'
        ,
        helperText: '',
        placeholder: 'Enter reason',
        id: 'test2',
        cols:  50,
        rows:  4,
        onChange: (e) => {
          this.setState({reason: e.target.value})
        }
      });
    
      handleDone = () => {
        // setcheckoutSucess(false);
        this.props.setOpenModal(false);
        // this.props.updateList();

      
      }
      handleCheckoutSubmit = () => {
        const { auth } = this.props;
        console.log(this.state.reason);
        this.setState({
            submittingRequest: true
         });
        axios.post('/api/credentials/checkout', {
           id: this.props.openModal.data.id,
           comment: this.state.reason
          },{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.token}`,
            }
          }).then((response) => {          
            this.props.updateList(response.data);
            this.setState({
              password: response.data.Password,
              submittingRequest: false,
              checkoutSucess : true,
              buttonText: { primary: "Done", secondary: ""}
           }); 
            // console.log("resss", response.data);
          })
            .catch((error) => {
              console.log(typeof error);
              this.setState({
                submittingRequest: false,
                checkoutError : true,
                errorMSg: String(error).includes('401') ? "Session has expired. Please Login again." : "Checkout Credential Failed!"
             }); 
              // console.log(error);
            });
      }
      
    render() {
        const { data } = this.props.openModal;
        const { buttonText, checkoutError, checkoutSucess, submittingRequest } = this.state;
        return (
            <Modal
        data-cy="checkout-modal"
        modalHeading="CheckOut Credentials"
        modalLabel=""
        primaryButtonText={buttonText.primary}
        secondaryButtonText={buttonText.secondary}
        open={this.props.openModal.modalState}
        preventCloseOnClickOutside={true}
        className='check_out_modal'
        onRequestSubmit={buttonText.primary === "Done" ? this.handleDone: this.handleCheckoutSubmit}
        onSecondarySubmit={() => this.props.setOpenModal(false)}
        onRequestClose={() => this.props.setOpenModal(false)}>
            {submittingRequest ? <LoadingMessage
            active
            className={null}
            small={false}
            withOverlay={true}
            >
            Submitting request...
            </LoadingMessage> : null}
           
        {checkoutError ? <InlineNotification {...this.errorNotificationProps()} /> : null}
        {checkoutSucess ? <InlineNotification {...this.successNotificationProps()} /> : null}
        <h5 className='list_item_text'>Credential Details</h5>
         
          <Grid style={{ padding: '0'}}>
          <Row >
            <Column condensed="true">
              <h2  className="list_item_label">Customer </h2>
              <p className='list_item_text'>{data?.CustomerName}</p>
            </Column>
            <Column>
              <h2  className="list_item_label">Host name</h2>
              <p className='list_item_text'>{data?.HostName}</p>
            </Column>
          </Row>
          <Row >
            <Column condensed="true">
              <h2  className="list_item_label">Device ID </h2>
              <p className='list_item_text'>{data?.DeviceId}</p>
            </Column>
            <Column condensed="true">
              <h2  className="list_item_label">IP Address </h2>
              <p className='list_item_text'>{data?.HostIP}</p>
            </Column>
          </Row>
          <Row >
            <Column condensed="true">
              <h2  className="list_item_label">Login Name </h2>
              <p className='list_item_text'>
              <span style={{display : 'flex', alignItems:'center'}}>
              <span>{data?.LoginName}</span>
                <span>
                <CopyButton iconDescription="Copy Login ID" onClick={() => {
                  const el = document.createElement('textarea');
                  el.value = data?.LoginName;
                    navigator.clipboard.writeText(data?.LoginName);
                  document.body.appendChild(el);
                  el.select();
                  document.execCommand('copy');
                  document.body.removeChild(el);
                }} />
                </span>
             

                </span>
                </p>
            </Column>
            <Column condensed="true">
            {checkoutSucess ? <Fragment>
            <h2  className="list_item_label">Password </h2>
              <p className='list_item_text'>
              <span style={{display : 'flex', alignItems:'center'}}>
              <span >{this.state.password}</span>
                <span>
                <CopyButton iconDescription="Copy Login ID" onClick={() => {
                  const el = document.createElement('textarea');
                  el.value = this.state.password;
                    navigator.clipboard.writeText(this.state.password);
                  document.body.appendChild(el);
                  el.select();
                  document.execCommand('copy');
                  document.body.removeChild(el);
                }} />
                </span>
                </span>
                </p>
                </Fragment> : null}
            </Column>
            </Row>
          </Grid>
          <div className="divider">
          </div>
          <Fragment>
              { !checkoutSucess ?
                    <Fragment>
                    <h6 style={{margin: '1rem 0'}}>Please provide your reasons for checking out the above credentials.</h6>
                                <TextArea data-cy="checkout-textarea" {...this.TextAreaProps()} />
                    </Fragment> : 
                    <div>
                         <h2  className="list_item_label">Reason </h2>
                         <p style={{fontSize:'0.75rem'}}>
                            {this.state.reason ? this.state.reason : "None"}
                         </p>
                    </div>
              }
              </Fragment>
      </Modal>
 
        )
    }
}

const mapStateToProps = state => ({
  auth: state.auth,
  list: state.list.credentials
});

const mapDispatchToProps = dispatch => ({
  setCredentials : list => dispatch(setCredentials(list)),
  setFilteredList: filteredData => dispatch(setFilteredList(filteredData))
})

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
