
import "../../App.css";
import { connect } from "react-redux";
import Checkout from '../checkout/checkout.component';
import  {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Grid,
  Row,
  Pagination,
  Link,
  DataTableSkeleton,
  InlineNotification,
  Button
} from 'carbon-components-react';

import ScrollGradient from "@carbon/ibm-security/lib/components/ScrollGradient";
import { Tab, Tabs } from "@carbon/ibm-security/lib/components/Tabs";
import React, { Component } from "react";
import { setCredentials, setFilteredList } from "../../redux/credentials/credentialsActions";
import { setCustomerDropdown } from "../../redux/customers/customerActions";
import * as _ from 'lodash';
import ComboBox from "@carbon/ibm-security/lib/components/ComboBox";
import { Loading } from "carbon-components-react";
import { Suspense } from "react";

const ShowToolTip  = React.lazy(() =>import(/* webpackChunkName: "tooltips" */ './showToolTip'));
const CheckoutList = React.lazy(() =>import(/* webpackChunkName: "checkout" */ '../checkedoutList/checkoutList.component'));

 const dataTableHeaders = [
  {
    key: 'CustomerName',
    header: 'Customer',
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
  },
  {
    key: 'LoginName',
    header: 'Login Name',
  },
  {
    key: 'checkedOut',
    header: 'Status',
  },
  {
    key: 'checkOutUserDisplayName',
    header: '',
  },
];
  
var customerDropdownItems = [];
  
export class Credential extends Component {
  constructor(props) {
    super(props);
    this.list = this.props.CheckoutListlist;
    this.customers = this.props.CheckoutListcustomers;
    this.setCredentials = this.props.CheckoutListsetCredentials;
    this.setCustomerDropdown = this.props.CheckoutListsetCustomerDropdown;
    this.auth = this.props.CheckoutListauth;
    this.state = {
        totalItem: 0,
        customerList: [],
        errorFetchingCredential: { error : false, msg: "Unable to Fetch Credentials."},
        items: [],
        openModal: {modalState: false, data: null},
        credentialLoading: true,
        checkedoutListRefresh: false,
        inputText: "",
        searchInputValue:"",
        searchText:"",
        pageSize: 10
    }           
  }

  componentDidMount() {
    console.log("Fetching Latest List of Credentials");
    fetch("/api/credentials", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth?.token}`,
      }
    }).then(res => res?.json()).then(
        res => {
          if(res.message === 'Unauthorized Request') {
              console.log("req unauthorized");
              this.setState({ 
                errorFetchingCredential: { error : true, msg: "Session Expired! Login Again."},
                credentialLoading: false,
            });
          } else {
            if(Array.isArray(res)) {
              console.log("Total", res.length +" Credential Retrieving.");
              let credList = res.map(i => {
                i.id = String(i.id);
                i.key = Number(i.id);
                return i;
              })
              this.props.setCredentials(credList);
              customerDropdownItems = [];
              const customerSet = new Set();
              res.forEach(i => {
                if(!customerSet.has(i.CustomerId)) {
                  let customer = {
                    id : i.CustomerId,
                    name : i.CustomerName,
                    text : i.CustomerName ? i.CustomerName : " ", 
                  }
                  customerDropdownItems.push(customer);
                }
                customerSet.add(i.CustomerId);
                
              });
              this.props.setCustomerDropdown(customerDropdownItems);
              this.setState({
                  customerList : customerDropdownItems,
                  credentialLoading: false,
                  totalItem : Array.isArray(res) ? res.length : 0
              })
            } else {
              console.log("Credential retrieval failed", res);
              this.setState({ 
                  errorFetchingCredential: { error : true, msg: "Unable to fetch credentials."},
                  credentialLoading: false,
              });
              this.props.setCredentials([]);
            }
          }
        }).catch(err => {
          console.log("Credential retrieval error :", err);
          this.setState({ 
            errorFetchingCredential: { error : true, msg: "Unable to fetch credentials."},
            credentialLoading: false,
        });
        this.props.setCredentials([]);
        })
  }
/**
 * Returns properties for pagination carbon component
 * @returns {Object} attributes and event handlers
 */
  paginationProps = () => ({
    disabled:  false,
    page: 1,
    totalItems: this.state.totalItem,
    pagesUnknown: false,
    backwardText: 'Previous page',
    forwardText: 'Next page',
    pageSize:  this.state.pageSize,
    pageSizes:  [5, 10, 15, 20],
    itemsPerPageText: 'Items per page',
    onChange: (e) => {
      console.log("Pagination", e);
      this.props.setFilteredList(_.chunk(this.props.list.credentials, e.pageSize)[--e.page])
    },
  });
  
/**
 * Returns properties for Notification carbon component.
 * 
 * 
 * @returns {Object} attributes and event handlers.
 */
  errorNotificationProps = () => ({
    kind: 'error',
    lowContrast: false,
    role: 'alert',
    title: 'ERROR:',
    subtitle: this.state.errorFetchingCredential.msg,
    iconDescription: 'Close the notification.',
    statusIconDescription: 'Error performing requested operation. ',
    hideCloseButton: false,
    onCloseButtonClick: () => {
      this.setState({ errorFetchingCredential : { error : false, msg: "Unable to fetch credentials."}})
    },
  });
/**
 * Filters the credentials List with respect to input from search field.
 * 
 * @param {Event} event containing the value in the search input field.
 * 
 */

  onInputSearchFilter = (data) => {
    this.setState({searchText : data.target.value.toLocaleLowerCase(), searchInputValue: data.target.value});
    // let filteredData = this.props.list.credentials.filter(item => {
    //   let status = false;
    //     for (const key in item) {
    //       if(key === 'HostIP' || key === 'DeviceId') {
    //         const element = item[key];
    //         if (String(element).toLocaleLowerCase().includes(data.target.value.toLocaleLowerCase())) {
    //                status = true; 
    //                break;     
    //         }
    //       }
          
    //     }
    //     return status
    // })
    // this.props.setFilteredList(_.chunk(filteredData, this.state.pageSize)[0])

    if(!data.target.value) {
        this.props.setFilteredList(_.chunk(this.props.list.credentials, this.state.pageSize)[0])
    }
  }

  /**
 * Renders the Dropdown items as component.
 * @param {Object} object containing id and name propperties for customers.
 * 
 * @returns {HTMLElement} the Dropdown item.
 */
  itemToElement = item => {
    return (<div style={{display : 'flex', justifyContent: 'space-between'}}>
       <span style={{paddingRight: '0.3rem'}}>
         {item.id}</span> <span>
           {item.name}</span></div>);
  };

/**
 * Updates the List of credention post checkout activity.
 * @param {Object} object containing credentials data after checkout.
 * 
 * 
 */
  updateList = (updatedData) => {
    let findIndex = _.findIndex(this.props.list?.credentials, (o) => o.id === String(updatedData.id));
    let list_new = this.props.list?.credentials;
    updatedData.id = String(updatedData.id);
    list_new[findIndex] = updatedData;
    this.props.setCredentials(list_new);
    this.props.setFilteredList(list_new);
    this.onInputSearchFilter({target:{value: " "}})
    this.onInputSearchFilter({target:{value: ""}})
  }

/**
 * Dropdown value change event handler, filters the credentials list based on selection
 * 
 * @param {string} dropdown item, id of the customer.
 */
  onDropdownChange = (dropDownValue) => {
    console.log("Filter data based on customer Id : ", dropDownValue);
      if(dropDownValue){
        let filteredData = this.props.list.credentials.filter(item => String(item.CustomerId) === String(dropDownValue) )
        this.props.setFilteredList(_.chunk(filteredData, this.state.pageSize)[0])
      } else {
        this.setState({
          customerList: this.props.customers.customers
        });
        this.props.setFilteredList(_.chunk(this.props.list.credentials, this.state.pageSize)[0])
      }
  }

/**
 * To get id of user who checked out the credential.
 * @param {String} id of the credentials.
 * 
 * @returns {string} userId of user who checked out the credential of given id.
 */
  getCheckedOutUserId(id) {
    let filteredData = this.props.list.credentials.find(item => String(item.id) === String(id) )
      if(filteredData) {
        return filteredData.checkOutUserId;
      } 
    return null;
  }

/**
 * Toggle Modal State with data.
 * @param {object} object The containing elements of the Modal state.
 * 
 */
  setOpenModal = (data) => {
    this.setState({
        openModal : data
    })
  }

/**
 * Carbon Tab Change event handler
 * @param {Event} event The containing elements of the Tab change event.
 *
 */
  tabChanged = (e) => {
    if(e) {
      console.log("User in Checked Out Tab.");
      this.setState({
        checkedoutListRefresh: true
      })
      this.onInputSearchFilter({target:{value: " "}})
      this.onInputSearchFilter({target:{value: ""}})
    } else {
      console.log("User in All Credential Tab.");
      this.onInputSearchFilter({target:{value: " "}})
      this.onInputSearchFilter({target:{value: ""}});
      this.setState({
        checkedoutListRefresh: false
      })
    }
  }

/**
 * Carbon Tab Change event handler
 * @param {Event} event The containing elements of the Tab change event.
 *
 */
  searchCredentials = () => {
    let filteredData = this.props.list.credentials.filter(item => {
      let status = false;
        for (const key in item) {
          if(key === 'HostIP' || key === 'DeviceId') {
            const element = item[key];
            if (String(element).toLocaleLowerCase().includes(this.state.searchText)) {
                   status = true; 
                   break;     
            }
          }
          
        }
        return status
    })

    if(filteredData.length === 0) {
      this.setState({credentialLoading : true});
      fetch(`/api/credentials/search?searchText=${this.state.searchText}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.auth?.token}`,
        }
      }).then(res => res.json()).then(res => {
        this.setState({credentialLoading : false})
        if(res.length > 0) {
          console.log(res);
          let credList = res.map(i => {
            i.id = String(i.id);
            i.key = Number(i.id);
            return i;
          })
          let newCredentials = _.differenceBy(credList, this.props.list.credentials, 'id');
          console.log(newCredentials)
          let updatedCredentialList = _.concat(newCredentials, this.props.list.credentials)
          this.setState({totalItem: updatedCredentialList.length});
          this.props.setCredentials(updatedCredentialList);
          this.props.setFilteredList(_.chunk(filteredData.concat(credList), this.state.pageSize)[0])
        } else {
          this.setState({searchInputValue : this.state.searchText})
          this.props.setFilteredList(_.chunk(filteredData, this.state.pageSize)[0])
        }
      
       
      }).catch(err => {
        this.setState({credentialLoading : false})
         this.props.setFilteredList(_.chunk(filteredData, this.state.pageSize)[0])
        
        console.log(err);
      })
    } else {
      this.props.setFilteredList(_.chunk(filteredData, this.state.pageSize)[0])
    }
   
    
  }

/**
 * Checks the latest checked out state against updated credentials list.
 * @param {id} children The containing elements of the popover.
 * @param {boolean} state Whether the credential is checked out or not.
 * @returns {boolean} state Whether the credential's latest state is checked out or not. 
 */
  getLatestStatus(id, status) {
    let index = _.findIndex(this.props.list?.credentials, (o) => o.id === String(id));
      if(index >= 0 && status !== this.props.list?.credentials[index].checkedOut) {
        return this.props.list?.credentials[index].checkedOut
      } else {
        return status;
      }
  }

/**
 * Finds number of credentials checked out by current user(logged in use).
 *
 * @returns {number} number of credentials checked out.
 */
  getEffectiveListLength() {
    const effectiveList = this.props.list.credentials.filter(item => Number(item.checkOutUserId) === this.props.user.userId);
    return effectiveList.length;
  }

  /**
 * Renders the credentials component.
 * 
 * 
 * @returns {HTMLElement} The rendered credentials component..
 */
  render() {
    return (
      <div className='main-content'>
        <div style={{padding: '0 2.175rem', display: 'flex', justifyContent: "flex-end",position: 'absolute', right: '0'}}>
        {this.state.errorFetchingCredential.error ? <InlineNotification data-cy="Credentials-InlineNotification" {...this.errorNotificationProps()} /> : null}
        </div>
        <Grid fullWidth>
          <Checkout updateList={this.updateList} openModal={this.state.openModal} setOpenModal={this.setOpenModal}></Checkout>
          <Row>
            <div style={{width: '100%'}} >
              <div  style={{backgroundColor: '#161616'}}>
                <div style={{padding: '0 1rem'}}>
                  <h3>
                    Credentials Manager
                  </h3>
                </div>
                <div>
                  <Tabs onSelectionChange={this.tabChanged} style={{padding: '0 1rem'}}>
                    <Tab id="tab-1" label="All Credentials">
                      <div>
                        <ScrollGradient color="black">
                          {this.state.credentialLoading ? 
                          <DataTableSkeleton ></DataTableSkeleton> :  
                          <DataTable rows={this.props.list?.filteredList || []} headers={dataTableHeaders} isSortable >
                            {({
                              rows,
                              headers,
                              getHeaderProps,
                              getRowProps,
                              getTableProps,
                              onInputChange,
                              getBatchActionProps,
                              getToolbarProps
                              }) => (
                            <TableContainer title="All Credentials">
                              <TableToolbar  {...getToolbarProps()} aria-label="data table toolbar">
                                <TableToolbarContent>
                                  <div style={{ width: 600 }}>
                                    <ComboBox
                                      id="allCustomers"
                                      placeholder="All Customers"
                                      label="All Customers"
                                      items={this.state.customerList}
                                      itemToString={(item) => (item ? item.text ? item.text: null : '')}
                                      itemToElement={this.itemToElement}
                                      onChange={(obj) => this.onDropdownChange(obj?.selectedItem?.id)}
                                      shouldFilterItem={() => true}
                                      onInputChange={text => {
                                        if(!text || text === this.state.inputText) return
                                        const filteredCustomersOnSelection = this.props.customers.customers.filter(c => String(c.name).toLowerCase().includes(text.toLowerCase()))
                                        this.setState({ inputText: text,
                                          customerList: filteredCustomersOnSelection.length > 0 ? filteredCustomersOnSelection : this.props.customers.customers
                                        })}
                                      }/>
                                  </div>
                                  <TableToolbarSearch
                                    data-cy="tableSearch"
                                    persistent={true}
                                    value={this.state.searchInputValue}
                                    placeholder="Search for Device ID or IP Address"
                                    onChange={this.onInputSearchFilter}/>
                                    <Button
                                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                    onClick={this.searchCredentials}
                                    onKeyUp={(e) => {console.log(e)}}
                                    type="submit"
                                    size="small"
                                    disabled={this.state.searchText.length < 3}
                                    kind="primary">
                                    Search
                                  </Button>
                                </TableToolbarContent>
                              </TableToolbar>
                              <Table {...getTableProps()}>
                                <TableHead>
                                  <TableRow>
                                    {headers.map((header) => (
                                      <TableHeader key={header.key} {...getHeaderProps({ header })}>
                                        {header.header}
                                      </TableHeader>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {rows.length > 0 ? rows.map((row, index) => (
                                    <TableRow data-cy={`row${index}`}  key={row.id} {...getRowProps({ row })}>
                                      {row.cells.map((cell) => {
                                        if(cell.info.header === "checkedOut") {
                                          return <TableCell key={cell?.id}>
                                                    <div style={{display : 'flex', justifyContent: 'space-between'}}>
                                                      <span>{this.getLatestStatus(row.id, cell?.value) ? <ShowToolTip status={row.cells[6].value} id={this.getCheckedOutUserId(row.id)} text={row.cells[6].value} /> : "Available"}</span>
                                                    </div>
                                                  </TableCell>
                                        } else if(cell.info.header === "checkOutUserDisplayName") {
                                            return <TableCell key={cell?.id}>
                                                      <Link data-cy={`checkout-btn-${index}`} disabled={this.getLatestStatus(row.id ,row.cells[5].value)} style={{fontSize:"0.75rem"}} onClick={(e) => {
                                                        let data = _.filter(this.props.list?.filteredList, ['id', row.id]);
                                                          if(!this.getLatestStatus(row.id ,row.cells[5].value)) {
                                                            this.setState({ openModal: { modalState: true, data: data[0]}})
                                                          }
                                                        }}>Check Out
                                                      </Link>
                                                    </TableCell>
                                        } else if(cell.info.header === "CustomerName") {
                                            return <TableCell key={cell?.id}>
                                                      <p style={{marginBottom: '0', color: 'white'}} className='list_item_text'>{cell?.value ? cell?.value : '-'}</p>
                                                      <h2 style={{marginTop: '0'}} className="list_item_label">{
                                                        this.props.customers.customers.find(i => i.name === cell?.value)?.id}</h2>
                                                    </TableCell>
                                        } else {
                                          return <TableCell key={cell?.id}>{cell?.value}</TableCell>
                                        }
                                      })}
                                    </TableRow>
                                  )) : <TableRow><TableCell colspan="7"><p style={{textAlign:'center'}}>No Data Found</p></TableCell></TableRow>}
                                </TableBody>
                              </Table>
                              <Pagination {...this.paginationProps()}/> 
                            </TableContainer>
                            )}
                          </DataTable>}
                        </ScrollGradient>
                      </div>
                    </Tab>
                    <Tab id="tab-2" label={`Checked Out (${this.getEffectiveListLength()})`}>
                      {this.state.credentialLoading ? 
                        <DataTableSkeleton ></DataTableSkeleton> : 
                          <Suspense fallback={<Loading
                            description="Initializing Application"
                            small={false}
                            withOverlay={true}/>}>
                            <CheckoutList refresh={this.state.checkedoutListRefresh}></CheckoutList>
                          </Suspense>  }
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </Row>
        </Grid>
    </div>
      )
  }
 }
 
  const mapStateToProps = state => ({
    list: state.list,
    auth: state.auth,
    user: state.user.profile,
    customers: state.customers
  }); 

  const mapDispatchToProps = dispatch => ({
    setCredentials : list => dispatch(setCredentials(list)),
    setCustomerDropdown : customers => dispatch(setCustomerDropdown(customers)),
    setFilteredList: filteredData => dispatch(setFilteredList(filteredData))
  })
  export default connect(mapStateToProps, mapDispatchToProps)(Credential);
