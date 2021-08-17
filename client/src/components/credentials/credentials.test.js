import {Credential} from "./credential.component";
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';


Enzyme.configure({ adapter: new Adapter() });
describe('Credentials component rendering', () => {
    const initialProps = {
        list: { credentials : []},
        auth: {},
        user: {profile: {}},
        customers: { customers: []}
    }
    var wrapper, componentInstance;
      beforeEach(()=>{
         wrapper = shallow(<Credential {...initialProps}/>);
         componentInstance = wrapper.instance();
  })
    it('Check state of credential component.', () => {
     
      //Accessing react lifecyle methods
      componentInstance.componentDidMount();
    //   componentInstance.componentWillMount();
      //Accessing component state
      expect(wrapper.state('totalItem')).equals(0);
      expect(wrapper.state('pageSize')).equals(10);
      expect(wrapper.state('checkedoutListRefresh')).equals(false);
      expect(wrapper.state('credentialLoading')).equals(true);
      //Accessing component props
    //   expect(wrapper.props('list').credentials.length).equals(0);
      //Accessing class methods
    //   expect(componentInstance.counter(1)).equals(2);
    });
  });