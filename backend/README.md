# Disaster Awareness Platform

A web application for managing disaster awareness content and emergency kits.

## Prerequisites

- Java JDK 11 or later
- Maven 3.6 or later
- Oracle Database (for JDBC connectivity)

## Project Structure

```
disaster-awareness/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── disasterawareness/
│   │   │           ├── controller/    # Servlet controllers
│   │   │           ├── dao/          # Data Access Objects
│   │   │           ├── model/        # Entity classes
│   │   │           ├── service/      # Business logic
│   │   │           └── utils/        # Utility classes
│   │   ├── resources/
│   │   │   ├── db/                  # Database scripts
│   │   │   └── logging.properties   # Logging configuration
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   └── web.xml          # Web application configuration
│   │       ├── index.jsp            # Landing page
│   │       └── login.jsp            # Login page
└── pom.xml                          # Maven configuration
```

## Setup Instructions

1. **Database Setup**
   - Install Oracle Database
   - Create a new database user
   - Execute the database initialization script:
     ```sql
     @src/main/resources/db/init.sql
     ```

2. **Configuration**
   - The application uses the following default configuration:
     - Port: 8080
     - Context Path: /disaster-awareness
     - Database: Oracle
     - Character Encoding: UTF-8

## Running the Application

### Backend (Java Web Application)

#### Prerequisites
- **Java JDK 11+** installed
- **Maven** installed and in your PATH
- **Oracle Database** running and accessible (update credentials in your `ConnectionFactory` if needed)
- **Tomcat 7+** (if not using Maven's embedded Tomcat)

#### Running with Maven Embedded Tomcat
1. **Open a terminal** in your project root (`C:/Users/bi_to/Desktop/disaster-awareness`).
2. **Build and run the backend:**
   ```sh
   mvn clean tomcat7:run
   ```
   - This will start the backend at:  
     [http://localhost:8080/disaster-awareness](http://localhost:8080/disaster-awareness)

3. **If you want to deploy to a standalone Tomcat:**
   - Build the WAR file:
     ```sh
     mvn clean package
     ```
   - Copy the generated `target/disaster-awareness.war` to your Tomcat's `webapps` folder and start Tomcat.

### Frontend (React Application)

#### Prerequisites
- **Node.js** and **npm** installed

#### Running the Frontend
1. **Open a new terminal** in the frontend directory:
   ```sh
   cd frontend
   ```
2. **Install dependencies** (if you haven't already):
   ```sh
   npm install
   ```
3. **Start the React app:**
   ```sh
   npm run dev
   ```
   - This will start the frontend at:  
     [http://localhost:5173](http://localhost:5173) (or another port, check the terminal output)

### How it Works
- The **frontend** (React) will make API requests to the **backend** (Java/Tomcat) at `http://localhost:8080/disaster-awareness/api`.
- Make sure both servers are running at the same time.
- If you get CORS errors, ensure your backend is configured to allow requests from the frontend's origin.

### Troubleshooting
- If you get errors about missing dependencies, run `npm install` in the frontend folder.
- If you get a port conflict, stop any other servers using the same port or change the port in your config.
- If you get a 404 or 500 from the backend, check your database connection and Tomcat logs.

## API Endpoints

### User Management
- `POST /api/register` - Register a new user
- `POST /api/login` - User login

### Content Management
- `GET /api/content` - List all content
- `GET /api/content/{id}` - Get specific content
- `POST /api/content` - Create new content
- `PUT /api/content/{id}` - Update content
- `DELETE /api/content/{id}` - Delete content

### Kit Management
- `GET /api/kit` - List all kits
- `GET /api/kit/{id}` - Get specific kit
- `POST /api/kit` - Create new kit
- `PUT /api/kit/{id}` - Update kit
- `DELETE /api/kit/{id}` - Delete kit

## Security

The application uses form-based authentication with the following security constraints:
- Protected URLs: `/api/content/*` and `/api/kit/*`
- Required Role: `user`
- Login Page: `/login.jsp`
- Error Page: `/error.jsp`

## Troubleshooting

1. **Port Already in Use**
   - Check if another application is using port 8080
   - Change the port in `pom.xml` if needed

2. **Database Connection Issues**
   - Verify database credentials
   - Check if Oracle Database is running
   - Ensure the database user has proper permissions

3. **404 Errors**
   - Verify the context path in the URL
   - Check if the application is properly deployed
   - Ensure all required files are in the correct locations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 