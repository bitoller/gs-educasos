# Educa SOS - Frontend

This project aims to prepare and protect communities against natural disasters by providing an all‑in‑one educational and emergency‑readiness platform.  Through an intuitive web interface, Educa SOS teaches risk awareness, helps users assemble tailored emergency kits, and delivers real‑time alerts—ensuring that disaster‑preparedness is accessible, engaging, and sustainable.

Climate‑related events are increasing in frequency and severity, yet public knowledge on how to react remains limited. Educa SOS bridges this gap by combining learning resources, interactive quizzes, and practical preparedness tools into a single React application.

## 🔨 Project Functionalities

This site is composed of several distinct pages:

- Home: Presents an overview of the platform and encourages users to register or explore key features.
- Emergency Kits: Lets users view, create, edit, or delete automatic and custom kits with recommended supplies for different disaster scenarios.
- Learn Disasters: Offers curated articles, infographics, and best‑practice guides on earthquakes, floods, wildfires, and more.
- Quizzes: Provides interactive quizzes that award points and track progress, reinforcing disaster‑preparedness knowledge.
- Alerts: Displays up‑to‑date warnings for ongoing or imminent natural disasters.
- Dashboards:
- User Dashboard: central hub for personal kits, quiz scores, and alert preferences.
- Admin Dashboard: admin‑only area to manage content, kits and quizzes.
- Authentication: Secure login and registration flows with session management.
- About: Details the project’s mission and credits the development team.

## ✔️ Technologies and Tools Used

- `React v19.1.0`: UI library for building the SPA
- `Vite v6.3.5`: Lightning‑fast dev server and bundler
- `HTML/CSS & Bootstrap v5.3.6`: Layout and styling
- `Backend REST API`: Provides authentication, kit CRUD and quiz endpoints
- `Open‑Data Alert Feeds`: Supplies live disaster notifications

## ✔️ Libraries and Frameworks Used

- `fortawesome v6.7.2`
- `axios v1.9.0`
- `canvas-confetti v1.9.3`
- `framer-motion v12.16.0`
- `react-router-dom v7.6.1`
- `react-toastify v11.0.5`
- `styled-components v6.1.18`

## ⌛ Project Status

The project was completed.

## 📁 Access to the Project

- [See our site working](https://challenge-educa-sos.vercel.app/)
- [See the repository of our project on GitHub](https://github.com/bitoller/gs-educasos)
- [See our presentation video on YouTube](https://youtu.be/TahbBNQZHMQ?si=xaZZ4ylPaPbWRCLD)

In this repository, you have access to all the application files and codes.<br/>

## 🛠️ Open and Run the Project

- Clone the repository:
```bash
git clone https://github.com/bitoller/gs-educasos.git
cd gs-educasos
 ```

- Install dependencies:
```bash
npm install
 ```

- Start the dev server:
```bash
npm run dev
 ```

The app should now be running at `http://localhost:5173`.

## Communication with the API

This frontend application communicates with the backend API. Make sure the backend is running before starting the frontend development server.

The frontend development server is configured to proxy API requests (which start with `/api`) to the backend, which should be running at `http://localhost:8080/disaster-awareness`.

For more details on how to configure and run the backend, see the `README.md` file located in the `backend/` directory.

## 👩‍💻 Project Developers

- <a href="https://www.linkedin.com/in/bianca-toller" target="_blank">Bianca Toller</a>
- <a href="https://www.linkedin.com/in/bruno-marc" target="_blank">Bruno Marcelino Guimarães</a>
- <a href="https://www.linkedin.com/in/lucas-hc-ribeiro/" target="_blank">Lucas Henrique Ribeiro</a>
