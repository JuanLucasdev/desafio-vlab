// foi usado para fazer alguns testes 
export const MOCK_USER_CREATOR = {
  id: "user-creator-1",
  name: "Ana Course Creator",
  role: "creator",
  email: "ana@coursesphere.com",
  avatar: "https://randomuser.me/api/portraits/women/4.jpg",
};

export const MOCK_USER_INSTRUCTOR = {
  id: "user-instructor-2",
  name: "Alice Instructor",
  role: "instructor",
  email: "alice@example.com",
  avatar: "https://randomuser.me/api/portraits/women/5.jpg",
};

export const MOCK_INSTRUCTORS = [
  MOCK_USER_CREATOR,
  MOCK_USER_INSTRUCTOR,
  {
    id: "user-3",
    name: "Carla Colaboradora",
    role: "instructor",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

export const MOCK_COURSES_DATA = [
  {
    course_id: "c-101",
    creator_id: MOCK_USER_CREATOR.id,
    title: "Advanced React Hooks & State Management",
    description:
      "Master custom hooks, useReducer, and advanced context patterns for scalable applications.",
    status: "published",
    publish_date: "2026-03-15",
    start_date: "2025-11-01",
    end_date: "2025-12-15",
    instructors: MOCK_INSTRUCTORS.slice(0, 2),
    lessons: [
      {
        id: "l1",
        title: "Introduction to useReducer",
        video_url: "https://www.youtube.com/watch?v=l1",
        creator_id: MOCK_USER_CREATOR.id,
      },
      {
        id: "l2",
        title: "Deep Dive: Custom Fetch Hook",
        video_url: "https://www.youtube.com/watch?v=l2",
        creator_id: MOCK_USER_INSTRUCTOR.id,
      },
    ],
  },
  {
    course_id: "c-102",
    creator_id: MOCK_USER_CREATOR.id,
    title: "Next.js for Enterprise Applications",
    description:
      "Learn server-side rendering, API Routes, and deployment strategies.",
    status: "draft",
    publish_date: "2026-05-20",
    start_date: "2026-01-10",
    end_date: "2026-02-28",
    instructors: MOCK_INSTRUCTORS.slice(0, 1),
    lessons: [],
  },
];
