import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { DropDetailSkeleton } from './components/ui/Skeleton';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const DropDetail = lazy(() => import('./pages/DropDetail'));

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <DropDetailSkeleton />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'drops/:id', element: <DropDetail /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
