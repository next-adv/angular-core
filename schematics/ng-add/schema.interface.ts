export default interface ISchema extends IEnv {
    project: string;
    path: string;
}

export interface IEnv {
    locale: 'en'|'it';
    authIdField: string;
    authPwdField: string;
    devServerUrl: string;
}
