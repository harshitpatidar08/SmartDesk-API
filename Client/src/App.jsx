import { BrowserRouter , Routes , Route} from "react-router-dom";
import Navbar from './components/Navbar'
import ChatPage from './pages/ChatPage'
import TicketsPage from './pages/TicketPage'

function App() {
  return (
    <BrowserRouter>
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<ChatPage />} /> 
        <Route path="/tickets" element={<TicketsPage />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App