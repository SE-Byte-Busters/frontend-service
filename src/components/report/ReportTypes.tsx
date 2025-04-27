type ReportImage = {
  key: string;
  url: string;
};

type Location = {
  type: string;
  coordinates: [number, number];
};

export type Report = {
  _id: string;
  user: string;
  title: string;
  description: string;
  approximatePosition: string;
  location: Location;
  city: string;
  category: string[];
  images: ReportImage[];
  status: number;
  approvalStatus: number;
  voteScore: number;
  createdAt: string;
  updatedAt: string;
};

export type ReportsResponse = {
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
};
