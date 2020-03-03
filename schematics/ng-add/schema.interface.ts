export default interface ISchema extends IEnv {
    project: string;
    path: string;
    loginPath: string;
    signUpPath: string;
    restorePwdPath: string;
}

export interface IEnv {
    production?: boolean;
    locale: 'en'|'it';
    authIdField: string;
    authPwdField: string;
    devServerUrl: string;
}
