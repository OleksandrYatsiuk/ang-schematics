export interface ISiteVariablesSchema {
    path: string;
    project?: any;
    declare: boolean;
    module: string;
    insertInterface: boolean;
    variables: {
        id: number,
        allowedLang: string[],
        defLang: string,
        mapCenter: {
            lat: number,
            lng: number
        },
        androidAppId: string | null,
        windowSize: {
            mobile: number,
            laptop: number,
        }
    }
}

export class ModelSiteVariables implements Partial<ISiteVariablesSchema['variables']> {
    id: number;
    allowedLang: string[];
    defLang: string;
    mapCenter: {
        lat: number,
        lng: number
    };
    androidAppId: string | null;
    windowSize: {
        mobile: number;
        laptop: number;
    }
    constructor({
        id = 1,
        allowedLang = [],
        defLang = 'uk',
        androidAppId = null,
        mapCenter = {
            lat: 50.43,
            lng: 30.51
        },
        windowSize = {
            mobile: 768,
            laptop: 1280
        }
    }: Partial<ISiteVariablesSchema['variables']> = {}) {
        this.id = +id;
        this.allowedLang = allowedLang;
        this.defLang = defLang;
        this.androidAppId = androidAppId;
        this.mapCenter = {
            lat: +mapCenter.lat,
            lng: +mapCenter.lng
        }
        this.windowSize = {
            mobile: +windowSize.mobile,
            laptop: +windowSize.laptop
        }
    }
}