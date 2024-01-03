import "dotenv/config";
import statsPngCard from "./api/stats-png.js";
import express from "express";

const app = express();
app.listen(process.env.port || 9000);

app.get("/stats-png", statsPngCard);
