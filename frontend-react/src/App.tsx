import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Explore from '@/pages/Explore'
import Details from '@/pages/Details'
import RideStatus from '@/pages/RideStatus'
import Rewards from '@/pages/Rewards'
import History from '@/pages/History'
import Profile from '@/pages/Profile'
import Admin from '@/pages/Admin'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth — no shell */}
        <Route path="/login" element={<Login />} />

        {/* Admin — own layout */}
        <Route path="/admin" element={<Admin />} />

        {/* Main app — with Navbar + BottomNav */}
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/explore" element={<AppLayout><Explore /></AppLayout>} />
        <Route path="/details/:id" element={<AppLayout><Details /></AppLayout>} />
        <Route path="/ride-status" element={<AppLayout><RideStatus /></AppLayout>} />
        <Route path="/rewards" element={<AppLayout><Rewards /></AppLayout>} />
        <Route path="/history" element={<AppLayout><History /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />

        {/* 404 fallback */}
        <Route path="*" element={<AppLayout><Home /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  )
}
