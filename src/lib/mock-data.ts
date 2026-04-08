// Mock data for dashboard UI — replace with real DB queries once backend is wired up

export const mockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
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

export type JobStatus = "NEW" | "YES" | "NO" | "SKIPPED" | "APPLIED" | "INTERVIEWING" | "REJECTED" | "OFFER";

export type MockJob = {
  id: string;
  company: string;
  title: string;
  location: string;
  isRemote: boolean;
  matchScore: number;
  summary: string;
  techStack: string[];
  postedAt: string; // human-readable, e.g. "2 hours ago"
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
    postedAt: "2 hours ago",
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
    postedAt: "4 hours ago",
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
    postedAt: "6 hours ago",
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
    postedAt: "8 hours ago",
    status: "APPLIED",
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
    postedAt: "1 day ago",
    status: "NEW",
    applyUrl: "https://acmecorp.com/careers",
  },
];
