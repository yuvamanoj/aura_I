import { Column, Grid, InlineNotification, Modal, Row, TextArea } from "@carbon/ibm-security";
import { Fragment } from "react";
import axios from 'axios';
import * as _ from 'lodash';
import React, { Component } from 'react'
import { LoadingMessage } from "@carbon/ibm-security/lib/components/Loading";
import { connect } from "react-redux";
import { DataTable } from "carbon-components-react";
import { TableBody, TableCell, TableContainer, TableExpandedRow, TableExpandHeader, TableExpandRow, TableHead, TableHeader } from "@carbon/ibm-security/lib/components/DataTable/DataTable";
import Table from "@carbon/ibm-security/lib/components/DataTable/Table";
import { TableRow } from "@carbon/ibm-security/lib/components/DataTable/DataTable";
import { setCredentials } from "../../redux/credentials/credentialsActions";

const dataTableHeaders = [
    {
      key: 'CustomerName',
      header: 'Customer',
    },
    {
      key: 'LoginName',
      header: 'Login Name',
    },
    {
      key: 'DeviceId',
      header: 'Device ID',
    },
    {
      key: 'HostName',
      header: 'Host Name',
    },
    {
      key: 'HostIP',
      header: 'IP',
    }
  ];
 class Checkin extends Component {
    
    constructor(props) {
        super(props);
        this.listAfterCheckIn = [];
        this.state = {
            checkinSucess : false,
            buttonText : { primary: "Check In Credentials", secondary: "Cancel"},
            checkinError : false,
            submittingRequest: false,
            errorMsg: "",
            successMsg: "",
            checkInCounter: 0,
            isMultiple: false,
            commentsObj: {},
            performingAllCheckin : false
        }
    }

    componentDidUpdate(prevState) {
        console.log("Modal State ", prevState.openModal?.modalState ? "Open" : "Closed");
        if(!prevState.openModal) {
            this.resetState();
            return;
         }
    }

    resetState = () => {
        this.setState({
            checkinSucess : false,
            checkInCounter: 0,
            buttonText : { primary: "Check In Credentials", secondary: "Cancel"},
            checkinError : false,
            commentsObj: {}
        });
    }


    errorNotificationProps = () => ({
        kind: 'error',
        lowContrast: false,
        role: 'alert',
        title: 'ERROR:',
        subtitle: this.state.errorMsg,
        iconDescription: 'Close the alert.',
        statusIconDescription: 'Operation Failed.',
        hideCloseButton: false,
        onCloseButtonClick: () => {
            this.setState({
               checkinError : false 
            })
        },
      });
    
    successNotificationProps = () => ({
      kind: 'success',
      lowContrast: false,
      role: 'alert',
      title: 'SUCCESS:',
      subtitle: this.state.successMsg, 
      iconDescription: 'Close the alert.',
      statusIconDescription: 'Operation was successful.',
      hideCloseButton: false,
      onCloseButtonClick: () => {
        
      },
    });
      
    TextAreaProps = () => ({
    disabled: false,
    light: false,
    hideLabel: false,
    invalid:  false,
    invalidText: 'A valid value is required',
    helperText: '',
    placeholder: 'Enter your comment',
    cols:  50,
    rows:  4,
    onChange: (e) => {
      let obj = this.state.commentsObj;
      obj[e.target.id] = e.target.value;
      this.setState({
        commentsObj :obj
      });
    }
  });
    
    handleDone = () => {
      this.resetState();
      this.props.setCredentials(this.listAfterCheckIn);
      this.props.updateList();
      
      this.props.setOpenModal({modalState: false, data: null});
    }

    checkInCredential(element, auth) {
      return new Promise((resolve, reject) => {
        const comment = this.state.commentsObj[`textArea_${element.id}`];
        axios.post('api/credentials/checkin', {
          id: element.id,
          comment: comment ? comment : this.state.commentsObj[`globalTextArea`]
          },{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.token}`,
            }
          }).then(res => {
            if(res.status === 200 && res.statusText === "OK") {

              let index = _.findIndex(this.props.list, function(o) { 
                return o.id === String(element.id); });
              let newElement = this.props.list[index];
              newElement.checkedOut = false;
              newElement.Password = null;
              newElement.checkOutUserId = 0;
              newElement.checkOutUserDisplayName = null;
              let list_new = this.props.list;
              list_new[index] = newElement;
              const counter = this.state.checkInCounter + 1;
              this.setState({
                checkInCounter: counter
              });

              if (!this.state.performingAllCheckin) {
                this.props.setCredentials(list_new);
              }
              this.listAfterCheckIn = list_new;
              
            }
          resolve(res);
          }).catch((error) => {
          resolve(error);
        })
      })
      }

      getEffectiveListLength() {
        const effectiveList = this.props.list.filter(item => Number(item.checkOutUserId) === this.props.user.userId);
        return effectiveList.length;
      }

      handleCheckoutSubmit = () => {
        this.listAfterCheckIn = [];
        const { auth } = this.props;
        let checkInPromises = []; 
        const listToCheckIn = Array.isArray(this.props.openModal.data) ? this.props.openModal.data : [ this.props.openModal.data ]
        this.setState({
          submittingRequest: true,
          performingAllCheckin: listToCheckIn?.length === this.getEffectiveListLength()
       });

        listToCheckIn.forEach(element => {
          checkInPromises.push(this.checkInCredential(element, auth))
        });

        
        Promise.all(checkInPromises).then(res => {
          if(this.state.checkInCounter === 0 && listToCheckIn.length >= 1 && res[0] instanceof Error) {
            this.setState({
                submittingRequest: false,
                checkinError : true,
                errorMsg: String(res[0]).includes('401') ? "Session has expired. Please Login again." : String(res[0]).includes('400') ? "Credential is already checked in." : "Checkin Credential Failed!"
             });


          } else if(this.state.checkInCounter > 0 && this.state.checkInCounter !== listToCheckIn.length) {
            this.setState({
              submittingRequest: false,
              checkinSucess : true,
              successMsg: `${this.state.checkInCounter} credentials checked in successfully and ${listToCheckIn.length - this.state.checkInCounter} Failed.`,
              buttonText: { primary: "Done", secondary: ""}
           }); 
          } else if (this.state.checkInCounter === listToCheckIn.length) {
            this.setState({
              submittingRequest: false,
              checkinSucess : true,
              successMsg: `Credentials checked in successfully.`,
              buttonText: { primary: "Done", secondary: ""}
           }); 
          }
         
        }).catch(error => {
          console.log("error", error);
        })

      }
      
    render() {
        const { data } = this.props.openModal;
        const isMultiple = Array.isArray(data);
        const { buttonText, checkinError, checkinSucess, submittingRequest } = this.state;
        return (
            <Modal
        modalHeading="Check In Credentials"
        modalLabel=""
        primaryButtonText={buttonText.primary}
        secondaryButtonText={buttonText.secondary}
        open={this.props.openModal.modalState}
        preventCloseOnClickOutside={true}
        className='check_out_modal'
        onRequestSubmit={buttonText.primary === "Done" ? this.handleDone: this.handleCheckoutSubmit}
        onSecondarySubmit={() => {
            this.resetState();
            this.props.setOpenModal({modalState: false, data: null})
        }}
        onRequestClose={() => {
            this.resetState();
            this.props.setOpenModal({modalState: false, data: null})}
            }>
            {submittingRequest ? <LoadingMessage
            active
            className={null}
            small={false}
            withOverlay={true}
            >
            Submitting request...
            </LoadingMessage> : null}
           
        {checkinError ? <InlineNotification {...this.errorNotificationProps()} /> : null}
        {checkinSucess ? <InlineNotification {...this.successNotificationProps()} /> : null}
        <h5 className='list_item_text'>Credential Details</h5>
          {isMultiple ? <Fragment>

            <DataTable rows={data} headers={dataTableHeaders}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getTableProps,
      onInputChange,
      getToolbarProps,
      getTableContainerProps,
    }) => (
      <TableContainer
       
        {...getTableContainerProps()}>
        <Table {...getTableProps()} size="compact">
          <TableHead>
            <TableRow>
              <TableExpandHeader />
              {headers.map((header, i) => (
                <TableHeader key={i} {...getHeaderProps({ header })}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableExpandRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableExpandRow>
                <TableExpandedRow
                  colSpan={headers.length + 1}
                  className="demo-expanded-td">
                 <Fragment>
                   <div style={{margin: '1rem 0'}}>
                   <TextArea id={`textArea_${row.id}`} labelText='Comments (Optional)' {...this.TextAreaProps()} />
                   </div>
                 
                 </Fragment>
                </TableExpandedRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </DataTable> </Fragment> : <Fragment>
      <Grid style={{ padding: '0'}}>
      <Row >
      <Column condensed="true">
              <h2  className="list_item_label">Customer </h2>
              <p className='list_item_text'>{data?.cells[0].value}</p>
            </Column>
           
            <Column>
              <h2  className="list_item_label">Host name</h2>
              <p className='list_item_text'>{data?.cells[2].value}</p>
            </Column>
          </Row>
          <Row>
            <Column condensed="true">
              <h2  className="list_item_label">Device ID </h2>
              <p className='list_item_text'>{data?.cells[1].value}</p>
            </Column>
            <Column condensed="true">
              <h2  className="list_item_label">IP Address </h2>
              <p className='list_item_text'>{data?.cells[3].value}</p>
            </Column>
          </Row>
          <Row>
          <Column condensed="true">
              <h2  className="list_item_label">Login ID </h2>
              <p className='list_item_text'>{data?.cells[4].value}</p>
            </Column>
            <Column></Column>
          </Row>
          <div className="divider">
          </div>
      </Grid>
     
        </Fragment>}
              <Fragment>
              { !checkinSucess ?
                    <Fragment>
                    <h6 style={{margin:'1rem 0'}}>Please provide your comment for checking in the above credentials.</h6>
                                <TextArea id="globalTextArea" labelText={isMultiple ? 'Comments for all credentials (Optional)' : 'Comments (Optional)'} {...this.TextAreaProps()} />
                    </Fragment> : 
                    <div>
                         <h2  className="list_item_label">Reason </h2>
                         <p style={{fontSize:'0.75rem'}}>
                            { this.state.commentsObj[`globalTextArea`] ? this.state.commentsObj[`globalTextArea`] : "None"}
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
  user: state.user.profile,
  list: state.list.credentials
});

const mapDispatchToProps = dispatch => ({
  setCredentials : list => dispatch(setCredentials(list))
})


export default connect(mapStateToProps, mapDispatchToProps)(Checkin);
