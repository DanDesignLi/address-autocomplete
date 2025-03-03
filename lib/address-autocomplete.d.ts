type AddressAutocompleteParams = {
    country?: string;
    provider?: string;
    text: string;
};
export interface AddressAutocompleteResult {
    text: string;
    address: string;
    complete: boolean;
    location: {
        lat: number;
        lon: number;
    };
    extra?: {
        [key: string]: any;
    };
}
export declare const AddressAutocomplete: (params: AddressAutocompleteParams) => Promise<AddressAutocompleteResult[]>;
export declare const FallbackAddressAutocomplete: (text: string, primary: string, secondary: string) => Promise<AddressAutocompleteResult[]>;
export declare const DawaAddressAutocomplete: (text: string, fuzzy?: boolean) => Promise<Array<AddressAutocompleteResult>>;
export declare const GoogleAddressAutocomplete: (text: string, fuzzy?: boolean) => Promise<Array<AddressAutocompleteResult>>;
export declare const DemoAddressAutocomplete: (text: string) => Promise<Array<AddressAutocompleteResult>>;
export {};
