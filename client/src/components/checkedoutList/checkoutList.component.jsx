import React, { Component } from 'react';
import ViewToggle from "../shared/view-toggle/view-toggle";
import { Download16 } from "@carbon/icons-react";
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
    TableSelectAll,
    TableSelectRow,
    TableBatchAction,
    TableBatchActions,
    Pagination,
    Link,
    Grid,
    Row,
    Column,
  } from 'carbon-components-react';
  import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Fragment } from 'react';
import Checkin from '../checkin/checkin.component';
import CopyButton from '@carbon/ibm-security/lib/components/CopyButton';
import { setCredentials } from '../../redux/credentials/credentialsActions';

class CheckoutList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      openCheckinModal : {modalState: false, data: null},
      checkedOutitems : _.chunk(this.props.checkedOutList, 10)[0],
      customers: this.getCustomers(this.props.list),
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.refresh !== this.props.refresh) {
        this.onInputSearchFilter({target:{value: " "}})
        this.onInputSearchFilter({target:{value: ""}})
        return
    } 
  }


  getCustomers(res) {
    let customerDropdownItems = [];
    const customerSet = new Set();
    res.forEach(i => {
      if(!customerSet.has(i.customerId)) {
        let customer = {
          id : i.customerId,
          name : i.CustomerName,
          text : (<div style={{display : 'flex', justifyContent: 'space-between'}}> <span style={{paddingRight: '0.3rem'}}>{i.customerId}</span> <span>{i.CustomerName}</span></div>), 
        }
        customerDropdownItems.push(customer);
      }
      customerSet.add(i.customerId);
      
    });
    return customerDropdownItems
  }

  paginationProps = () => ({
    disabled:  false,
    page: 1,
    totalItems:  this.props.list?.length || 0,
    pagesUnknown: false,
    backwardText: 'Previous page',
    forwardText: 'Next page',
    pageSize:  10,
    pageSizes:  [5, 10, 15, 20],
    itemsPerPageText: 'Items per page',
    onChange: (e) => {
      console.log("Pagination", e);
      this.setState({
        checkedOutitems : _.chunk(this.props.list || [], e.pageSize)[--e.page]
      })
     
     },
  });
  
   checkedoutHeaders = [
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
      key: 'Password',
      header: 'Password',
    },
    {
      key: 'attached_groups',
      header: '',
    },
  ];
  
  
   toolTipsprops = () => ({
    triggerClassName: '',
    direction: 'top',
    align: 'center',
    tooltipText: 'Brief description of the dotted, underlined word above.',
  });

  
  
  
   batchActionClick = (selectedRows) => () => {
    const selectedItems = _.intersectionBy(this.state.checkedOutitems, selectedRows, 'id');
    console.log(`Modal Opened with ${selectedItems?.length} Selected records.`);
    this.setState({
      openCheckinModal : {modalState: true, data: selectedItems}
    });
   }
  
 customerDropdownItems = [];

setOpenCheckinModal = (action) => {
  this.setState({
    openCheckinModal : action
  });
}

 onInputSearchFilter = (data) => {
  // console.log(data.target.value);
  let filteredData = this.props.checkedOutList.filter(item => {
    let status = false;
      for (const key in item) {
        if(key === 'HostIP' || key === 'DeviceId') {
          const element = item[key];
          if (String(element).toLocaleLowerCase().includes(data.target.value.toLocaleLowerCase())) {
            status = true; 
            break;     
          }
        }
        
      }
      return status
  })
  // setItems(filteredData);
  this.setState({
    checkedOutitems : _.chunk(filteredData || [], 10)[0]
  })
}

updateList = () => {
  this.onInputSearchFilter({target:{value: " "}})
  this.onInputSearchFilter({target:{value: ""}})
}

getEffectiveListLength() {
  const effectiveList = this.props.list.filter(item => Number(item.checkOutUserId) === this.props.user.userId);
  return effectiveList && effectiveList.length > 0;
}


  render() {
    const { checkedOutitems, openCheckinModal } = this.state
    return (
      <Fragment>
      {this.getEffectiveListLength() ? <Fragment>
        <Checkin updateList={this.updateList} openModal={openCheckinModal} setOpenModal={this.setOpenCheckinModal}></Checkin>
        <DataTable rows={checkedOutitems || []} headers={this.checkedoutHeaders} isSortable overflowMenuOnHover>
     {({
       rows,
       headers,
       getHeaderProps,
       getRowProps,
       getSelectionProps,
       getToolbarProps,
       getBatchActionProps,
       onInputChange,
       selectedRows,
       getTableProps,
       getTableContainerProps,
     }) => (
       <TableContainer 
         title="My Checked Out Credentials"
         {...getTableContainerProps()}>
         <TableToolbar {...getToolbarProps()}>
           <TableBatchActions  {...getBatchActionProps()}>
                 <TableBatchAction
                   tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                   renderIcon={Download16}
                   onClick={this.batchActionClick(selectedRows)}>
                   Check In Credential
                 </TableBatchAction>
           </TableBatchActions>
           <TableToolbarContent>
             <TableToolbarSearch
               placeholder="Search for Device ID or IP Address"
               persistent={true}
               tabIndex={-1}
               onChange={this.onInputSearchFilter}
             />  
           </TableToolbarContent>
         </TableToolbar>
         <Table {...getTableProps()}>
           <TableHead>
             <TableRow>
               <TableSelectAll {...getSelectionProps()} />
               {headers.map((header, i) => (
                 <TableHeader key={i} {...getHeaderProps({ header })}>
                   {header.header}
                 </TableHeader>
               ))}
             </TableRow>
           </TableHead>
           <TableBody>
             {rows.map((row, i) => (
               <TableRow key={i} {...getRowProps({ row })}>
                 <TableSelectRow {...getSelectionProps({ row })} />
                 {row.cells.map((cell) => {
                    if(cell.info.header === "LoginName") {
                     return <TableCell key={cell.id}>
                     <div style={{display : 'flex', justifyContent: 'space-between'}}>
                   <span ref={(element) => {this.onCancel = getBatchActionProps.onCancel; this[`field_${cell.id}`] = element }} style={{alignSelf: 'center'}}>{cell.value}</span>
                   <span><CopyButton iconDescription="Copy Login ID" onClick={() => {
                     const el = document.createElement('textarea');
                     el.value = this[`field_${cell.id}`].innerHTML;
                     document.body.appendChild(el);
                     el.select();
                     document.execCommand('copy');
                     document.body.removeChild(el);
                   
                     // navigator.clipboard.writeText(this[`field_${cell.id}`].value);
                   }} />
                   </span>

                       </div>
                       </TableCell>
                   } else if(cell.info.header === "attached_groups") {
                     return <TableCell key={cell.id}><Link style={{cursor: 'pointer'}} onClick={(e) => {
                                 this.setState({ openCheckinModal: { modalState: true, data: row}})
                               } }>CheckIn</Link></TableCell>
                   } else if(cell.info.header === "CustomerName") {
                     return <TableCell key={cell.id}>
                       <p style={{marginBottom: '0', color: 'white'}} className='list_item_text'>{cell.value ? cell.value : '-'}</p>
                       <h2 style={{marginTop: '0'}} className="list_item_label">{
                                     this.state.customers.find(customer => customer.name === cell.value)?.id
                                   } </h2>
             
                     </TableCell>
                   } else if(cell.info.header === "Password") {
                     return <TableCell key={cell.id}>
                      <ViewToggle value={cell.value ? cell.value : ""}></ViewToggle>
                       </TableCell>
                   } else {
                     return <TableCell key={cell.id}>{cell.value}</TableCell>
                   }
                 })}
               </TableRow>
             ))}
           </TableBody>
         </Table>
         <Pagination
         {...this.paginationProps()}
       />
       </TableContainer>
     )}
   </DataTable>
 </Fragment> : <Fragment>
   <Grid style={{backgroundColor: '#262626', minHeight:'500px', padding:0}}>
     <Row></Row>
  <div className="dark-strip"></div>
  <Row style={{padding: '3rem'}}>
    <Column>
    <h3>You haven't checked out any credentials yet.</h3>
  <span>Search in the <strong> All Credentials</strong> tab to find the credentials you need. </span>
    </Column>
 
</Row>
   </Grid>
   </Fragment>}
 </Fragment>
      
     
    )
  }
}

const mapStateToProps = state => ({
  list: state.list.credentials,
  customers: state,
  checkedOutList: state.list.credentials.filter(item => Number(item.checkOutUserId) === state.user.profile.userId),
  user: state.user.profile
});

const mapDispatchToProps = dispatch => ({
  setCredentials : list => dispatch(setCredentials(list))
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutList);

