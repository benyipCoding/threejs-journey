import { Routes, Route } from 'react-router-dom';
import Demo1 from './pages/Demo1';
import Demo2 from './pages/Demo2';
import Text3D from './pages/Text3D';
import Shadow from './pages/Shadow';
import HauntedHouse from './pages/HauntedHouse';
import Particles from './pages/Particles';
import VueTest from './pages/VueTest';
import Galaxy from './pages/Galaxy';
import ScrollBaseAnimation from './pages/ScrollBaseAnimation';
import Physics from './pages/Physics';
import ImportModels from './pages/ImportModels';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Demo1 />} />
      <Route path="/demo1" element={<Demo1 />} />
      <Route path="/demo2" element={<Demo2 />} />
      <Route path="/text3d" element={<Text3D />} />
      <Route path="/shadow" element={<Shadow />} />
      <Route path="/haunted" element={<HauntedHouse />} />
      <Route path="/particles" element={<Particles />} />
      <Route path="/vue-test" element={<VueTest />} />
      <Route path="/galaxy" element={<Galaxy />} />
      <Route path="/scroll" element={<ScrollBaseAnimation />} />
      <Route path="/physics" element={<Physics />} />
      <Route path="/import-models" element={<ImportModels />} />
    </Routes>
  );
};

export default App;
