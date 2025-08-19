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

type Vote = {
  _id: string;
  user: string;
  direction: string;
}

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
  votes: Vote[];
  voteScore: number;
  createdAt: string;
  priority: "High" | "Medium" | "Low";
  updatedAt: string;
  comments?: Comment[];
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

export type Comment = {
  _id: string;
  user: string;
  text: string;
  date: string;
}

export type ReportState = 'not-approved' | 'approved-unresolved' | 'approved-resolved' | 'denied' | 'unknown';
