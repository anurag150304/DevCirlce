# DevCircle - Real-time Group Chat with Code Collaboration

## 🚀 About DevCircle
**DevCircle** is a real-time group chat and collaborative coding platform built for developers. It allows users to join chat rooms, send real-time messages, and collaboratively edit and run code in multiple programming languages. Powered by **React, Node.js, Express, MongoDB, Socket.io, and WebContainers**, DevCircle is designed to enhance productivity and communication among developers.

---

## 🌟 Features
- 🔥 **Real-time Group Chat** using **Socket.io**
- 📝 **Live Code Collaboration** with **Gemini AI**
- 🔑 **User Authentication** (Signup/Login)
- 🌎 **Multiple Chat Rooms** with Room Management
- 🖥️ **Syntax Highlighting** for various programming languages
- 📦 **MongoDB Storage** for chat messages and user data
- 🎨 **Responsive & Modern UI** built with **Tailwind CSS**
- 🚀 **Deployed on Vercel (Frontend) & Render (Backend)**

---

## 🛠️ Tech Stack
### **Frontend:**
- React.js (Vite)
- Tailwind CSS
- CodeMirror (for real-time code editing)
- Socket.io (Client-side)

### **Backend:**
- Node.js & Express.js
- MongoDB (Mongoose for schema management)
- Socket.io (Server-side WebSockets)
- JWT Authentication (for secure login/signup)

### **Deployment:**
- Frontend: **Vercel**
- Backend: **Render**

---

## ⚡ Getting Started
### **1️⃣ Clone the Repository**
```bash
# Clone the repo
git clone https://github.com/anurag150304/DevCirlce.git
```

### **2️⃣ Install Dependencies**
#### **Frontend**
```bash
cd Frontend
pnpm install
pnpm run dev
```
#### **Backend**
```bash
cd Backend
pnpm install
pnpx nodemon server.js
```

### **3️⃣ Environment Variables (.env)**
Create a `.env` file in the backend directory and add:
```plaintext
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

## 🎥 Demo
🚀 **Live Demo:** [DevCircle](https://dev-cirlce.vercel.app/)

---

## 🏗️ Folder Structure
```
│── backend/         # Node.js & Express.js backend (API & WebSocket server)
│── frontend/        # React.js frontend
│── .env             # Environment variables
│── README.md        # Documentation
```

---

## 🚀 Future Enhancements
- 🔹 Private Messaging (One-on-One chat)
- 🔹 Code Execution Feature
- 🔹 Dark Mode Support
- 🔹 File Sharing in Chat

---

## 🤝 Contributing
We welcome contributions! 🚀
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📜 License
This project is **MIT Licensed**. You are free to use, modify, and distribute it.

---

## 📬 Contact
💡 **Developer:** ANURAG MISHRA  
📧 **Email:** anurag.mishra150304@gmail.com    
🔗 **LinkedIn:** [anurag-mishra-283428164](https://linkedin.com/in/anurag-mishra-283428164)
