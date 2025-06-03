# Disaster Awareness Platform - Backend

A Java web application backend for managing disaster awareness content and emergency kits.

## Prerequisites

- Java JDK 11 or later
- Maven 3.6 or later
- Oracle Database (for JDBC connectivity)

## Project Structure

```
disaster-awareness/backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── disasterawareness/
│   │   │           ├── controller/    # Servlet controllers (@WebServlet annotations define endpoints)
│   │   │           ├── dao/          # Data Access Objects (Database interaction)
│   │   │           ├── model/        # Entity classes
│   │   │           ├── service/      # Business logic
│   │   │           └── utils/        # Utility classes (like ConnectionFactory)
│   │   ├── resources/
│   │   │   ├── db/                  # Database scripts (init.sql)
│   │   │   └── logging.properties   # Logging configuration
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   └── web.xml          # Web application configuration (Filters, etc.)
│   │       └── index.jsp            # Simple index page
└── pom.xml                          # Maven configuration (Dependencies, build, Tomcat plugin)
```

## Setup Instructions

1. **Database Setup**
   - Install Oracle Database.
   - Create a new database user.
   - Execute the database initialization script located at `src/main/resources/db/init.sql`.

2. **Configuration**
   - Update the database connection details in `src/main/java/com/disasterawareness/utils/ConnectionFactory.java` to match your Oracle database setup.
   - The application uses the following default configuration (can be adjusted in `pom.xml` for the embedded Tomcat):
     - Port: 8080
     - Context Path: `/disaster-awareness`
     - Character Encoding: UTF-8

## Running the Backend

#### Prerequisites
- **Java JDK 11+** installed.
- **Maven** installed and in your PATH.
- **Oracle Database** running and accessible with the schema set up.

#### Running with Maven Embedded Tomcat
1.  **Open a terminal** in the backend project root (`C:/Users/bi_to/Desktop/disaster-awareness/backend`).
2.  **Build and run the backend:**
    ```sh
    mvn clean tomcat7:run
    ```
    - This will start the backend at: [http://localhost:8080/disaster-awareness](http://localhost:8080/disaster-awareness)

#### Deploying to a Standalone Tomcat
1.  **Open a terminal** in the backend project root.
2.  **Build the WAR file:**
    ```sh
    mvn clean package
    ```
3.  Copy the generated `target/disaster-awareness.war` to your standalone Tomcat's `webapps` folder and start Tomcat.

## API Endpoints

The backend provides the following REST API endpoints.

**Note:** To test these endpoints using a tool like Insomnia, you must first start the backend API by following the "Running the Backend" instructions.

### Authentication
-   `POST /api/register`: Register a new user.
    -   Request Body: JSON object with `name`, `email`, and `password`.
-   `POST /api/login`: Authenticate a user and establish a session.
    -   Request Body: JSON object with `email` and `password`.

### Kit Management
-   `GET /api/kit`: Retrieve all emergency kits.
-   `POST /api/kit`: Create a new emergency kit.
    -   Request Body: JSON object with `houseType`, `numResidents`, `hasChildren`, `hasElderly`, `hasPets`, and `region`.
-   `GET /api/kit/{id}`: Retrieve a specific emergency kit by its ID.
    -   `{id}`: The ID of the kit (path parameter).
-   `PUT /api/kit/{id}`: Update an existing emergency kit.
    -   `{id}`: The ID of the kit (path parameter).
    -   Request Body: JSON object with updated `houseType`, `numResidents`, `hasChildren`, `hasElderly`, `hasPets`, and `region`.
-   `DELETE /api/kit/{id}`: Delete an emergency kit by its ID.
    -   `{id}`: The ID of the kit (path parameter).
-   `GET /api/kit/house/{houseType}`: Retrieve kits filtered by house type.
    -   `{houseType}`: The type of house (e.g., APARTMENT, HOUSE, CONDO) (path parameter).
-   `GET /api/kit/region/{region}`: Retrieve kits filtered by region.
    -   `{region}`: The region (e.g., SOUTHEAST, NORTHEAST, MIDWEST, SOUTHWEST, WEST) (path parameter).

### Content Management
-   `GET /api/content`: Retrieve all disaster awareness content.
-   `POST /api/content`: Create new disaster awareness content.
    -   Request Body: JSON object with `disasterType`, `title`, `description`, and `videoUrl`.
-   `GET /api/content/{id}`: Retrieve a specific content item by its ID.
    -   `{id}`: The ID of the content item (path parameter).
-   `PUT /api/content/{id}`: Update an existing content item.
    -   `{id}`: The ID of the content item (path parameter).
    -   Request Body: JSON object with updated `disasterType`, `title`, `description`, and `videoUrl`.
-   `DELETE /api/content/{id}`: Delete a content item by its ID.
    -   `{id}`: The ID of the content item (path parameter).
-   `GET /api/content/disaster/{disasterType}`: Retrieve content filtered by disaster type.
    -   `{disasterType}`: The type of disaster (path parameter).

## Security

The application uses form-based authentication configured in `src/main/webapp/WEB-INF/web.xml`.
-   Protected URLs: `/api/content/*` and `/api/kit/*` require authentication.

## Troubleshooting

-   **Database Connection Issues:** Verify database credentials and ensure the Oracle Database is running and accessible.
-   **500 Errors after Database Insert:** If you encounter a 500 error after confirming a database entry was created (especially for INSERT operations), it is likely an issue with retrieving the automatically generated ID. Check the server logs for `ClassCastException` related to `oracle.sql.ROWID` or similar types. The `ContentDAOImpl` and `KitDAOImpl` contain Oracle-specific handling for this.
-   **404 Errors:** Verify the context path (`/disaster-awareness`) in your request URLs and ensure the application is properly deployed and running in Tomcat.
-   **Port Already in Use:** If port 8080 is in use, you can change the port in the `pom.xml` for the `tomcat7-maven-plugin` configuration.

## Contributing

(Assuming standard contributing guidelines)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 