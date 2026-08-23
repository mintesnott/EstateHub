
import { createBrowserRouter } from "react-router-dom";

import { HomePage } from "@/features/home/pages/HomePage";
import { NotFoundPage } from "@/features/home/pages/NotFoundPage";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ChangePasswordPage from "@/features/auth/pages/ChangePasswordPage";

import ProtectedRoute from "@/app/guards/ProtectedRoute";
import RequirePasswordChangeComplete from "@/app/guards/RequirePasswordChangeComplete";

import { PropertiesPage } from "@/features/properties/pages/PropertiesPage";
import { PropertyDetailsPage } from "@/features/properties/pages/PropertyDetailsPage";

import { AppLayout } from "@/components/layout/Authenticated/AppLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import PublicOnlyRoute from "./guards/PublicOnlyRoute";

import { FavoritesPage } from "@/features/favourite/pages/FavoritesPage";
import { ClientInquiriesPage } from "@/features/inquiries/pages/ClientInquiriesPage";
import { InquiryDetailPage } from "@/features/inquiries/pages/InquiryDetailPage";
import { AgentInquiriesPage } from "@/features/inquiries/pages/AgentInquiriesPage";
import { RequireRole } from "./guards/RequireRole";
import { NotAuthorizedPage } from "@/features/home/pages/NotAuthorizedPage";
import { ProfileDispatcher } from "@/features/profile/pages/ProfileDispatcher";
import { ConditionalLayout } from "@/components/layout/public/ConditionalLayout";

import { MyPropertiesPage } from "@/features/properties/pages/MyPropertiesPage";
import { CreatePropertyPage } from "@/features/properties/pages/CreatePropertyPage";
import { EditPropertyPage } from "@/features/properties/pages/EditPropertyPage";
import { AdminAgentsPage } from "@/features/agents/pages/AdminAgentsPage";

import { AdminAgentDetailPage } from "@/features/agents/pages/AdminAgentDetailPage";
import { AdminUsersPage } from "@/features/users/pages/AdminUsersPage";

export const router = createBrowserRouter([

{
  path: "/",
  element: <ConditionalLayout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: "properties",
      element: <PropertiesPage />,
    },
    {
      path: "properties/:id",
      element: <PropertyDetailsPage />,
    },
  ],
},

  {
  element: <PublicOnlyRoute />,
  children: [
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ],
},

  /*
   * CHANGE PASSWORD
   */
  {
    element: <RequirePasswordChangeComplete />,
    children: [
      {
        path: "/change-password",
        element: <ChangePasswordPage />,
      },
    ],
  },

    /*
  * PROTECTED APPLICATION
  */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/403",
            element: <NotAuthorizedPage />,
          },
          {
          path: "/profile",
          element: <ProfileDispatcher />,
          },
          {
            path: "/favorites",
            element: <FavoritesPage />,
          },
         {
          element: <RequireRole allowed={["CLIENT"]} />,
          children: [
            {
              path: "/inquiries",
              element: <ClientInquiriesPage />,
            },
          ],
          },
          {
            path: "/inquiries/:id",
            element: <InquiryDetailPage />,
          },
          {
            element: <RequireRole allowed={["AGENT"]} />,
            children: [
              {
                path: "/agent/inquiries",
                element: <AgentInquiriesPage />,
              },
               {
                path: "/agent/properties",
                element: <MyPropertiesPage />,
              },
              {
                path: "/agent/properties/new",
                element: <CreatePropertyPage />,
              },
              {
                path: "/agent/properties/:id/edit",
                element: <EditPropertyPage />,
              },
            ],
          },
          {
            element: <RequireRole allowed={["ADMIN"]} />,
            children: [
              {
                path: "/admin/inquiries",
                element: <AgentInquiriesPage viewerRole="ADMIN" />,
              },
              {
                path: "/admin/agents",
                element: <AdminAgentsPage />,
              },
              {
                path: "/admin/agents/:id",
                element: <AdminAgentDetailPage />,
              },
              {
                path: "/admin/users",
                element: <AdminUsersPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  /*
   * NOT FOUND
   */
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);