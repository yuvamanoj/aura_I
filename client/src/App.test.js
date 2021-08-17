
import Login from './components/login/login.component';
import React from 'react'

import { render, fireEvent, screen } from './test-utils'
import { App } from './App'
// import configureStore from 'redux-mock-store'
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { expect } from 'chai';
import Home from './components/home/home.component';

Enzyme.configure({ adapter: new Adapter() });

it('Renders the connected app with initialState', () => {
  render(<App />, { initialState: { user: null, list : [] } });
  const component = screen.getAllByText('');
  expect(component.length).equal(40);
});

describe("App", () => {
  it("renders correctly", () => {
    shallow(<App />);
  });
 });

test('Should login form loaded', () => {
  // const { container } = render(<Login />)
  // // console.log("container", container);
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'a' } })

  const component = screen.getAllByText('');
  // const wrapper = mount(<Component {...props} />);
// expect(wrapper.instance().methodName).toHaveBeenCalled();
  expect(component.length).equal(39)
  console.log("component.length", component.length);
});

test('Should login form loaded m', () => {
  render(<Login />)
  const userNameField = screen.getByLabelText('Username');
  const passwordField = screen.getByPlaceholderText('Enter Your Password');
  expect(userNameField.id).equal('userName');
  expect(userNameField.name).equals('userName');
  userNameField.value = "hj"
  // expect(userNameField.onchange).toHaveBeenCalled();
  console.log("user name value  : ", userNameField.value);
  expect(userNameField.placeholder).equals('admin\\your AD ID');
  expect(passwordField.name).equals('password');
  expect(passwordField.id).equals('password');
})

// test('Should App component tested', () => {
//   const wrapper = mount(<App />);
  //  const handleClick = jest.spyOn(React, "componentDidMount");
// console.log(wrapper.instance());

// it('+++ render the connected(SMART) component', () => {
  // expect(wrapper.find(ConnectedHome).length).toEqual(1)
// });
  // expect(wrapper.instance().state('loading')).toBe(true)

  //  handleClick.mockImplementation(size => [size, changeSize]);

  //  wrapper.find("#para1").simulate("click");
  //  expect(changeSize).toBeTruthy();
// })



describe('Test App component.',()=>{
  const initialState = {auth: {loggedIn : false}}
  // const mockStore = configureStore()
  // let store;
  var  wrapper;

  beforeEach(()=>{
    // store = mockStore(initialState)
    // container = shallow(<ConnectedApp store={store} /> )  
    wrapper = shallow(<App {...initialState} /> )  
     
  })

  it('Check state variables of APP component', () => {
    expect(wrapper.state("loggedIn")).equals(undefined);
    expect(wrapper.state("loading")).equals(false);
  });

    it('Check if Login Component Exist in App Component', () => {
    //  expect(wrapper.instanse().state.loading).toBe(true);
     expect(wrapper.find(Login).length).equal(1);
  });

  // it('Check if componentDidMount called', () => {
  //   // const instance = container.instance();
  //   // instance.incrementCounter();
  //   // expect(incrementSpy).toBeCalledWith(2);
  // });
  
});

describe('Test Home component is rendered.',()=>{
  const initialState = {auth: {loggedIn : true}}
  // const mockStore = configureStore()
  // let store;
  var container;

  beforeEach(()=>{
    // store = mockStore(initialState)
    // container = shallow(<ConnectedApp store={store} /> )  
    container = shallow(<App {...initialState} /> )  
     
  })

  it('Check state variables of APP component', () => {
    expect(container.state("loggedIn")).equals(undefined);
    expect(container.state("loading")).equals(false);
  });

    it('Check if Login Component Exist in App Component', () => {
    //  expect(wrapper.instanse().state.loading).toBe(true);
     expect(container.find(Login).length).equal(1);
     expect(container.find(Home).length).equal(0);
  });

  // it('Check if componentDidMount called', () => {
  //   // const instance = container.instance();
  //   // instance.incrementCounter();
  //   // expect(incrementSpy).toBeCalledWith(2);
  // });
  
});

describe('Check validateAuth fun called)',()=>{
  const initialState = {auth: {loggedIn : true}, loggedIn : true}
  // const mockStore = configureStore()
  let wrapper,componentInstance

  beforeEach(()=>{
      // store = mockStore(initialState)
      wrapper = shallow(<App loggedIn={true} {...initialState}/>);
      componentInstance = wrapper.instance();
  })
   it('Check if validate Auth Called.', () => {
    wrapper.setState({ loading: true });
    // wrapper.se
    expect(wrapper.state('loading')).equals(true);

    // expect(wrapper.find(Home).length).equal(1);
    componentInstance.validateAuth();
    componentInstance.componentDidMount();
    // expect(incrementSpy).toBeCalledWith(2);
    expect(wrapper.state('loading')).equals(false);
  });


});

