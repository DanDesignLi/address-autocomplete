import React, { Fragment, useState, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import {AddressAutocompleteResult, FallbackAddressAutocomplete} from './address-autocomplete'

interface AddressInputParams {
    id: string;
    name: string;
    isValid?: boolean;
    isInvalid?: boolean;
    placeholder?: string;
    value?: string;
    setFieldValue: (name: string|undefined, value: AddressAutocompleteResult[]) => void
    setFieldTouched: (name: string|undefined, value: boolean) => void,
    emptyLabel: React.ReactNode;
    searchText: React.ReactNode;
    onKeyDown?: any
}

// This is prepared to use Formik
export const AddressInput = ({ id, name, isValid, isInvalid, placeholder, value, setFieldValue, setFieldTouched, emptyLabel, searchText, onKeyDown }: AddressInputParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const _instance = useRef(null);
  let _forceOpen = undefined
  const handleSearch = (query: string) => {
    setIsLoading(true);

    //This will search for the address first in Dawa, if no addresses found, then google
    FallbackAddressAutocomplete(query, "dawa", "google").then((items) => {
      setOptions(items);
      setIsLoading(false);
    });
  };

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  const onChange = (selected: any) => {
      const reshow = (selected.length > 0 && !selected[0].complete);
      if (reshow && !_instance.current.isMenuShown) {
          _instance.current.toggleMenu();
      } else {
          setFieldValue && setFieldValue(name, selected);
      }
  }

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id={id}
      /*name={name}*/
      isLoading={isLoading}
      minLength={3}
      emptyLabel={emptyLabel}
      searchText={searchText}
      labelKey="text"
      isValid={isValid}
      isInvalid={isInvalid}
      className={(isInvalid ? 'is-invalid' : '') + ' ' + (isValid ? 'is-valid' : '')}
      onSearch={handleSearch}
      open={_forceOpen}
      options={options}
      onChange={onChange}
      onKeyDown={onKeyDown}
      /*onInputChange={(text, event) => setFieldValue && setFieldValue(name, text)}*/
      onBlur={(e: any) => setFieldTouched && setFieldTouched(name, true)}
      placeholder={placeholder}
      ref={_instance}
      defaultInputValue={value}
      renderMenuItemChildren={(option, props) => (
        <Fragment>
          <span>{(option as any).address}</span>
        </Fragment>
      )}
    />
  );
};
