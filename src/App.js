
import './App.css';
import Menu from './components/Menu'; 
import Toolbox from './components/Toolbox'
import Board from './components/Board';

function App() {
  return (
    < div style={{overflowX:'hidden'}}>
      <Menu/>
      <Toolbox/>
      <Board/>
    </div>
    
     
  );
}

export default App;
