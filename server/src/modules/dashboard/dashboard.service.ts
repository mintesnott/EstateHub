import prisma from "../../config/database";

export const getAgentDashboard = async (agentId: string) => {
  const propertiesGroupedByStatus = await prisma.property.groupBy({
    by: ["status"],
    where: { agentId },
    _count: { _all: true },
  });

  const propertiesGroupedByType = await prisma.property.groupBy({
    by: ["propertyType"],
    where: { agentId },
    _count: { _all: true },
  });

  const propertiesGroupedByListing = await prisma.property.groupBy({
    by: ["listingType"],
    where: { agentId },
    _count: { _all: true },
  });

  const inquiriesGroupedByStatus = await prisma.inquiry.groupBy({
    by: ["status"],
    where: { property: { agentId } },
    _count: { _all: true },
  });

  const recentPropertiesRaw = await prisma.property.findMany({
    where: { agentId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { imageUrl: true, isPrimary: true, id: true },
      },
    },
  });

  const recentInquiries = await prisma.inquiry.findMany({
    where: { property: { agentId } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      client: { select: { id: true, name: true, email: true } },
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          price: true,
          agentId: true,
        },
      },
    },
  });

  return {
    totalProperties: propertiesGroupedByStatus.reduce(
      (sum, r) => sum + r._count._all,
      0,
    ),
    propertiesByStatus: Object.fromEntries(
      propertiesGroupedByStatus.map((r) => [r.status, r._count._all]),
    ),
    propertiesByType: Object.fromEntries(
      propertiesGroupedByType.map((r) => [r.propertyType, r._count._all]),
    ),
    propertiesByListing: Object.fromEntries(
      propertiesGroupedByListing.map((r) => [r.listingType, r._count._all]),
    ),
    totalInquiries: inquiriesGroupedByStatus.reduce(
      (sum, r) => sum + r._count._all,
      0,
    ),
    inquiriesByStatus: Object.fromEntries(
      inquiriesGroupedByStatus.map((r) => [r.status, r._count._all]),
    ),
    recentProperties: recentPropertiesRaw.map(({ images, ...p }) => ({
      ...p,
      primaryImage: images[0] ?? null,
    })),
    recentInquiries,
  };
};

export const getAdminDashboard = async () => {

  const totalProperties = await prisma.property.count();
  const totalAgents = await prisma.user.count({ where: { role: "AGENT" } });
  const totalClients = await prisma.user.count({ where: { role: "CLIENT" } });

  const propertiesGroupedByStatus = await prisma.property.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const propertiesGroupedByType = await prisma.property.groupBy({
    by: ["propertyType"],
    _count: { _all: true },
  });

  const propertiesGroupedByListing = await prisma.property.groupBy({
    by: ["listingType"],
    _count: { _all: true },
  });

  const inquiriesGroupedByStatus = await prisma.inquiry.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const topCities = await prisma.property.groupBy({
    by: ["city"],
    _count: { _all: true },
    orderBy: { _count: { city: "desc" } },
    take: 5,
  });

  const valueStats = await prisma.property.aggregate({
    _sum: { price: true },
    _avg: { price: true },
  });

  const soldValue = await prisma.property.aggregate({
    where: { status: "SOLD" },
    _sum: { price: true },
  });

  const rentedValue = await prisma.property.aggregate({
    where: { status: "RENTED" },
    _sum: { price: true },
  });

  const recentPropertiesRaw = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      agent: { select: { id: true, name: true, email: true } },
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { imageUrl: true, isPrimary: true, id: true },
      },
    },
  });

  const recentInquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      client: { select: { id: true, name: true, email: true } },
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          price: true,
          agentId: true,
        },
      },
    },
  });

  const recentAgents = await prisma.user.findMany({
    where: { role: "AGENT" },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      agentProfile: {
        select: {
          agencyName: true,
          licenseNumber: true,
        },
      },
    },
  });

  return {
    totalProperties,
    totalAgents,
    totalClients,
    totalUsers: totalAgents + totalClients,
    propertiesByStatus: Object.fromEntries(
      propertiesGroupedByStatus.map((r) => [r.status, r._count._all]),
    ),
    propertiesByType: Object.fromEntries(
      propertiesGroupedByType.map((r) => [r.propertyType, r._count._all]),
    ),
    propertiesByListing: Object.fromEntries(
      propertiesGroupedByListing.map((r) => [r.listingType, r._count._all]),
    ),
    totalInquiries: inquiriesGroupedByStatus.reduce(
      (sum, r) => sum + r._count._all,
      0,
    ),
    inquiriesByStatus: Object.fromEntries(
      inquiriesGroupedByStatus.map((r) => [r.status, r._count._all]),
    ),
    topCities: topCities.map((r) => ({
      city: r.city,
      count: r._count._all,
    })),
    totalListedValue: String(valueStats._sum.price ?? 0),
    avgPropertyPrice: String(valueStats._avg.price ?? 0),
    totalSoldValue: String(soldValue._sum.price ?? 0),
    totalRentedValue: String(rentedValue._sum.price ?? 0),
    recentProperties: recentPropertiesRaw.map(({ images, ...p }) => ({
      ...p,
      primaryImage: images[0] ?? null,
    })),
    recentInquiries,
    recentAgents,
  };
};