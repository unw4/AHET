import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout/PageLayout'
import LoginPage from '@/pages/Login/LoginPage'
import DashboardPage from '@/pages/Dashboard/DashboardPage'
import VehicleListPage from '@/pages/Vehicles/VehicleListPage'
import VehicleDetailPage from '@/pages/Vehicles/VehicleDetailPage'
import TaskBoardPage from '@/pages/Tasks/TaskBoardPage'
import MaintenancePage from '@/pages/Maintenance/MaintenancePage'
import TestManagementPage from '@/pages/Tests/TestManagementPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <PageLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'vehicles', element: <VehicleListPage /> },
      { path: 'vehicles/:id', element: <VehicleDetailPage /> },
      { path: 'tasks', element: <TaskBoardPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: 'tests', element: <TestManagementPage /> },
    ],
  },
])
