
import React from 'react';
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SwipingPage from './pages/SwipingPage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import MatchesPage from './pages/MatchesPage';
import ChatsListPage from './pages/ChatsListPage';
import ChatPage from './pages/ChatPage';
import FiltersPage from './pages/FiltersPage';
import InterestsPage from './pages/onboarding/InterestsPage';
import PhotosPage from './pages/onboarding/PhotosPage';
import BottomNavbar from './components/BottomNavbar';
import PaymentPage from './pages/PaymentPage';
import ZenModePage from './pages/ZenModePage';
import type { AppRoute, NavbarRoute } from './types';

// A simple component to handle routing logic declaratively.
const Router: React.FC = () => {
  const getRoute = React.useCallback((): AppRoute => {
    const path = window.location.hash.slice(1) || '/';
    // Handle dynamic chat route
    if (path.startsWith('/chat/')) {
        return path as AppRoute;
    }
    const validRoutes: AppRoute[] = [
      '/', '/login', '/register', 
      '/onboarding/interests', '/onboarding/photos',
      '/app', '/explore', '/matches', '/chats', '/profile', '/filters', '/payment', '/zen'
    ];
    return validRoutes.includes(path as AppRoute) ? (path as AppRoute) : '/';
  }, []);

  const [route, setRoute] = React.useState<AppRoute>(getRoute());
  const { user, loading } = useAuth();

  const navigate = React.useCallback((path: AppRoute) => {
    window.location.hash = path;
    setRoute(path);
  }, []);
  
  React.useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [getRoute]);

  // Redirect logic
  React.useEffect(() => {
    if (!loading) {
      if (user && user.onboardingCompleted && (route === '/' || route === '/login' || route === '/register')) {
        navigate('/app');
      } else if (user && !user.onboardingCompleted) {
        // If onboarding is not complete, route to the correct step
        const targetRoute = `/onboarding/${user.onboardingStep || 'interests'}` as AppRoute;
        if (route !== targetRoute) {
          navigate(targetRoute);
        }
      } else if (!user && route !== '/login' && route !== '/register') {
         if(route !== '/') navigate('/');
      }
    }
  }, [user, loading, route, navigate]);
  
  const RenderContent = React.useCallback(() => {
    // Dynamic chat page
    if (user && route.startsWith('/chat/')) {
        const matchId = route.split('/')[2];
        return <ChatPage matchId={matchId} navigate={navigate} />;
    }
    
    // --- Authenticated User Flows ---
    if (user) {
      if (!user.onboardingCompleted) {
        switch (user.onboardingStep) {
          case 'photos':
            return <PhotosPage navigate={navigate} />;
          case 'interests':
          default:
            return <InterestsPage navigate={navigate} />;
        }
      }

      if (user.zenMode.enabled && route !== '/profile' && route !== '/zen') {
        navigate('/zen');
        return <ZenModePage navigate={navigate} />;
      }

      // --- Authenticated & Onboarded User ---
      switch (route) {
        case '/':
        case '/login':
        case '/register':
        case '/app':
          return <SwipingPage navigate={navigate} />;
        case '/explore':
          return <ExplorePage navigate={navigate} />;
        case '/matches':
          return <MatchesPage navigate={navigate} />;
        case '/chats':
          return <ChatsListPage navigate={navigate} />;
        case '/profile':
          return <ProfilePage navigate={navigate} />;
        case '/filters':
          return <FiltersPage navigate={navigate} />;
        case '/payment':
          return <PaymentPage navigate={navigate} />;
        case '/zen':
          return <ZenModePage navigate={navigate} />;
        default:
          // Fallback for any invalid authenticated route
          if(route.startsWith('/onboarding/')) {
             navigate('/app');
             return <SwipingPage navigate={navigate} />;
          }
          return <SwipingPage navigate={navigate} />;
      }
    }
  
    // --- Unauthenticated User Flow ---
    switch (route) {
      case '/login':
        return <LoginPage navigate={navigate} />;
      case '/register':
        return <RegisterPage navigate={navigate} />;
      case '/':
      default:
        return <HomePage navigate={navigate} />;
    }
  }, [user, route, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F06292] to-[#FFB6C1]">
          Spark
        </h1>
      </div>
    );
  }

  const showNavbar = user && user.onboardingCompleted && !user.zenMode.enabled && ['/app', '/explore', '/matches', '/chats', '/profile'].includes(route);
  const isNavbarRoute = (r: AppRoute): r is NavbarRoute => {
    return ['/app', '/explore', '/matches', '/chats', '/profile'].includes(r);
  };
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-transparent text-slate-800 font-sans">
       <div className="flex-grow overflow-y-auto">
        <RenderContent />
       </div>
       {showNavbar && isNavbarRoute(route) && <BottomNavbar navigate={navigate} currentRoute={route} />}
    </div>
  );
};

const App: React.FC = () => <Router />;

export default App;