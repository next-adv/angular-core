export interface ICoreConfig {
    auth?: {
        idField: string;
        pwdField: string;
    };
    restApi: {
        // authRestPath?: string;
        // autoLoginRestPath?: string;
        // logoutRestEndpoint?: string;
        restEndpointList: IEndpointUrl[];
        restPathList: IPathUrl[];
        mockRestEndpoint?: string;
        // passwordRestorePath?: string;
        // wordpressRestPath?: string;
    };
    locale: string;
}

export interface IEndpointUrl {
    prefix: string;
    url: string;
}

export interface IPathUrl extends IEndpointUrl {
    type: string;
}
