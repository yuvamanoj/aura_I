const AUTHENTICATION_API_URL = process.env.AUTHENTICATION_API_URL || "https://services.sec.ibm.com:443/micro/authentication/login";
const CREDENTIALS_API = process.env.CREDENTIALS_API || "https://aura-credentials-ms-xpp.apps-priv.dal09-dev-ocp-01.cl.sec.ibm.com";
const USER_API = process.env.USER_API || "https://aura-user-ms-xpp.apps-priv.dal09-dev-ocp-01.cl.sec.ibm.com/users";
const JWT_API = process.env.JWT_API || "https://services.sec.ibm.com:443/micro/jwt_provider";
const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME || 1200;
const TEST_PASS = process.env.TEST_PASS || "testpass";
const TEST_USER = process.env.TEST_USER | "testuser";
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || "TOKEN_SECRET_KEY#1234**";

module.exports = {
    AUTHENTICATION_API_URL,
    CREDENTIALS_API,
    USER_API,
    JWT_API,
    ACCESS_TOKEN_EXPIRATION_TIME,
    TEST_USER,
    TEST_PASS,
    TOKEN_SECRET_KEY
}