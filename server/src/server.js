const app = require("./app");
const connectDB = require("./database/database");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});