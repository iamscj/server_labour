import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Router from "./routes/route.js";

const app = express();
app.use(cors());
app.use(bodyParser.json({ extented: true }))
app.use(express.urlencoded({ extended: true }))

app.use('/', Router);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running successfully on PORT ${PORT}`)
})