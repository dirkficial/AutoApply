// Mock data for dashboard UI — replace with real DB queries once backend is wired up

export const mockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
};

export const mockPreferences = {
  techStack: ["TypeScript", "React", "Next.js", "Node.js", "Go", "PostgreSQL", "Python", "AWS"],
};

export const mockStats = {
  totalSeen: 142,
  totalSeenDelta: "+12 today",
  applied: 23,
  appliedDelta: "+3 this week",
  interviewing: 5,
  interviewingNote: "2 scheduled",
  rejected: 8,
  rejectedRate: "35% rate",
};

export type JobStatus =
  | "NEW"
  | "YES"
  | "SKIPPED"
  | "APPLIED"
  | "INTERVIEWING"
  | "REJECTED"
  | "OFFER";

export type MockJob = {
  id: string;
  company: string;
  title: string;
  location: string;
  isRemote: boolean;
  matchScore: number;
  summary: string;
  techStack: string[];
  datePosted: Date;
  status: JobStatus;
  applyUrl: string;
};

export const mockJobs: MockJob[] = [
  {
    id: "job_1",
    company: "Stripe",
    title: "Software Engineer II",
    location: "San Francisco, CA",
    isRemote: true,
    matchScore: 92,
    summary:
      "Build and scale payment infrastructure serving millions of businesses worldwide. Work on distributed systems, API design, and real-time transaction processing.",
    techStack: ["Go", "TypeScript", "PostgreSQL", "Kafka"],
    datePosted: new Date("2026-04-10T08:00:00Z"),
    status: "NEW",
    applyUrl: "https://stripe.com/jobs",
  },
  {
    id: "job_2",
    company: "Vercel",
    title: "Frontend Engineer",
    location: "Remote",
    isRemote: true,
    matchScore: 88,
    summary:
      "Shape the future of web development by building tools used by millions of developers. Focus on React, Next.js, and performance optimization.",
    techStack: ["React", "Next.js", "TypeScript", "Edge Functions"],
    datePosted: new Date("2026-04-10T06:00:00Z"),
    status: "NEW",
    applyUrl: "https://vercel.com/careers",
  },
  {
    id: "job_3",
    company: "Figma",
    title: "Frontend Engineer",
    location: "San Francisco, CA",
    isRemote: false,
    matchScore: 74,
    summary:
      "Work on collaborative design tools used by millions of product teams. Build high-performance rendering and real-time collaboration features.",
    techStack: ["TypeScript", "React", "WebGL", "C++"],
    datePosted: new Date("2026-04-10T04:00:00Z"),
    status: "NEW",
    applyUrl: "https://figma.com/careers",
  },
  {
    id: "job_4",
    company: "Linear",
    title: "Full Stack Engineer",
    location: "Remote",
    isRemote: true,
    matchScore: 81,
    summary:
      "Build the issue tracker that software teams actually love. Own features end-to-end in a small, high-velocity team.",
    techStack: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    datePosted: new Date("2026-04-10T02:00:00Z"),
    status: "NEW",
    applyUrl: "https://linear.app/careers",
  },
  {
    id: "job_5",
    company: "Acme Corp",
    title: "Junior Developer",
    location: "Dallas, TX",
    isRemote: false,
    matchScore: 38,
    summary:
      "Maintain legacy enterprise Java applications. Onsite only, no remote options.",
    techStack: ["Java", "Spring", "Oracle DB"],
    datePosted: new Date("2026-04-09T10:00:00Z"),
    status: "NEW",
    applyUrl: "https://acmecorp.com/careers",
  },
  {
    id: "job_6",
    company: "Anthropic",
    title: "ML Engineer",
    location: "San Francisco, CA",
    isRemote: true,
    matchScore: 85,
    summary:
      "Work on training and evaluating large language models. Collaborate with researchers to ship reliable AI systems at scale.",
    techStack: ["Python", "PyTorch", "AWS", "TypeScript"],
    datePosted: new Date("2026-04-09T08:00:00Z"),
    status: "NEW",
    applyUrl: "https://anthropic.com/careers",
  },
  {
    id: "job_7",
    company: "PlanetScale",
    title: "Backend Engineer",
    location: "Remote",
    isRemote: true,
    matchScore: 77,
    summary:
      "Build the database platform powering thousands of production applications. Deep work on MySQL, distributed storage, and developer tooling.",
    techStack: ["Go", "MySQL", "Kubernetes", "gRPC"],
    datePosted: new Date("2026-04-09T06:00:00Z"),
    status: "NEW",
    applyUrl: "https://planetscale.com/careers",
  },
  {
    id: "job_8",
    company: "Datadog",
    title: "DevOps Engineer",
    location: "New York, NY",
    isRemote: true,
    matchScore: 62,
    summary:
      "Improve the infrastructure and deployment pipelines that run Datadog's monitoring platform. Work with Kubernetes, Terraform, and internal tooling.",
    techStack: ["Go", "Kubernetes", "Terraform", "AWS"],
    datePosted: new Date("2026-04-08T12:00:00Z"),
    status: "NEW",
    applyUrl: "https://datadog.com/careers",
  },
];
