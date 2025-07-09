# Educa SOS - Backend

A Java web application for managing disaster awareness content and emergency kits.

## Prerequisites

- Java JDK 11 or higher
- Maven 3.6 or higher
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

## Configuration Instructions

1. **Database Configuration**
   - Install Oracle Database.
   - Create a new database user.
   - Run the initialization script located at `src/main/resources/db/init.sql`. This script creates the necessary tables and inserts initial example data for content, kits, and quizzes.

2. **Configuration**
   - Update the connection data in the file `src/main/java/com/disasterawareness/utils/ConnectionFactory.java` according to your Oracle configuration.
   - The application uses the following default configuration (adjustable in `pom.xml` with embedded Tomcat):
     - Port: 8080
     - Context path: `/disaster-awareness`
     - Character encoding: UTF-8

## Running the Backend

#### Prerequisites
- **Java JDK 11+** installed.
- **Maven** installed and configured in PATH.
- **Oracle Database** running, with schema and initial data configured (via `src/main/resources/db/init.sql`).

#### Running with Embedded Tomcat via Maven
1.  **Open a terminal** in the backend project root.
    ```sh
    mvn clean tomcat7:run
    ```
    - This will start the backend server. Note that accessing the root URL directly ([http://localhost:8080/disaster-awareness](http://localhost:8080/disaster-awareness)) may result in an error, as there is no servlet mapped to the root path. The API endpoints are under `/api/*`.

## Testing the API with Insomnia

An Insomnia collection file will be available at `src/main/resources/` (`Insomnia_Collection.json`). You can import this file into Insomnia to easily test all backend endpoints.

**To use the Insomnia collection:**
1.  Make sure the backend is running (with `mvn clean tomcat7:run` or via standalone Tomcat).
2.  Import the file `Insomnia_Collection.json` into Insomnia.
3.  The collection requests are already configured with the correct URLs and request bodies. Remember to obtain a JWT token at the `/api/login` endpoint and include it in the `Authorization: Bearer <token>` header to access protected endpoints.

## API Endpoints

The backend provides the following REST API endpoints.

**Note:** These endpoints are only accessible while the backend server is running.

### Authentication
-   `POST /api/register`: Registers a new user.
    -   Request body: JSON object with `name`, `email`, and `password`.
-   `POST /api/login`: Authenticates a user and returns a JWT token.
    -   Request body: JSON object with `email` and `password`.
    -   For testing purposes, you can use the following admin credentials: `admin@mail.com` / `password123`  (You will need to manually update the `is_admin` field of the user in the database to 1 after registration to make them an admin).

### Admin Endpoints
These endpoints require **administrator privileges** and a valid **JWT token** (`Authorization: Bearer <token>` header):
-   `GET /api/admin/users`: Returns all users.
-   `GET /api/admin/users/{id}`: Returns a specific user by ID.
-   `PUT /api/admin/users/{id}`: Updates a user's information.
    -   Request body: JSON object with optional fields `name`, `email`, and `isAdmin`.
-   `DELETE /api/admin/users/{id}`: Deletes a user.
-   `PUT /api/admin/user/score`: Updates a user's score.
    -   Request body: JSON object with `userId` (Long) and `score` (Integer).

### Score Management
-   `GET /api/leaderboard`: Returns a user ranking ordered by score.
    -   Return: List of users with their scores in descending order.
    -   **Note:** This endpoint is **public** and does not require authentication.

### Kit Management
These endpoints require a valid **JWT token** (`Authorization: Bearer <token>` header):
-   `GET /api/kit`: Returns all emergency kits. For regular users, returns kits **created by the authenticated user**. **Administrators can see all kits.** Each kit includes the `recommendedItems` field with a JSON string of recommended items based on the kit’s attributes.
-   `POST /api/kit`: Creates a new emergency kit. The kit will be associated with the **authenticated user**.
    -   For **automatically generated** kits, provide `houseType`, `numResidents`, `hasChildren`, `hasElderly`, `hasPets`, e `region`. Recommended items will be generated automatically.
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
    -   For **custom** kits, include `isCustom: true` and provide the desired items in the `recommendedItems` field as a JSON array with `name` and `description`. Other kit attributes may still be provided as context but will not be used in item generation.
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
-   `GET /api/kit/{id}`: Returns a specific emergency kit by ID. **Requires that the authenticated user is the owner of the kit or an administrator.** The kit object includes the `recommendedItems` field and the `isCustom` flag.
    -   `{id}`: The ID of the kit (route parameter).
-   `PUT /api/kit/{id}`: Updates an existing emergency kit. **Requires that the authenticated user is the owner of the kit or an administrator.**
    -   `{id}`: The ID of the kit (route parameter).
    -   Request body: May include updated standard attributes of the kit. If `recommendedItems` is provided in the request body, the kit will be marked as custom and the provided items will be saved. Otherwise, if the kit is not custom, recommended items will be regenerated based on the provided attributes.
-   `DELETE /api/kit/{id}`: Deletes an emergency kit by its ID. **Requires that the authenticated user is the owner of the kit or an administrator.**
    -   `{id}`: The ID of the kit (route parameter).
-   `GET /api/kit/house/{houseType}`: Returns kits filtered by housing type.
    -   `{houseType}`: The housing type (e.g., APARTAMENTO, CASA, SITIO) (route parameter).
-   `GET /api/kit/region/{region}`: Returns kits filtered by region.
    -   `{region}`: The region (e.g., SUDESTE, NORDESTE, SUL, NORTE) (route parameter).

### Content Management
These endpoints require a valid **JWT token** (`Authorization: Bearer <token>` header):
-   `GET /api/content`: Returns all disaster awareness content.
    -   **Note:** This endpoint is now **publicly accessible** and does not require authentication.
-   `POST /api/content`: Creates new disaster awareness content.
-   `GET /api/content/{id}`: Returns a specific content item by its ID.
    -   `{id}`: The ID of the content item (route parameter).
    -   **Note:** This endpoint is now **publicly accessible** and does not require authentication.
-   `PUT /api/content/{id}`: Updates an existing content item.
-   `DELETE /api/content/{id}`: Deletes a content item by its ID.
-   `GET /api/content/disaster/{disasterType}`: Returns content filtered by disaster type.
    -   `{disasterType}`: The disaster type (route parameter).
    -   **Note:** This endpoint is now **publicly accessible** and does not require authentication.

### Quiz Endpoints

These endpoints are for accessing quizzes and submitting answers.

-   `GET /api/quizzes`: Returns a list of all available quizzes.
    -   Returns: JSON array of Quiz objects (without questions/options initially).
    -   **Note:** This endpoint is **public** and does not require authentication.
-   `GET /api/quizzes/{id}`: Returns a specific quiz by ID, including its questions and answer choices.
    -   `{id}`: The ID of the quiz (route parameter).
    -   Returns: JSON object of the Quiz with nested Question and AnswerChoice objects.
    -   **Note:** This endpoint is **public** and does not require authentication.
-   `POST /api/quizzes/submit`: Submits quiz answers to calculate the score and update the user's total score.
    -   Requires: **JWT Authentication Header** (`Authorization: Bearer <token>`).
    -   Request body: JSON object with `quizId` (Long) and `submittedAnswers` (JSON object where the keys are question IDs (String) and the values are submitted answer choice IDs (Long)).
        ```json
        {
            "quizId": 1,
            "submittedAnswers": {
                "1": 3,  // ID da Pergunta 1, ID da opção de resposta enviada 3
                "2": 5   // ID da Pergunta 2, ID da opção de resposta enviada 5
                // ... mais respostas
            }
        }
        ```
    -   Returns: JSON object indicating success and the score earned.
        ```json
        {
            "message": "Quiz enviado com sucesso",
            "scoreEarned": 20
        }
        ```

## Security

The application uses JWT-based authentication for most `/api/*` endpoints.
Public endpoints like `/api/leaderboard`, `GET /api/quizzes`, and `GET /api/quizzes/{id}` do not require authentication.

Admin endpoints (`/api/admin/*`) are protected by an additional filter that checks the authenticated user's `isAdmin` field.

## Troubleshooting

-   **Database Connection Issues:** Check database credentials and ensure that Oracle Database is running and accessible.
-   **500 Errors after Database Insert:** If you encounter a 500 error after confirming an entry was created (especially for INSERT operations where the backend needs the generated ID), there may be an issue retrieving the auto-generated ID from Oracle. Check server logs for exceptions. The `ContentDAOImpl` and `KitDAOImpl` files contain specific handling for Oracle. Ensure that you have executed the `init.sql` script completely and correctly.
-   **404 Errors:** Check the context path (`/disaster-awareness`) in your request URLs and ensure that the application was correctly deployed and is running in Tomcat. Note that the root URL may show an error, but the API endpoints are under `/api/*`.
-   **Port Already in Use:** If port 8080 is in use, you can change it in `pom.xml` in the `tomcat7-maven-plugin` configuration.
-   **Incorrect Quiz Score:** Make sure you have fully run the `init.sql` script to correctly populate the quiz tables, as the `is_correct` fields determine the correct answers.
