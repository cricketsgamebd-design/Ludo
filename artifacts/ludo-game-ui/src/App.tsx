import React, { useEffect } from 'react';
import { useLocation, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetMe, getGetMeQueryKey } from '@workspace/api-client-react';

import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Store from './pages/Store';
import Notifications from './pages/Notifications';
import Rankings from './pages/Rankings';
import Admin from './pages/Admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading, error } = useGetMe({
    query: {
      retry: false,
      queryKey: getGetMeQueryKey(),
    }
  });

  useEffect(() => {
    if (!isUserLoading) {
      if (error || !user) {
        if (location !== '/login' && location !== '/register') {
          setLocation('/login');
        }
      }
    }
  }, [user, isUserLoading, error, location, setLocation]);

  if (isUserLoading) {
    return (
      <div className="app-container items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FA6FF]"></div>
      </div>
    );
  }

  // Auth pages don't need the global layout with bottom nav
  if (!user && (location === '/login' || location === '/register')) {
    return (
      <div className="app-container">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>
    );
  }

  // Once authenticated, show layout with bottom nav
  if (user) {
    return (
      <Layout user={user}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/store" component={Store} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/rankings" component={Rankings} />
          {user.isAdmin && <Route path="/admin" component={Admin} />}
          <Route>
            <div className="flex-1 flex items-center justify-center text-white">
              <h2>404 - Page Not Found</h2>
            </div>
          </Route>
        </Switch>
      </Layout>
    );
  }

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}