import { EnumLanguages } from 'spm-core';

export interface ISiteVariables {
    readonly id: number;
    readonly allowedLang: string[];
    readonly defLang: EnumLanguages;
    readonly mapCenter:
    {
        lng: number,
        lat: number
    };
    readonly androidAppId: string;
    readonly windowSize: {
        mobile: number;
        laptop: number;
    };
}

