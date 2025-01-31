# Project Setup and Deployment

## Prerequisites
To run this application, ensure that you have the following installed on your system:

- **MongoDB**
- **Vue.js**
- **Node.js**
- **Docker**

## Running the Application
Once all prerequisites are installed, follow these steps to start the application:

1. Open a terminal in the project's root directory.
2. Ensure that no active containers conflict with this setup.
3. Run the following command:

   ```sh
   sudo docker compose up --build
   ```

This command will build and start all necessary services using Docker Compose.

## Database Initialization
- The environment variable `DB_INIT=true` initializes the database with sample data.

## Additional Information

- If you encounter any issues, verify that all dependencies are correctly installed and that Docker is running properly.
- Navigate localhost:8080 to test the app

