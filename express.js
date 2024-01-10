import "dotenv/config";
import stats from "./api/index.js";
import express from "express";

const app = express();
app.listen(process.env.port || 9000);

app.get("/", stats);
