import stripTags from "striptags";

function sanitize(req, res, next) {
    for (const prop of req.body) {
        if (typeof req.body[prop] === "string"){
            req.body[prop] = stripTags(req.body[prop]);
        }
    }
    next();
}

export default sanitize;