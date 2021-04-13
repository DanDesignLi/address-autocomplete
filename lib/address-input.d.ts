/// <reference types="react" />
import { AddressAutocompleteResult } from './address-autocomplete';
interface AddressInputParams {
    id: string;
    name: string;
    isValid?: boolean;
    isInvalid?: boolean;
    placeholder?: string;
    value?: string;
    setFieldValue: (name: string | undefined, value: string | undefined, options: AddressAutocompleteResult[]) => void;
    setFieldTouched: (name: string | undefined, value: boolean) => void;
}
export declare const AddressInput: ({ id, name, isValid, isInvalid, placeholder, value, setFieldValue, setFieldTouched }: AddressInputParams) => JSX.Element;
export {};
