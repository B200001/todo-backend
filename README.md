# 📱 React Native To-Do App (with Authentication + Node.js + MongoDB)

A complete **To-Do List Mobile Application** built using:

- **React Native CLI (TypeScript)** for the mobile app  
- **Node.js + Express** backend  
- **MongoDB + Mongoose** for database  
- **JWT Authentication** for secure login/register  
- **Context API** for state management  

This project demonstrates full-stack development skills with a clean architecture, modern UI, and complete CRUD operations.

---

## 🚀 Features

### 🔐 Authentication
- User Registration  
- User Login  
- Persisted sessions using JWT + AsyncStorage  
- Protected backend routes  

### ✅ To-Do Features
- Create tasks  
- Edit tasks  
- Delete tasks  
- Mark tasks as completed  
- Set:
  - Title
  - Description
  - Priority (Low / Medium / High)
  - Deadline  
  - Date-Time (optional)
- Automatically sorted newest-first

### 🎨 UI/UX
- Clean modern UI with React Native components  
- Aesthetic styling using separate stylesheets  
- Responsive layout for Android & iOS  

### 🧠 State Management
- React Context API for:
  - Authentication state  
  - Task management  

---

## 📂 Folder Structure
root/
│── backend/
│ ├── controllers/
│ │ ├── authController.ts
│ │ └── taskController.ts
│ ├── middleware/
│ │ └── authMiddleware.ts
│ ├── models/
│ │ ├── User.ts
│ │ └── Task.ts
│ ├── routes/
│ │ ├── authRoutes.ts
│ │ └── taskRoutes.ts
│ ├── server.ts
│ └── package.json
│
│── frontend/
│ ├── src/
│ │ ├── screens/
│ │ ├── context/
│ │ ├── components/
│ │ ├── styles/
│ │ └── api/
│ ├── App.tsx
│ ├── package.json
│ └── tsconfig.json
