const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const favicon = require("serve-favicon");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("express-handlebars");
const moment = require("moment");

// Routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const registrationRouter = require("./routes/registration");
const postvideoRouter = require("./routes/postvideo");
const viewpostRouter = require("./routes/viewpost");
const profileRouter = require("./routes/profile");
const logoutRouter = require("./routes/logout");
const likeRouter = require('./routes/like');
const commentRouter = require('./routes/comment');

const app = express();

// View engine setup
app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"), //where to look for layouts
        partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
        extname: ".hbs", //expected file extension for handlebars files
        defaultLayout: "layout", //default layout for app, general template for all pages in app
        helpers: {
            formatDate: (date, format) => moment(date).format(format)
        }
    })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files & favicon
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Session setup
app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // true only if using HTTPS
    })
);

// Make session accessible in views
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Routes
app.use("/", indexRouter); // route middleware from ./routes/index.js
app.use("/users", usersRouter); // route middleware from ./routes/users.js
app.use("/login", loginRouter); // route middleware from ./routes/login.js
app.use("/registration", registrationRouter); // route middleware from ./routes/registration.js
app.use("/postvideo", postvideoRouter); // route middleware from ./routes/postvideo.js
app.use("/viewpost", viewpostRouter); // route middleware from ./routes/viewpost.js
app.use("/profile", profileRouter); // route middleware from ./routes/profile.js
app.use("/logout", logoutRouter); // route middleware from ./routes/logout.js
app.use('/like', likeRouter); // route middleware from ./routes/like.js
app.use('/comment', commentRouter); // route middleware from ./routes/comment.js

/**
 * Catch all route, if we get to here then the
 * resource requested could not be found.
 */
app.use((req,res,next) => {
    next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})


/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = err;
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
