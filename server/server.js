import app from "./index.js";
import dbConnection from "./config/database.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log("✅ Server is running on PORT 3000");
    });
  } catch (error) {
    console.log("Error connecting to server", error);
    process.exit(1);
  }
}

startServer();
