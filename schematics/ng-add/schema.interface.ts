export default interface ISchema {
    project: string;
    locale: 'en'|'it';
    authIdField: string;
    authPwdField: string;
    devServerUrl: string;
    path: string;
}
