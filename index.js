const express = require("express");
require("dotenv").config();
const db = require("./models")
const cors = require("cors");
const fileUpload = require("express-fileupload")
const notFound = require("./Middleware/not-found");
const errorHandlerMiddleware = require("./Middleware/error-handler");
const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroSequelize = require("@admin-bro/sequelize");
const app = express();

// port 
const PORT = process.env.PORT || 8050;

// register admin-bro sequelize adapter
// AdminBro.registerAdapter(AdminBroSequelize);

// middlewares
app.use(cors());
app.use(express.json({limit: "200mb"}));
app.use(express.urlencoded({extended: false, limit: "200mb"}));
app.use(fileUpload())

// path for logos
app.use("/api/v1/logos", express.static("logos"))

// admin bro
// const adminBro = new AdminBro({
//     databases: [db],
//     rootPath: "/api/v1/admin",
// });

// const router = AdminBroExpress.buildRouter(adminBro);
// app.use(adminBro.options.routePath, router);

// routes
app.get("/api/v1/", (req, res) => {
    res.send("Corpdeets tech jobs api");
});

// auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);

// jobs routes
const jobsRoutes = require("./routes/jobsRoutes");
app.use("/api/v1/jobs", jobsRoutes);

// profiles routes
const profilesRoutes = require("./routes/profileRoutes");
app.use("/api/v1/profiles", profilesRoutes);

// errors and not found
app.use(notFound);
app.use(errorHandlerMiddleware);

db.sequelize.sync().then(() => { 
    app.listen(PORT, () => {
        console.log(`App listening to http://localhost:${PORT}/api/v1/`);
    });
}).catch((error) => {
    console.log({Error: error.message});
});
 