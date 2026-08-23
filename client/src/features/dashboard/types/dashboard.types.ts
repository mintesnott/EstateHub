export interface PropertyPrimaryImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface DashboardProperty {
  id: string;
  title: string;
  city: string;
  price: string;
  propertyType: string;
  listingType: string;
  status: string;
  primaryImage: PropertyPrimaryImage | null;
}

export interface DashboardInquiry {
  id: string;
  status: string;
  purpose: string;
  createdAt: string;
  client: { id: string; name: string; email: string };
  property: {
    id: string;
    title: string;
    city: string;
    price: string;
    agentId: string;
  };
}

export interface DashboardAgent {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  agentProfile: {
    agencyName: string | null;
    licenseNumber: string;
  } | null;
}

export interface AgentDashboardData {
  totalProperties: number;
  propertiesByStatus: Record<string, number>;
  propertiesByType: Record<string, number>;
  propertiesByListing: Record<string, number>;
  totalInquiries: number;
  inquiriesByStatus: Record<string, number>;
  recentProperties: DashboardProperty[];
  recentInquiries: DashboardInquiry[];
}

export interface AdminDashboardData {
  totalProperties: number;
  totalAgents: number;
  totalClients: number;
  totalUsers: number;
  propertiesByStatus: Record<string, number>;
  propertiesByType: Record<string, number>;
  propertiesByListing: Record<string, number>;
  totalInquiries: number;
  inquiriesByStatus: Record<string, number>;
  topCities: { city: string; count: number }[];
  totalListedValue: string;
  avgPropertyPrice: string;
  totalSoldValue: string;
  totalRentedValue: string;
  recentProperties: DashboardProperty[];
  recentInquiries: DashboardInquiry[];
  recentAgents: DashboardAgent[];
}

export interface AgentDashboardResponse {
  success: boolean;
  data: AgentDashboardData;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardData;
}