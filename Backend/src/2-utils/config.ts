import path from "path";

class Config {
    public port = "3001";
    public mysqlDatabase = "project3";
    public mysqlHost = "localhost";
    public mysqlUser = "root";
    public mysqlPassword = "";
    public imagesFolder = path.resolve(__dirname, "..", "1-assets", "images");
}

const config = new Config();
export default config;