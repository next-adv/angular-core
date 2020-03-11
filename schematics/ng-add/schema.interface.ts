export interface IEnv {
    production?: boolean;
    locale: 'en'|'it';
    'ngc:authIdField': string;
    'ngc:authPwdField': string;
    'ngc:restEndpointList': {prefix: string; url: string}[];
    'ngc:restPathList': {prefix: string; type: string; url: string}[];
}

export default interface ISchema {
    project: string;
    path: string;
    loginPath: string;
    signUpPath: string;
    restorePwdPath: string;
    devServerUrl: string;
    wpServerUrl: string;
    authIdField: string;
    authPwdField: string;
    locale: 'en'|'it';
}
