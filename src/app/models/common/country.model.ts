export class Country {
    name: string;
    topLevelDomain: string[];
    alpha2Code: string;
    alpha3Code: string;
    callingCodes: string[];
    capital: string;
    altSpellings: string[];
    subregion: string;
    region: string;
    population: number;
    latlng: number[];
    demonym: string;
    area: number;
    gini: number;
    timezones: string[];
    borders: string[];
    nativeName: string;
    numericCode: string;
    flags: {
        svg: string;
        png: string;
    };
    currencies: CountryCurrency[];
    languages: CountryLanguage[];
    translations: CountryTranslation;
    flag: string;
    regionalBlocs: CountryRegionalBloc[];
    cioc: string;
    independent: boolean;
}

export class CountryCurrency {
    code: string;
    name: string;
    symbol: string;
}

export class CountryLanguage {
    iso639_1: string;
    iso639_2: string;
    name: string;
    nativeName: string;
}

export class CountryTranslation {
    br: string;
    pt: string;
    nl: string;
    hr: string;
    fa: string;
    de: string;
    es: string;
    fr: string;
    ja: string;
    it: string;
    hu: string;
}

export class CountryRegionalBloc {
    acronym: string;
    name: string;
    otherAcronyms: string[];
    otherNames: string[];
}
