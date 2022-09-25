class Config {
    public vacationCount = 10;
    public baseURL = "http://localhost:3002/api";
    public authURL = `${this.baseURL}/auth`;
    public vacationsURL = `${this.baseURL}/vacations`;
    public imagesURL = `${this.baseURL}/images`;
    public destinationsURL = `${this.baseURL}/destinations`;
}

const config = new Config();
export default config;