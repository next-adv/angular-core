export interface IEnv {
    production?: boolean;
    locale: 'en'|'it';
    authIdField: string;
    authPwdField: string;
    restEndpointList: {prefix: string; url: string}[];
    restPathList: {prefix: string; type: string; url: string}[];
}

export default interface ISchema extends IEnv {
    project: string;
    path: string;
    loginPath: string;
    signUpPath: string;
    restorePwdPath: string;
    devServerUrl: string;
    wpServerUrl: string;
}
