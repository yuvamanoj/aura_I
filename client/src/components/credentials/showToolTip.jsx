import { Tooltip } from 'carbon-components-react'
import React, { Component } from 'react'
import { connect } from 'react-redux';

class ShowToolTip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            // checkedoutByMe: false
            checkedoutByMe: Number(this.props.userId) === Number(this.props.id)
        }
        // console.log(this.props.id, this.props.userId);
    }
componentDidMount() {
    if(this.props.id && Number(this.props.id) >= 0 && !this.state.checkedoutByMe) {
        fetch(`/api/users/byId?id=${this.props.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.auth?.token}`,
            }
        }).then(res => res.json()).then(res => {
            if(Number(this.props.userId) !== Number(this.props.id)) {
                this.setState({
                    email: res.emailAddress,
                    name: res.displayName
                })   
            } else {
                this.setState({
                    checkedoutByMe : true
                }) 
            }
           
        }).catch(error => {
            console.log(error);
        })
    }
    
}

    render() {
        return (
            <span><span>Checked out by&nbsp;</span>
            {this.state.checkedoutByMe ? 'you' :
                <span>
                    <Tooltip tabIndex={0} triggerText={<span className="bx--link">{this.props.text}</span>} showIcon={false} direction="bottom">
                        <div style={{display:'block'}}>
                            <span style={{fontSize: '1.2rem', marginBottom:"1rem"}}>
                                { this.state.name || this.props.text}
                            </span>
                            <span className={`security--header__popover__profile__header__email`}>
                            {this.state.email}
                            </span>
                        </div>
                    </Tooltip>    
                </span>}
            </span>
           
        )
    }
}


const mapStateToProps = state => ({
    auth: state.auth,
    userId: state.user.profile.userId
  }); 
  
//   const mapDispatchToProps = dispatch => ({
//     setCredentials : list => dispatch(setCredentials(list)),
//     setCustomerDropdown : customers => dispatch(setCustomerDropdown(customers)),
//     disableUpdateStatus: () => dispatch(disableUpdateStatus()),
//     setFilteredList: filteredData => dispatch(setFilteredList(filteredData))
//   })
  export default connect(mapStateToProps, null)(ShowToolTip);
