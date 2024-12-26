Project Description
The Full Stack Task Management App allows users to register and sign in using JWT authentication. Once logged in, users can manage their tasks by adding, editing, and deleting them. The app uses React for the front-end and Node.js/Express for the back-end, which connects to a MongoDB database for storing user and task information.

Features
User Authentication: Secure sign-up and sign-in functionality using JWT for token-based authentication.
Task Management: Users can create, edit, and delete tasks.
Responsive UI: The app is fully responsive and works seamlessly on both desktop and mobile devices.
Tech Stack
Frontend:
React
Vite (for bundling and development)
Tailwind CSS (for styling)
Backend:
Node.js
Express.js
MongoDB (for storing user and task data)
JWT (JSON Web Tokens) for authentication
Setup Instructions
Front-end Setup
Clone the repository for the front-end:

bash
Copy code
git clone https://github.com/your-username/task-management-app-frontend.git
Navigate to the front-end directory:

bash
Copy code
cd frontend
Install the required dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm run dev
The front-end will now be running at http://localhost:5173.

Back-end Setup
Clone the repository for the back-end:

bash
Copy code
git clone https://github.com/your-username/task-management-app-backend.git
Navigate to the back-end directory:

bash
Copy code
cd backend
Create a .env file in the root of the back-end directory with the following environment variables:

makefile
Copy code
PORT=3000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
Install the required dependencies:

bash
Copy code
npm install
Start the back-end server:

bash
Copy code
npm run dev
The back-end API will now be running at http://localhost:3000.

Challenges & Limitations
CORS Issues: During development and deployment, we faced issues with Cross-Origin Resource Sharing (CORS). The front-end was unable to make requests to the back-end due to restrictive CORS policies. This was resolved by configuring the CORS policy correctly on the back-end server.
Deployment Problems: Deploying the app to cloud platforms such as Render was challenging, especially dealing with configuration issues like environment variables and making sure both the front-end and back-end were correctly set up to communicate.
Assumptions
JWT Authentication: It’s assumed that each user will have a unique email and password. The passwords are stored securely on the server using bcrypt hashing, and authentication is done using JWT.
Data Validation: Basic input validation is assumed for tasks and user data.
Environment Configuration: It’s assumed that the back-end API URL is correctly configured in the front-end .env file to connect with the deployed back-end.
