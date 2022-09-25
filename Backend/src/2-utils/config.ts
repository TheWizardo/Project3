import path from "path";

class Config {
    public port = "3002";
    public mysqlDatabase = "project3";
    public mysqlHost = "localhost";
    public mysqlUser = "root";
    public mysqlPassword = "";
    
    // public mysqlDatabase = "project3";
    // public mysqlHost = "project3.c7awgtjmgpxz.us-east-1.rds.amazonaws.com";
    // public mysqlUser = "admin";
    // public mysqlPassword = "IThinkYouAreWrongToWantAHeart";

    // public port = process.env.PORT;
    // public mysqlHost = process.env.MYSQL_HOST;
    // public mysqlUser = process.env.MYSQL_USER;
    // public mysqlPassword = process.env.MYSQL_PASSWORD;
    // public mysqlDatabase = process.env.MYSQL_DATABASE;
    public imagesFolder = path.resolve(__dirname, "..", "1-assets", "images");
}

const config = new Config();
export default config;