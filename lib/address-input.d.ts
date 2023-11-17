import React from 'react';
import { AddressAutocompleteResult } from './address-autocomplete';
interface AddressInputParams {
    id: string;
    name: string;
    isValid?: boolean;
    isInvalid?: boolean;
    placeholder?: string;
    value?: string;
    setFieldValue: (name: string | undefined, value: AddressAutocompleteResult[]) => void;
    setFieldTouched: (name: string | undefined, value: boolean) => void;
    emptyLabel: React.ReactNode;
    searchText: React.ReactNode;
    onKeyDown?: any

}
export declare const AddressInput: ({ id, name, isValid, isInvalid, placeholder, value, setFieldValue, setFieldTouched, emptyLabel, searchText, onKeyDown }: AddressInputParams) => JSX.Element;
export {};
