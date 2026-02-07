# 🌍 Countrypedia

Countrypedia is a mini web application that lets users explore countries through:
- 📊 **World Bank economic & demographic data**
- 🤖 **AI-generated country insights**
- 💬 **An AI chatbot** that remembers the selected country and past conversation

Built as a lightweight, bootstrap-friendly project with a focus on clarity, UX, and clean architecture.

---

## 🚀 Features

- Search and select any country
- Fetch real-time data from the **World Bank API**
- AI-generated country overview (story-driven, readable)
- Context-aware AI chatbot
  - Remembers selected country
  - Maintains conversation history
  - Suggested question chips
- Fully client-side UI with a Node.js backend

---

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS (Bootstrap)
- Vanilla JavaScript

**Backend**
- Node.js
- Express
- Groq OpenAI-compatible API (LLaMA 3.1)

**APIs**
- World Bank API
- Groq AI API

---

## Installation Guide

1. Clone the repository
2. Navigate to root
3. Run "npm install"
4. Create .env file in root
5. Add these secrets into your .env: PORT=5050, API_KEY, MAIL_ID, MAIL_PWD
6. Create an API key on Groq (https://console.groq.com/home) and add it into your .env
7. In .env, add your google (or other) mail ID.
8. For RESEND_API_KEY, go to Resend (https://resend.com) and create an API key for your mail ID.
8. Run the app: "npm run dev", it will be available at "http://localhost:5050"
