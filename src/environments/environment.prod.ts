export const environment = {
    production: false,
    auth: {
        domain: `sso.test.authrock.com`,
        clientId: `4WRplWBaxEr7c7782bA9ZePNr4WQ46GQ`,
        redirectUri: `${window.location.origin}/`,
        authorizationParams: {
            audience: "urn:ql-api:tapsizingtool-backend-220024:Test",
            redirect_uri: window.location.origin
        },
        useRefreshTokens: true,
        appUri: "https://tapsizingtool-test.amrock-sb.foc.zone/",
    },
    serverUrl: 'https://tapsizingtool-test.amrock-sb.foc.zone/',
    //serverUrl: 'https://localhost:7259/',
    tokenServerUrl: 'https://sso.test.authrock.com/oauth/token'
};