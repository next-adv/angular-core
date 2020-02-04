export interface ICoreConfig {
auth?: {
    idField: string;
    pwdField: string;
};
restApi: {
    authRestEndpoint?: string;
    autoLoginRestEndpoint?: string;
    logoutRestEndpoint?: string;
    restEndpoint: string;
    mockRestEndpoint?: string;
    passwordRestoreEndpoint?: string;
    wordpressRestEndpoint?: string;
};
locale: string;
}