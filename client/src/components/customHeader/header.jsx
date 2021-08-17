import HeaderListItem from "@carbon/ibm-security/lib/components/Header/HeaderListItem";
import HeaderPopoverHeader from "@carbon/ibm-security/lib/components/Header/HeaderPopoverHeader/HeaderPopoverHeader";
import HeaderPopoverLinkSecondary from "@carbon/ibm-security/lib/components/Header/HeaderPopoverLinkSecondary/HeaderPopoverLinkSecondary";
import ProfileImage from "@carbon/ibm-security/lib/components/ProfileImage/ProfileImage";
import Transition from "@carbon/ibm-security/lib/components/Transition";
import { Logout16 } from "@carbon/icons-react";
import { Button, Header, HeaderName } from "carbon-components-react";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { setAuthStatus } from "../../redux/auth/authActions";
import {setProfilePic} from "../../redux/user/userActions";

const getPopoverLabelId = (string) =>
  `security--header__popover__label--${string}`;

/**
 * Renders the popover.
 * @param {HTMLElement} children The containing elements of the popover.
 * @param {boolean} state Whether the popover is toggled or not.
 * @returns {HTMLElement} The rendered popover.
 */
const renderPopover = (children, state) => (
  <Transition className="security--header" component="span">
    {state && <div className={`security--header__popover`}>{children}</div>}
  </Transition>
);

 export class IAMHeader extends Component {
  
  state = {
    isActive: { profile: false },
    loggedIn: false,
    profile : this.props.profile,
    links: {
      product: "/",
      profile: "url()",
      registration: "url()",
      sign_in: "url()",
      sign_out: "/#/login",
      edit_profile: "url()",
      // notifications_preferences: "url()",
      // notifications_view_all: "url()",
    },
    labels: {
      brand: {
        company: "IBM",
        domain: "Aura",
        product: "Credential Manager",
      },
      profile: {
        sign_out: "sds",
      },
    },
  };

  componentDidMount() {
    let { profile } = this.state;
    fetch("/api/users/profile", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth?.token}`,
      }
    }).then(res => res?.json()).then(res => {
      const profileData = res[0];
      const namechunk = String(profileData.displayName).split(' ')
      profile.image_url = `https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/${profileData.emailAddress}`;
      profile.name = {
        first_name: namechunk[0],
        surname: namechunk[namechunk.length -1],
        displayName : profileData.displayName
      }
      profile.userId = profileData.id;
      profile.email = profileData.emailAddress;
    this.setState({
      profile
    })
// console.log("profile fetch", res);
    }).catch(error => {
      console.log("profile fetch error", error);
    })
    
  }

  /**
   * Closes the popover when loses focus.
   */
  closePopover(target) {
    setTimeout(() => {
      const activeElement =
        target.getRootNode().activeElement || document.activeElement;
      const value = target.getAttribute("value");
      const label = activeElement
        ? activeElement.getAttribute("aria-label") || ""
        : "";
      if (!target.contains(activeElement) && label.indexOf(value) === -1) {
        this.toggle(value);
      }
    }, 0);
  }

  toggle(value) {
    this.setState({
      isActive: {
        profile: !this.state.isActive.profile,
      },
    });
  }

  /**
   * Renders the profile.
   * @returns {Function} The rendered profile element.
   */
  renderProfile() {
    const { labels, links, profile } = this.state;
    // const [ picURL, setPicURL ] = useState('profile');
    // console.log("render pop", this.props);
    const { isActive } = this.state;

    if (isActive.profile) {
      setTimeout(() => {
        this.userProfile.focus();
      }, 0);
    }

    const popoverLabelId = getPopoverLabelId("profile");

    return renderPopover(
      <div
        ref={(userProfile) => {
          this.userProfile = userProfile;
        }}
        className={`security--header__popover--focus`}
        aria-labelledby={popoverLabelId}
        onBlur={() => this.closePopover(this.userProfile)}
        role="tabpanel"
        tabIndex="0"
        value="profile"
      >
        <HeaderPopoverHeader
          className={`security--header__popover__profile__header`}
        >
          <Fragment>
            <ProfileImage
              className={`security--header__popover__profile__header__icon`}
              profile={profile}
              large
              onError={(e) => this.props.setProfilePic(null)}
            />
           {/* name and email */}
          </Fragment>
        </HeaderPopoverHeader>
        { (
          <section
            className={`security--header__popover__profile__description`}
          >
            {/* {profile.description} */}
            <div style={{display:'block'}}>
              <span
                id={popoverLabelId}
                className={`security--header__popover__profile__header__title`}
              >
                {profile.name.displayName}
              </span>
              <span
                className={`security--header__popover__profile__header__email`}
              >
                {profile.email}
              </span>
            </div>
          </section>
        )}

        <section className={`security--header__popover__footer`}>
          {this.props.showEditProfile && (
            <HeaderPopoverLinkSecondary
              className={`security--header__popover__profile__footer__edit`}
              href={links.edit_profile}
            >
              {labels.profile.edit_profile}
            </HeaderPopoverLinkSecondary>
          )}
          {/* <HeaderPopoverLinkSecondary
          className={`security--header__popover__profile__footer__logout`}
          href={links.sign_out}
        >
          {labels.profile.sign_out}
        </HeaderPopoverLinkSecondary> */}
          <Button size="sm" className="w-100 icon-btn" onClick={() => {
            sessionStorage.clear();
            this.props.setAuthStatus({ loggedIn : false});
          }}>
            <div className="text-icon">
              <span>Logout</span>
              <span>
                <Logout16 />
              </span>
            </div>
          </Button>
        </section>
      </div>,
      isActive.profile
    );
  }

  render() {
    return (
      <Header aria-label="IBM Platform Name">
        <HeaderName href="#" prefix="IBM">
          Credential Manager
        </HeaderName>
        <ul className="security--header__group  security--header__group--active">
          <HeaderListItem
            className="security--header__list__item security--header__list__item--active"
            hasPopup={true}
            isExpanded={this.state.isActive.profile}
          >
            <Fragment>
              <button id="user-profile"
                aria-label="Toggle profile"
                className={`security--button--icon security--header__button ${
                  this.state.isActive.profile
                    ? "security--header__button--active security--button--icon--active"
                    : ""
                }`}
                onClick={() => this.toggle("profile")}
              >
                <ProfileImage onError={(e) => {
                  console.log("error", e );
                  let { profile } = this.state;
                  profile.image_url = null
                  this.setState({
                    profile
                  })
                  }} profile={this.state.profile} />
              </button>

              {this.renderProfile()}
            </Fragment>
          </HeaderListItem>
        </ul>
      </Header>
    );
  }
}

const mapStateToProps = state => ({
      profile: state.user.profile,
      auth: state.auth
});
const mapDispatchToProps = dispatch => ({
  setProfilePic : profileURL => dispatch(setProfilePic(profileURL)),
  setAuthStatus : authInfo => dispatch(setAuthStatus(authInfo))
})


export default connect(mapStateToProps, mapDispatchToProps)(IAMHeader);