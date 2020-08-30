const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const yup = require("yup");
const monk = require("monk");
const { nanoid } = require("nanoid")

require("dotenv").config();

const app = express();

const db = monk(process.env.MONGO_URI);
const urls = db.get("urls");

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "pug");

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().trim().url().required()
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/:id", async (req, res) => {
    const { id: slug } = req.params;
    try
    {
        const url = await urls.findOne({slug});
        if(url)
        {
            res.redirect(url.url);
        }
        else
        {
            res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        }
    }
    catch(error)
    {
        next(error);
    }
});

app.post("/url", async (req, res, next) => {
    let { url } = req.body;
    try
    {
        let slug = nanoid(5).toLowerCase();
        await schema.validate({
            slug,
            url
        });
        const created = await urls.insert({ url, slug });
        res.json(created);
    }
    catch(error)
    {
        next(error);
    }
});

app.use((error, req, res, next) => {
    res.status(400);
    res.json({
        message: error.message,
        stack: process.env.production === "production" ? "Error Unhandled" : error.stack
    });
    next();
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});