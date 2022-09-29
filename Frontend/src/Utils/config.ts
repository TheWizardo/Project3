class Config {
    public vacationCount = 10;
    public baseURL = "http://localhost:3002/api";//"https://proj3-backend-production.up.railway.app/api";
    public authURL = `${this.baseURL}/auth`;
    public vacationsURL = `${this.baseURL}/vacations`;
    public imagesURL = `${this.baseURL}/images`;
    public destinationsURL = `${this.baseURL}/destinations`;
}

const config = new Config();
export default config;