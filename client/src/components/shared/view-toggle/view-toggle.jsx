import CopyButton from '@carbon/ibm-security/lib/components/CopyButton';
import { View16, ViewOff16 } from '@carbon/icons-react';
import IconBtn from '../icon-btn/icon-btn'
import React, { useState } from 'react'

export default function ViewToggle({
    value = '',
    hidePasswordLabel = 'Hide Password',
    showPasswordLabel = 'Show Password',
}) {
    const prefix = 'bx';
    const [inputType, setInputType] = useState('password');

    const passwordIsVisible = inputType === 'text';
    const passwordVisibilityIcon = passwordIsVisible ? (
      <ViewOff16 style={{fill: 'white'}} className={`bx--snippet__icon ${prefix}--icon-visibility-off`} />
    ) : (
      <View16 style={{fill: 'white'}} className={`bx--snippet__icon ${prefix}--icon-visibility-on`} />
    );

    const togglePasswordVisibility = () =>
    setInputType(inputType === 'password' ? 'text' : 'password');

      return (
       <div style={{display : 'flex'}}>
            <span>
                <input data-toggle-password-visibility={inputType === 'password'} className="list_item_label" 
                        style={{background: 'transparent',border: "0", fontSize: "0.875rem", maxWidth: '9rem',outline: '0', marginTop: '0.60rem'}} readOnly
                        type={inputType} value={value} />
            </span>
            <div style={{display : 'flex'}}>
            <span>
                <CopyButton iconDescription="Copy Password" onClick={() => {
                      const el = document.createElement('textarea');
                      el.value = value;
                      document.body.appendChild(el);
                      el.select();
                      document.execCommand('copy');
                      document.body.removeChild(el);
                      // this[`field_${cell.id}`].select();
                      // document.execCommand("copy");
                      // navigator.clipboard.writeText(this[`field_${cell.id}`].value);
                    }} />
                </span>
            <span>
                <IconBtn
                    className={`${prefix}--copy-btn`}
                    aria-label="toggle"
                    onClick={togglePasswordVisibility}
                    title={passwordIsVisible ? hidePasswordLabel : showPasswordLabel}
                    >
                    {passwordVisibilityIcon}
                </IconBtn>
            </span>
            </div>
        </div>
    )
}
