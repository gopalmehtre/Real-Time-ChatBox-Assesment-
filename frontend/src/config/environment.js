const IS_PROD = false;

const SERVER_URL = IS_PROD 
  ? "https://your-backend-url.onrender.com"  
  : "http://localhost:8000";

export default SERVER_URL;