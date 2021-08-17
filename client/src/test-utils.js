// test-utils.js
import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { mount as enMount } from 'enzyme';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
// Import your own reducer
import reducer from './redux/root-reducer'

function render(
  ui,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

function mount(
  ui,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  } = {}
) {
  return enMount(<Provider store={store}>{ui}</Provider>)
}


// re-export everything
export * from '@testing-library/react'
// override render method
export { render, mount }