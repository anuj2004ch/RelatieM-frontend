
import { Route,Routes } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';

import NotificationPage from './pages/NotificationPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import { Toaster } from 'react-hot-toast';

import { Navigate } from 'react-router';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from './components/Layout.jsx';
import { useThemeStore } from './store/useThemeStore.js';
import Friends from './pages/Friends.jsx';


function App() {
  const {isLoading,authUser}=useAuthUser();
  const isAuthenticated=Boolean(authUser);
  const isOnboarded=authUser?.isOnboarded;
  const {theme}=useThemeStore();
  
  
 
  if(isLoading) return  <PageLoader/>
 
  
  return (
    <div className="min-h-screen bg-base-100" data-theme={theme}>

      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><HomePage/> </Layout> ):(<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)}></Route>
        <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate to={isOnboarded ? "/" : "/onboarding"}/>}></Route>
        <Route path="/signup" element={ ! isAuthenticated ? <SignUpPage/> : <Navigate to={isOnboarded ? "/" : "/onboarding"}/>}></Route>
        <Route path="/onboarding" element={isAuthenticated ? (!isOnboarded ? <OnboardingPage/> : <Navigate to="/"/>) : <Navigate to="/login"/> }></Route>
  
        <Route path="/notifications" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true} ><NotificationPage/></Layout>) : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>}></Route>
        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true} ><ChatPage/></Layout>) : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>}></Route>
            <Route path="/friends" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true} ><Friends/></Layout>) : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>}></Route>
            <Route path="/profile" element={
  isAuthenticated && isOnboarded 
    ? (<OnboardingPage complete={false}/>) 
    : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
} />

          
        
      </Routes>
      <Toaster/>
      
    </div>
  )
}

export default App;