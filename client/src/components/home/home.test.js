import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Home } from './home.component';
import Credential  from '../credentials/credential.component';
import IAMHeader from '../customHeader/header';


Enzyme.configure({ adapter: new Adapter() });
describe('home component rendered', () => {
    const initialProps = {
        list: { credentials : []},
        auth: {},
        user: {profile: {}},
        customers: { customers: []}
    }
    var wrapper;
      beforeEach(()=>{
         wrapper = shallow(<Home {...initialProps}/>);
        //  componentInstance = wrapper.instance();
  })
    it('Header and Credential rendering', () => {
        expect(wrapper.find(Credential).length).equal(1);
        expect(wrapper.find(IAMHeader).length).equal(1);
    });
  });