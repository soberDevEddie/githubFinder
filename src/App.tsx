import UserSearch from './components/UserSearch';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <div className='container'>
      <h1>Github Finder</h1>
      <UserSearch />
      <Toaster position='top-right'/>
    </div>
  );
};

export default App;
