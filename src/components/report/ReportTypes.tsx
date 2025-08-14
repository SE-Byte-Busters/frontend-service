type ReportImage = {
  key: string;
  url: string;
  _id: string;
};

type Location = {
  type: string;
  coordinates: [number, number];
};

type User = {
  _id: string;
  username: string;
};

export type Report = {
  _id: string;
  user: User;
  title: string;
  description: string;
  approximatePosition: string;
  location: Location;
  city: string;
  category: string[];
  images: ReportImage[];
  status: number;
  approvalStatus: number;
  completionStatus: number;
  score: number;
  voteScore: number;
  createdAt: string;
  priority: "High" | "Medium" | "Low";
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
