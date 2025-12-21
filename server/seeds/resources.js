const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('../models/Resource');

dotenv.config();

// Curated high-quality resources for common tech skills
const curatedResources = [
    // React Resources
    {
        title: "React - The Complete Guide 2024",
        description: "Master React with Hooks, Redux, React Router, Next.js, and more",
        url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
        type: "course",
        difficulty: "intermediate",
        duration: "49 hours",
        skills: ["react", "javascript", "frontend", "hooks", "redux"],
        thumbnail: "https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg",
        author: "Maximilian Schwarzmüller",
        rating: 5
    },
    {
        title: "React Official Documentation",
        description: "Official React documentation with interactive examples and best practices",
        url: "https://react.dev/learn",
        type: "documentation",
        difficulty: "beginner",
        duration: "Reading",
        skills: ["react", "javascript", "frontend"],
        thumbnail: "https://react.dev/images/home/conf2021/cover.svg",
        author: "React Team",
        rating: 5
    },
    {
        title: "Full React Course 2024",
        description: "Complete React tutorial covering fundamentals to advanced concepts",
        url: "https://www.youtube.com/watch?v=b9eMGE7QtTk",
        type: "video",
        difficulty: "beginner",
        duration: "12 hours",
        skills: ["react", "javascript", "frontend"],
        author: "freeCodeCamp",
        rating: 5
    },

    // Node.js Resources
    {
        title: "Node.js Documentation",
        description: "Official Node.js documentation with API references and guides",
        url: "https://nodejs.org/en/docs/",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["nodejs", "javascript", "backend"],
        author: "Node.js Foundation",
        rating: 5
    },
    {
        title: "Node.js and Express.js Full Course",
        description: "Learn Node.js and Express from scratch",
        url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        type: "video",
        difficulty: "beginner",
        duration: "8 hours",
        skills: ["nodejs", "express", "backend", "api"],
        author: "freeCodeCamp",
        rating: 5
    },
    {
        title: "NestJS Complete Course",
        description: "Modern Node.js framework for scalable applications",
        url: "https://www.youtube.com/watch?v=GHTA143_b-s",
        type: "video",
        difficulty: "intermediate",
        duration: "10 hours",
        skills: ["nodejs", "nestjs", "typescript", "backend"],
        author: "freeCodeCamp",
        rating: 5
    },

    // Python Resources
    {
        title: "Python Official Tutorial",
        description: "Official Python tutorial covering all language features",
        url: "https://docs.python.org/3/tutorial/",
        type: "documentation",
        difficulty: "beginner",
        duration: "Reading",
        skills: ["python", "programming"],
        author: "Python Software Foundation",
        rating: 5
    },
    {
        title: "Python for Everybody Specialization",
        description: "Learn Python programming from scratch to data science",
        url: "https://www.coursera.org/specializations/python",
        type: "course",
        difficulty: "beginner",
        duration: "8 months",
        skills: ["python", "data science"],
        author: "University of Michigan",
        rating: 5
    },
    {
        title: "Python Full Course for Beginners",
        description: "Complete Python programming tutorial for beginners",
        url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        type: "video",
        difficulty: "beginner",
        duration: "6 hours",
        skills: ["python", "programming"],
        author: "Programming with Mosh",
        rating: 5
    },

    // Docker & DevOps
    {
        title: "Docker Documentation",
        description: "Official Docker documentation with guides and references",
        url: "https://docs.docker.com/",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["docker", "devops", "containers"],
        author: "Docker Inc",
        rating: 5
    },
    {
        title: "Docker Tutorial for Beginners",
        description: "Complete Docker tutorial from basics to advanced",
        url: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
        type: "video",
        difficulty: "beginner",
        duration: "3 hours",
        skills: ["docker", "devops"],
        author: "Programming with Mosh",
        rating: 5
    },
    {
        title: "Kubernetes Documentation",
        description: "Official Kubernetes docs for container orchestration",
        url: "https://kubernetes.io/docs/home/",
        type: "documentation",
        difficulty: "advanced",
        duration: "Reading",
        skills: ["kubernetes", "devops", "containers"],
        author: "CNCF",
        rating: 5
    },

    // AWS & Cloud
    {
        title: "AWS Cloud Practitioner Essentials",
        description: "Free AWS fundamentals course",
        url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
        type: "course",
        difficulty: "beginner",
        duration: "6 hours",
        skills: ["aws", "cloud", "devops"],
        author: "AWS Training",
        rating: 5
    },
    {
        title: "AWS Documentation",
        description: "Comprehensive AWS service documentation",
        url: "https://docs.aws.amazon.com/",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["aws", "cloud"],
        author: "Amazon Web Services",
        rating: 5
    },

    // Database
    {
        title: "MongoDB University",
        description: "Free official MongoDB courses and certifications",
        url: "https://university.mongodb.com/",
        type: "course",
        difficulty: "beginner",
        duration: "Varies",
        skills: ["mongodb", "database", "nosql"],
        author: "MongoDB Inc",
        rating: 5
    },
    {
        title: "PostgreSQL Documentation",
        description: "Official PostgreSQL documentation",
        url: "https://www.postgresql.org/docs/",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["postgresql", "database", "sql"],
        author: "PostgreSQL Global Development Group",
        rating: 5
    },
    {
        title: "SQL Tutorial - Full Database Course",
        description: "Complete SQL tutorial for beginners",
        url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        type: "video",
        difficulty: "beginner",
        duration: "4 hours",
        skills: ["sql", "database"],
        author: "freeCodeCamp",
        rating: 5
    },

    // System Design
    {
        title: "System Design Primer",
        description: "Learn how to design large-scale systems",
        url: "https://github.com/donnemartin/system-design-primer",
        type: "github",
        difficulty: "advanced",
        duration: "Reading",
        skills: ["system design", "architecture"],
        author: "Donne Martin",
        rating: 5
    },
    {
        title: "System Design Interview Course",
        description: "Comprehensive system design interview preparation",
        url: "https://www.youtube.com/watch?v=bUHFg8CZFws",
        type: "video",
        difficulty: "advanced",
        duration: "6 hours",
        skills: ["system design", "interviews"],
        author: "freeCodeCamp",
        rating: 5
    },

    // JavaScript
    {
        title: "JavaScript.info",
        description: "Modern JavaScript tutorial from basics to advanced",
        url: "https://javascript.info/",
        type: "documentation",
        difficulty: "beginner",
        duration: "Reading",
        skills: ["javascript", "programming"],
        author: "Ilya Kantor",
        rating: 5
    },
    {
        title: "You Don't Know JS",
        description: "Deep dive into JavaScript core mechanisms",
        url: "https://github.com/getify/You-Dont-Know-JS",
        type: "github",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["javascript", "programming"],
        author: "Kyle Simpson",
        rating: 5
    },
    {
        title: "JavaScript Full Course",
        description: "Complete JavaScript tutorial for beginners",
        url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        type: "video",
        difficulty: "beginner",
        duration: "3 hours",
        skills: ["javascript", "programming", "frontend"],
        author: "freeCodeCamp",
        rating: 5
    },

    // TypeScript
    {
        title: "TypeScript Documentation",
        description: "Official TypeScript documentation and handbook",
        url: "https://www.typescriptlang.org/docs/",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["typescript", "javascript"],
        author: "Microsoft",
        rating: 5
    },
    {
        title: "TypeScript Course for Beginners",
        description: "Learn TypeScript from scratch",
        url: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
        type: "video",
        difficulty: "beginner",
        duration: "1 hour",
        skills: ["typescript", "javascript"],
        author: "Programming with Mosh",
        rating: 5
    },

    // Git & Version Control
    {
        title: "Git Documentation",
        description: "Official Git reference and tutorials",
        url: "https://git-scm.com/doc",
        type: "documentation",
        difficulty: "beginner",
        duration: "Reading",
        skills: ["git", "version control"],
        author: "Git Community",
        rating: 5
    },
    {
        title: "Git and GitHub for Beginners",
        description: "Complete Git and GitHub tutorial",
        url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        type: "video",
        difficulty: "beginner",
        duration: "1 hour",
        skills: ["git", "github", "version control"],
        author: "freeCodeCamp",
        rating: 5
    },

    // Next.js
    {
        title: "Next.js Documentation",
        description: "Official Next.js documentation with examples",
        url: "https://nextjs.org/docs",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["nextjs", "react", "ssr"],
        author: "Vercel",
        rating: 5
    },
    {
        title: "Next.js 14 Full Course",
        description: "Complete Next.js tutorial with App Router",
        url: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
        type: "video",
        difficulty: "intermediate",
        duration: "8 hours",
        skills: ["nextjs", "react"],
        author: "JavaScript Mastery",
        rating: 5
    },

    // Tailwind CSS
    {
        title: "Tailwind CSS Documentation",
        description: "Official Tailwind CSS documentation",
        url: "https://tailwindcss.com/docs",
        type: "documentation",
        difficulty: "beginner",
        duration: "Reading",
        skills: ["tailwind", "css", "frontend"],
        author: "Tailwind Labs",
        rating: 5
    },
    {
        title: "Tailwind CSS Tutorial",
        description: "Learn Tailwind CSS from scratch",
        url: "https://www.youtube.com/watch?v=pfaSUYaSgRo",
        type: "video",
        difficulty: "beginner",
        duration: "2 hours",
        skills: ["tailwind", "css"],
        author: "Traversy Media",
        rating: 5
    },

    // Testing
    {
        title: "Jest Documentation",
        description: "Official Jest testing framework documentation",
        url: "https://jestjs.io/docs/getting-started",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["jest", "testing", "javascript"],
        author: "Meta",
        rating: 5
    },
    {
        title: "Testing JavaScript",
        description: "Comprehensive testing course",
        url: "https://testingjavascript.com/",
        type: "course",
        difficulty: "intermediate",
        duration: "15 hours",
        skills: ["testing", "javascript", "jest"],
        author: "Kent C. Dodds",
        rating: 5
    },

    // GraphQL
    {
        title: "GraphQL Documentation",
        description: "Official GraphQL documentation and guides",
        url: "https://graphql.org/learn/",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["graphql", "api"],
        author: "GraphQL Foundation",
        rating: 5
    },
    {
        title: "GraphQL Full Course",
        description: "Complete GraphQL tutorial with Node.js",
        url: "https://www.youtube.com/watch?v=ed8SzALpx1Q",
        type: "video",
        difficulty: "intermediate",
        duration: "4 hours",
        skills: ["graphql", "nodejs", "api"],
        author: "freeCodeCamp",
        rating: 5
    },

    // Redis
    {
        title: "Redis Documentation",
        description: "Official Redis documentation",
        url: "https://redis.io/docs/",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["redis", "caching", "database"],
        author: "Redis Ltd",
        rating: 5
    },

    // Vue.js
    {
        title: "Vue.js Documentation",
        description: "Official Vue.js documentation",
        url: "https://vuejs.org/guide/introduction.html",
        type: "documentation",
        difficulty: "beginner",
        duration: "Reading",
        skills: ["vue", "javascript", "frontend"],
        author: "Vue Team",
        rating: 5
    },

    // Angular
    {
        title: "Angular Documentation",
        description: "Official Angular documentation and tutorials",
        url: "https://angular.io/docs",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["angular", "typescript", "frontend"],
        author: "Google",
        rating: 5
    },

    // Machine Learning
    {
        title: "Machine Learning Course",
        description: "Andrew Ng's legendary ML course",
        url: "https://www.coursera.org/learn/machine-learning",
        type: "course",
        difficulty: "intermediate",
        duration: "11 weeks",
        skills: ["machine learning", "python", "ai"],
        author: "Stanford University",
        rating: 5
    },
    {
        title: "TensorFlow Documentation",
        description: "Official TensorFlow documentation",
        url: "https://www.tensorflow.org/learn",
        type: "documentation",
        difficulty: "advanced",
        duration: "Reading",
        skills: ["tensorflow", "machine learning", "python"],
        author: "Google",
        rating: 5
    },

    // Data Structures & Algorithms
    {
        title: "NeetCode - Data Structures & Algorithms",
        description: "Complete DSA course for coding interviews",
        url: "https://www.youtube.com/c/NeetCode",
        type: "playlist",
        difficulty: "intermediate",
        duration: "Multiple videos",
        skills: ["algorithms", "data structures", "coding interviews"],
        author: "NeetCode",
        rating: 5
    },
    {
        title: "LeetCode",
        description: "Practice coding interview questions",
        url: "https://leetcode.com/problemset/all/",
        type: "article",
        difficulty: "intermediate",
        duration: "Practice",
        skills: ["algorithms", "data structures", "coding interviews"],
        author: "LeetCode",
        rating: 5
    }
];

const softSkillsResources = [
    // Leadership
    {
        title: "Harvard Business Review - Leadership",
        description: "Leading insights on leadership strategy and management from HBR.",
        url: "https://hbr.org/topic/leadership",
        type: "article",
        difficulty: "advanced",
        duration: "Reading",
        skills: ["leadership", "management", "strategy"],
        author: "Harvard Business Review",
        rating: 5
    },
    {
        title: "Coursera - Leadership Principles",
        description: "Learn to lead high-performing teams and organizations.",
        url: "https://www.coursera.org/learn/leadership-principles",
        type: "course",
        difficulty: "intermediate",
        duration: "4 weeks",
        skills: ["leadership", "team management", "communication"],
        author: "Harvard Business School",
        rating: 5
    },

    // Strategic Planning
    {
        title: "McKinsey - Strategy & Corporate Finance",
        description: "Insights on strategic planning and corporate finance.",
        url: "https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights",
        type: "article",
        difficulty: "advanced",
        duration: "Reading",
        skills: ["strategic planning", "strategy", "long-term planning"],
        author: "McKinsey & Company",
        rating: 5
    },
    {
        title: "Strategic Planning Guide",
        description: "Comprehensive guide to strategic planning frameworks and execution.",
        url: "https://asana.com/resources/strategic-planning",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["strategic planning", "execution"],
        author: "Asana",
        rating: 5
    },

    // Communication
    {
        title: "Effective Communication Skills",
        description: "Guide to improving communication in the workplace.",
        url: "https://www.mindtools.com/page8.html",
        type: "article",
        difficulty: "beginner",
        duration: "Reading",
        skills: ["communication", "diplomacy", "negotiation"],
        author: "MindTools",
        rating: 5
    },
    {
        title: "Carnegie's Principles of Communication",
        description: "Master the art of communication and influence.",
        url: "https://www.dalecarnegie.com/en/resources/communication-skills",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["communication", "diplomacy", "persuasion"],
        author: "Dale Carnegie Training",
        rating: 5
    },

    // Tactical Execution & Problem Solving
    {
        title: "First Principles Thinking",
        description: "How to think like a scientist to solve complex problems.",
        url: "https://fs.blog/first-principles/",
        type: "article",
        difficulty: "advanced",
        duration: "Reading",
        skills: ["problem solving", "critical thinking", "tactical execution"],
        author: "Farnam Street",
        rating: 5
    },
    {
        title: "Project Management Methodology",
        description: "Guide to project management and tactical execution.",
        url: "https://www.pmi.org/learning/library/project-management-methodology-3588",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["tactical execution", "project management", "resource management"],
        author: "PMI",
        rating: 5
    },

    // Team Management
    {
        title: "Atlassian Team Playbook",
        description: "Workshops and plays to improve team dynamics and execution.",
        url: "https://www.atlassian.com/team-playbook",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["team management", "collaboration", "leadership"],
        author: "Atlassian",
        rating: 5
    },
    {
        title: "Google's Guide to Team Effectiveness",
        description: "Research-backed guide on what makes an effective team.",
        url: "https://rework.withgoogle.com/guides/understanding-team-effectiveness/steps/introduction/",
        type: "documentation",
        difficulty: "advanced",
        duration: "Reading",
        skills: ["team management", "culture", "leadership"],
        author: "Google re:Work",
        rating: 5
    },

    // Resource Management & Crisis Management
    {
        title: "Crisis Management Guide",
        description: "How to lead effectively during a crisis.",
        url: "https://www.forbes.com/sites/forbescoachescouncil/2021/03/15/14-essential-crisis-management-tips-for-leaders/",
        type: "article",
        difficulty: "advanced",
        duration: "Reading",
        skills: ["crisis management", "leadership", "problem solving"],
        author: "Forbes",
        rating: 5
    },
    {
        title: "Resource Management Best Practices",
        description: "Strategies for effective resource allocation and management.",
        url: "https://www.smartsheet.com/resource-management-guide",
        type: "documentation",
        difficulty: "intermediate",
        duration: "Reading",
        skills: ["resource management", "planning", "strategy"],
        author: "Smartsheet",
        rating: 5
    },

    // Diplomacy & Negotiation
    {
        title: "Program on Negotiation (PON)",
        description: "Negotiation skills and strategies from Harvard Law School.",
        url: "https://www.pon.harvard.edu/daily/negotiation-skills-strategies/",
        type: "article",
        difficulty: "advanced",
        duration: "Reading",
        skills: ["diplomacy", "negotiation", "conflict resolution"],
        author: "Harvard Law School",
        rating: 5
    }
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Seed the database
const seedResources = async () => {
    try {
        await connectDB();

        // Clear existing resources
        await Resource.deleteMany({});
        console.log('Cleared existing resources');

        // Insert curated resources
        const allResources = [...curatedResources, ...softSkillsResources];
        await Resource.insertMany(allResources);
        console.log(`✅ Successfully seeded ${allResources.length} resources!`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedResources();
