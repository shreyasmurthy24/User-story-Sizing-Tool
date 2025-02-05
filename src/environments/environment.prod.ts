export const environment = {
    production: false,
    auth: {
        domain: `sso.test.authrock.com`,
        clientId: `4WRplWBaxEr7c7782bA9ZePNr4WQ46GQ`,
        redirectUri: `${window.location.origin}/`,
        authorizationParams: {
            audience: "urn:ql-api:sizingtool-backend-220024:Test",
            redirect_uri: window.location.origin
        },
        useRefreshTokens: true,
        appUri: "https://sizingtool-test.amrock-sb.foc.zone/",
    },
    serverUrl: 'https://sizingtool-test.amrock-sb.foc.zone/',
    //serverUrl: 'https://localhost:7259/',
    tokenServerUrl: 'https://sso.test.authrock.com/oauth/token'
};