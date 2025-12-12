import { SimulatorProvider } from './context/SimulatorContext';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { SimulationArea } from './components/SimulationArea';
import { InspectorPanel } from './components/InspectorPanel';
import './index.css';

function App() {
  return (
    <SimulatorProvider>
      <Layout
        sidebar={<Sidebar />}
        simulation={<SimulationArea />}
        inspector={<InspectorPanel />}
      />
    </SimulatorProvider>
  );
}

export default App;
