# MedV Robotics Web Application

A real-time web application for MedV Robotics team management, featuring chat functionality, task management, and user administration.

## Features

- Real-time chat system
- Task management with categories (Programming, Building & Design, Outreach)
- User administration with admin privileges
- Task assignment and tracking
- Inbox system for assigned tasks
- Responsive design for all devices

## Setup Instructions

1. Clone the repository:
```bash
git clone [your-repository-url]
cd medv-robotics
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Access the application:
- Local: `http://localhost:8080`
- Network: `http://[your-ip]:8080`

## Dependencies

- Node.js
- Express.js
- Socket.IO

## File Structure

- `MedVrobotics.html` - Main application file
- `server.js` - Node.js server
- `package.json` - Project dependencies
- `README.md` - Project documentation

## Usage

1. Register a new account or login
2. Admin users can:
   - Add/delete tasks
   - Assign tasks to users
   - Manage user access
3. Regular users can:
   - View assigned tasks
   - Send messages in chat
   - Update task status 