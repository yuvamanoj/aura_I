# SOURCE: https://github.ibm.com/managed-security/msscertimg-nodejs-12/blob/master/Dockerfile
FROM mss-docker.artifactory.swg-devops.com/msscertimg-nodejs-12:latest
# https://nodejs.org/de/docs/guides/nodejs-docker-webapp/#creating-a-dockerfile
COPY . .
RUN npm ci
EXPOSE 3000/tcp
# NOTE: don't add CMD, it's in base IMG and uses `npm run start`

ENV NODE_ENV=production
ENV TOKEN_INITIALS=Basic
ENV AUTHENTICATION_API_URL=https://services.sec.ibm.com:443/micro/authentication/login
ENV CREDENTIALS_API=https://aura-credentials-ms-container-xpp.apps-priv.dal09-dev-ocp-01.cl.sec.ibm.com
ENV JWT_API=https://services.sec.ibm.com:443/micro/jwt_provider
ENV USER_API=https://aura-user-ms-xpp.apps-priv.dal09-dev-ocp-01.cl.sec.ibm.com/users
ENV APP_DIRECTORY=client/build
ENV HTML_INDEX=index.html
