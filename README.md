# DSAlytics 🚀

A modern platform to practice, track, and master Data Structures & Algorithms (DSA). Built with the MERN stack, DSAlytics offers an interactive experience for students and professionals to improve their coding skills.

---

## 📚 What is DSAlytics?

**DSAlytics** is a web application designed to help users:
- Practice DSA problems from a curated question bank
- Track their progress and analytics
- Collaborate in study plans and discussion forums
- Prepare for coding interviews and competitive programming

---

## 🌟 Key Features (Implemented)
- **User Authentication** (Email & Google OAuth)
- **Comprehensive DSA Question Bank** (with filters & tags)
- **Online Coding Playground** (Monaco Editor, code execution placeholder)
- **Progress Tracking & Analytics** (basic charts, leaderboards)
- **Discussion Forum** (Q&A, peer support, basic implementation)
- **Study Plans** (join, create, and track study groups)
- **AI Chatbot** (FAQ and learning support)

### 🚧 Features in Progress / Planned
- **AI Interviewer** (mock interviews, feedback) — *Prototype exists, not fully functional*
- **Custom Test Generator** (topic/difficulty-wise) — *Planned*
- **Advanced Analytics** (detailed insights, recommendations) — *Planned*

---

## 🛠️ Tech Stack

### Frontend
- React.js (with React Router)
- TailwindCSS
- Monaco Editor
- Chart.js, Recharts
- Axios

### Backend
- Node.js, Express.js
- MongoDB (Mongoose ODM)
- JWT Authentication, Passport (Google OAuth)

---

## 📁 Project Structure

```
DSAlytics/
├── client/                # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, SVGs, etc.
│   │   ├── components/    # Shared React components
│   │   ├── contexts/      # React context providers
│   │   ├── context/       # (legacy or additional context)
│   │   ├── data/          # Static data (e.g., problems.json)
│   │   ├── features/      # Feature modules (AI, Auth, Dashboard, etc.)
│   │   ├── pages/         # Page-level React components
│   │   ├── services/      # API and utility services
│   │   ├── utils/         # Utility functions
│   │   └── main.jsx       # App entry point
│   ├── index.html         # Main HTML file
│   ├── tailwind.config.js # TailwindCSS config
│   └── ...                # Other config files
│
├── server/                # Node.js + Express backend
│   ├── config/            # DB and other config files
│   ├── controllers/       # Route controllers
│   ├── data/              # Seed or static data
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API route definitions
│   ├── scripts/           # Data import/utility scripts
│   ├── services/          # Backend services (e.g., AI)
│   ├── utils/             # Utility functions
│   └── server.js          # Main server entry point
│
├── ai-services/           # (Optional) AI microservices (currently empty)
├── data/                  # Datasets, PDFs, CSVs
├── scripts/               # Root-level utility scripts
├── docker/                # Docker configs (currently empty)
├── requirements.txt       # Python requirements placeholder (not used)
├── README.md              # Project documentation
├── package.json           # Root package config
└── ...                    # Other root files (e.g., setup.js, .gitignore)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/varshitha127/DSAlytics.git
   cd DSAlytics
   ```
2. **Install dependencies**
   ```bash
   npm install           # Root dependencies
   cd client && npm install   # Frontend
   cd ../server && npm install # Backend
   ```
3. **Environment Setup**
   - Copy `.env.example` to `.env` in both `client/` and `server/` directories
   - Update the environment variables as needed
4. **Start the development servers**
   ```bash
   # Backend (from server directory)
   npm run dev
   # Frontend (from client directory)
   npm run dev
   ```

---

## 🔧 Environment Variables

### Server (`server/.env`)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JUDGE0_API_URL=your_judge0_url
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
```

### Client (`client/.env`)
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📊 Usage
- Register or log in (Google OAuth supported)
- Browse and solve DSA problems
- Track your progress and analytics
- Use the AI Chatbot for help and learning support
- Join discussions and forums
- Create or join study plans

---

## 🧑‍💻 Contributing

We welcome contributions from the community! To get started:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Contribution Guidelines:**
- Write clear, concise commit messages
- Add tests for new features
- Follow code style and linting rules
- Document your code where necessary
- Be respectful and constructive in discussions

---

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact
**Project Maintainer:** Varshitha ([GitHub Profile](https://github.com/varshitha127))  
**Email:** lakkireddyvarshithareddy@gmail.com 
**LinkedIn:** [in/varshithareddy-lakkireddy-1b1326290](https://www.linkedin.com/in/varshithareddy-lakkireddy-1b1326290)

Project Link: [https://github.com/varshitha127/DSAlytics](https://github.com/varshitha127/DSAlytics)

---

## ⚠️ Note on requirements.txt
This project is a JavaScript/Node.js (MERN) stack and does **not** use Python. All dependencies are managed via `package.json` in the root, `client/`, and `server/` directories. A `requirements.txt` is not required unless you add Python-based services. 