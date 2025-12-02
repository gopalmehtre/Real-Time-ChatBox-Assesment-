const IS_PROD = true;

const SERVER_URL = IS_PROD 
  ? "https://chatbox-backend-3p39.onrender.com"  
  : "http://localhost:8000";

export default SERVER_URL;