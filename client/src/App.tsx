import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
          <Toaster position="top-right" reverseOrder={false} />

      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
