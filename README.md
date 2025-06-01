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

### Method 1: Using Maven with Embedded Tomcat

1. Open a terminal in the project root directory
2. Run the following command:
   ```bash
   mvn clean tomcat7:run
   ```
3. Access the application at: http://localhost:8080/disaster-awareness

### Method 2: Deploying to Standalone Tomcat

1. Build the WAR file:
   ```bash
   mvn clean package
   ```
2. Copy the generated WAR file from `target/disaster-awareness.war` to your Tomcat's `webapps` directory
3. Start Tomcat
4. Access the application at: http://localhost:8080/disaster-awareness

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