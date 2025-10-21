🏫 School Management System

A full-stack School Management System built using the MERN (MongoDB, Express.js, React, Node.js) stack.
This system helps schools efficiently manage students, teachers, classes, notices, admissions, and gallery media — all through a modern admin dashboard and responsive public website.

🚀 Features
🧑‍💼 Admin Panel

Secure Admin Login & Authentication (JWT-based)

Manage:

📰 Notices

🎓 Students

👩‍🏫 Teachers

🏫 Classes

🖼️ Gallery (Images & Videos)

View real-time Dashboard Statistics

Integrated Admin Chat Widget

🌐 Public Website

Interactive Home, About, Contact pages

Online Admission Form Submission

Dynamic Notices Board

Media-rich Gallery Section with Lightbox preview

Fully Responsive Design (TailwindCSS)

🧩 Tech Stack
Layer	Technology
Frontend	React (Vite), TailwindCSS, Axios, React Router
Backend	Node.js, Express.js
Database	MongoDB (Mongoose ORM)
Authentication	JWT (JSON Web Token)
File Uploads	Multer (Image & Video Upload)
Other Tools	SweetAlert2, Lightbox, dotenv
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/Ramprashadmahato/school-management-system.git
cd school-management-system

2️⃣ Install dependencies
# Backend
cd server
npm install

# Frontend
cd ../client
npm install

3️⃣ Environment Variables

Create .env files in both server/ and client/ directories.

📁 server/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

📁 client/.env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000/uploads

▶️ Run the App
Run Backend
cd server
npm run dev

Run Frontend
cd client
npm run dev


Visit 👉 http://localhost:5173

📸 Screenshots
🏠 Home Page

🧑‍💼 Admin Dashboard

🖼️ Gallery Page

📁 Folder Structure
school-management-system/
│
├── client/                # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── .env
│
├── server/                # Node.js backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
└── README.md

🔒 Authentication Flow

Admin logs in using credentials.

Backend issues JWT token.

Token stored in localStorage.

Protected admin routes validated via middleware.

🧠 Future Enhancements

📊 Attendance & Grades Tracking

🧾 Fee Management System

💬 Real-time Chat with Teachers & Students

📱 Mobile App Version (React Native)

💻 Author

Ram Prashad Mahato
📧 rpxingh201@gimal.com
]
🌐https://www.linkedin.com/in/ram-prashad-mahato-63b4412b1/
