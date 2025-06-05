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
   - Execute the database initialization script located at `src/main/resources/db/init.sql`. This script creates the necessary tables and populates them with initial sample data for content, kits, and quizzes.

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
- **Oracle Database** running and accessible with the schema and initial data set up (by running `src/main/resources/db/init.sql`).

#### Running with Maven Embedded Tomcat
1.  **Open a terminal** in the backend project root.
    ```sh
    mvn clean tomcat7:run
    ```
    - This will start the backend server. Note that accessing the root URL ([http://localhost:8080/disaster-awareness](http://localhost:8080/disaster-awareness)) directly in a browser might result in an error because there is no default servlet mapped to the root path. API endpoints are available under `/api/*`.

#### Deploying to a Standalone Tomcat
1.  **Open a terminal** in the backend project root.
2.  **Build the WAR file:**
    ```sh
    mvn clean package
    ```
3.  Copy the generated `target/disaster-awareness.war` to your standalone Tomcat's `webapps` folder and start Tomcat.

## API Testing with Insomnia

A collection file for Insomnia will be provided in the `src/main/resources/` folder (`Insomnia_Collection.json`). You can import this file into Insomnia to easily test all the backend endpoints.

**To use the Insomnia collection:**
1.  Ensure the backend is running (using `mvn clean tomcat7:run` or deployed to a standalone Tomcat).
2.  Import the `Insomnia_Collection.json` file into Insomnia.
3.  The requests in the collection are pre-configured with the correct URLs and request bodies. Remember to obtain a JWT token from the `/api/login` endpoint and include it in the `Authorization: Bearer <token>` header for protected endpoints.

## API Endpoints

The backend provides the following REST API endpoints.

**Note:** These endpoints are accessible only when the backend server is running.

### Authentication
-   `POST /api/register`: Register a new user.
    -   Request Body: JSON object with `name`, `email`, and `password`.
-   `POST /api/login`: Authenticate a user and get a JWT token.
    -   Request Body: JSON object with `email` and `password`.
    -   For testing purposes, you can use the following admin credentials: `admin@mail.com` / `password123` (You will need to manually update a user's `is_admin` flag in the database to 1 for the first admin user after registration).

### Admin Endpoints
These endpoints require **admin privileges** and a valid **JWT token** (`Authorization: Bearer <token>` header):
-   `GET /api/admin/users`: Get all users.
-   `GET /api/admin/users/{id}`: Get a specific user by ID.
-   `PUT /api/admin/users/{id}`: Update a user's information.
    -   Request Body: JSON object with optional `name`, `email`, and `isAdmin` fields.
-   `DELETE /api/admin/users/{id}`: Delete a user.
-   `PUT /api/admin/user/score`: Update a user's score.
    -   Request Body: JSON object with `userId` (Long) and `score` (Integer).

### Score Management
-   `GET /api/leaderboard`: Get the leaderboard of all users sorted by score.
    -   Returns: List of users with their scores in descending order.
    -   **Note:** This endpoint is **publicly accessible** and does not require authentication.

### Kit Management
These endpoints require a valid **JWT token** (`Authorization: Bearer <token>` header):
-   `GET /api/kit`: Retrieve all emergency kits. For regular users, this returns kits **created by the authenticated user**. **Administrators can retrieve all kits.** Each kit object includes a `recommendedItems` field containing a JSON string of recommended items based on the kit's attributes.
-   `POST /api/kit`: Create a new emergency kit. The created kit will be associated with the **authenticated user**.
    -   If creating an **automatically generated** kit, provide `houseType`, `numResidents`, `hasChildren`, `hasElderly`, `hasPets`, and `region`. Recommended items will be automatically generated.
        ```json
        {
          "houseType": "CASA",
          "numResidents": 4,
          "hasChildren": true,
          "hasElderly": false,
          "hasPets": true,
          "region": "SUDOESTE"
        }
        ```
    -   If creating a **custom** kit, include `isCustom: true` and provide your list of items in the `recommendedItems` field as a JSON array of objects, each with `name` and `description`. Other kit attributes can still be provided for context but are not used for item generation.
        ```json
        {
          "houseType": "APARTAMENTO",
          "numResidents": 1,
          "hasChildren": false,
          "hasElderly": false,
          "hasPets": false,
          "region": "SUDESTE",
          "isCustom": true,
          "recommendedItems": "[{\"name\":\"Minha Bateria Portátil\",\"description\":\"Para carregar meu celular em emergências.\"}, {\"name\":\"Meu Livro Favorito\",\"description\":\"Para me manter entretido.\"}]"
        }
        ```
-   `GET /api/kit/{id}`: Retrieve a specific emergency kit by its ID. **Requires the authenticated user to be the kit owner or an administrator.** The kit object includes the `recommendedItems` field and the `isCustom` flag.
    -   `{id}`: The ID of the kit (path parameter).
-   `PUT /api/kit/{id}`: Update an existing emergency kit. **Requires the authenticated user to be the kit owner or an administrator.**
    -   `{id}`: The ID of the kit (path parameter).
    -   Request Body: Can include updated standard kit attributes. If `recommendedItems` is provided in the request body, the kit will be marked as custom and the provided items will be saved. Otherwise, if the kit is not custom, recommended items will be regenerated based on the provided attributes.
-   `DELETE /api/kit/{id}`: Delete an emergency kit by its ID. **Requires the authenticated user to be the kit owner or an administrator.**
    -   `{id}`: The ID of the kit (path parameter).
-   `GET /api/kit/house/{houseType}`: Retrieve kits filtered by house type.
    -   `{houseType}`: The type of house (e.g., APARTMENT, HOUSE, CONDO) (path parameter).
-   `GET /api/kit/region/{region}`: Retrieve kits filtered by region.
    -   `{region}`: The region (e.g., SOUTHEAST, NORTHEAST, MIDWEST, SOUTHWEST, WEST) (path parameter).

### Content Management
These endpoints require a valid **JWT token** (`Authorization: Bearer <token>` header):
-   `GET /api/content`: Retrieve all disaster awareness content.
    -   **Note:** This endpoint is now **publicly accessible** and does not require authentication.
-   `POST /api/content`: Create new disaster awareness content.
-   `GET /api/content/{id}`: Retrieve a specific content item by its ID.
    -   `{id}`: The ID of the content item (path parameter).
    -   **Note:** This endpoint is now **publicly accessible** and does not require authentication.
-   `PUT /api/content/{id}`: Update an existing content item.
-   `DELETE /api/content/{id}`: Delete a content item by its ID.
-   `GET /api/content/disaster/{disasterType}`: Retrieve content filtered by disaster type.
    -   `{disasterType}`: The type of disaster (path parameter).
    -   **Note:** This endpoint is now **publicly accessible** and does not require authentication.

### Quiz Endpoints

These endpoints are for accessing quizzes and submitting answers.

-   `GET /api/quizzes`: Get a list of all available quizzes.
    -   Returns: JSON array of Quiz objects (without questions/choices initially).
    -   **Note:** This endpoint is **public** and does not require authentication.
-   `GET /api/quizzes/{id}`: Get a specific quiz by ID, including its questions and answer choices.
    -   `{id}`: The ID of the quiz (path parameter).
    -   Returns: JSON object of the Quiz with nested Question and AnswerChoice objects.
    -   **Note:** This endpoint is **public** and does not require authentication.
-   `POST /api/quizzes/submit`: Submit answers for a quiz to calculate score and update user's total score.
    -   Requires: **JWT Authentication Header** (`Authorization: Bearer <token>`).
    -   Request Body: JSON object with `quizId` (Long) and `submittedAnswers` (JSON object where keys are question IDs (String) and values are submitted answer choice IDs (Long)).
        ```json
        {
            "quizId": 1,
            "submittedAnswers": {
                "1": 3,  // Question ID 1, Submitted Answer Choice ID 3
                "2": 5   // Question ID 2, Submitted Answer Choice ID 5
                // ... more answers
            }
        }
        ```
    -   Returns: JSON object indicating success and the score earned.
        ```json
        {
            "message": "Quiz submitted successfully",
            "scoreEarned": 20
        }
        ```

## Security

The application uses JWT-based authentication for most `/api/*` endpoints. Public endpoints like `/api/leaderboard`, `GET /api/quizzes`, and `GET /api/quizzes/{id}` do not require authentication.

Admin endpoints (`/api/admin/*`) are protected by an additional filter that checks for the `isAdmin` flag on the authenticated user.

## Troubleshooting

-   **Database Connection Issues:** Verify database credentials and ensure the Oracle Database is running and accessible.
-   **500 Errors after Database Insert:** If you encounter a 500 error after confirming a database entry was created (especially for INSERT operations where the backend needs the generated ID), it might be an issue with retrieving the automatically generated ID from Oracle. Check the server logs for exceptions. The `ContentDAOImpl` and `KitDAOImpl` contain Oracle-specific handling for this. Ensure you have run the `init.sql` script completely and correctly.
-   **404 Errors:** Verify the context path (`/disaster-awareness`) in your request URLs and ensure the application is properly deployed and running in Tomcat. Remember that the root URL might show an error, but API endpoints are under `/api/*`.
-   **Port Already in Use:** If port 8080 is in use, you can change the port in the `pom.xml` for the `tomcat7-maven-plugin` configuration.
-   **Incorrect Quiz Scoring:** Ensure you have run the complete `init.sql` script to populate the quiz tables correctly, as the `is_correct` flags determine the right answers.

## Contributing

(Assuming standard contributing guidelines)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 