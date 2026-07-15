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
      retry: false,           // no retries globally — 401 = not logged in
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [location, setLocation] = useLocation();

  // Auth check — never blocks rendering. user = undefined while loading, null on error.
  const { data: user } = useGetMe({
    query: { queryKey: getGetMeQueryKey() },
  });

  // If already logged in, don't show login/register
  useEffect(() => {
    if (user && (location === '/login' || location === '/register')) {
      setLocation('/');
    }
  }, [user, location, setLocation]);

  // Auth pages
  if (location === '/login' || location === '/register') {
    return (
      <div className="app-container">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>
    );
  }

  // Main app — always visible. user is null/undefined for guests, User object when logged in.
  return (
    <Layout user={user ?? null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/store" component={Store} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/rankings" component={Rankings} />
        {user?.isAdmin && <Route path="/admin" component={Admin} />}
        <Route>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <h2>404 – Page Not Found</h2>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
