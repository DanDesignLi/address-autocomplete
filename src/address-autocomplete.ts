

const formatParams = params => {
  return Object.keys(params).map(paramName => {
    const paramValue = params[paramName];
    return `${paramName}=${encodeURIComponent(paramValue)}`;
  }).join('&');
};


type AddressAutocompleteParams = {
  country?: string,
  provider?: string,
  text: string,
};

export interface AddressAutocompleteResult {
  text: string;
  address: string;
  complete: boolean;
  location: { lat: number, lon: number };
  extra?: {[key: string]: any}
}


export const AddressAutocomplete = function (params: AddressAutocompleteParams) {

  params = Object.assign({
    country: "",
    provider: "",
    text: ""
  }, params || {});

  if (!params.provider) {
    switch (params.country) {
      case "dk":
        params.provider = "dawa";
        break

      case "us":
      case "row":
        params.provider = "google";
        break

      default:
        params.provider = "demo";
    }
  }

  return _resolveAutocomplete(params.provider, params.text, true)
}

const _resolveAutocomplete = function (provider: string, text: string, fuzzy: boolean = true) {

  switch (provider) {
    case "dawa":
      return DawaAddressAutocomplete(text, fuzzy);
    case "google":
      return GoogleAddressAutocomplete(text, fuzzy);
    case "demo":
      return DemoAddressAutocomplete(text);
  }
}

export const FallbackAddressAutocomplete = async function (text: string, primary: string, secondary: string) {
  let result = await _resolveAutocomplete(primary, text, false)
  if (result.length > 0)
    return result
  else
    return _resolveAutocomplete(secondary, text, true)
}


export const DawaAddressAutocomplete = async function (text: string, fuzzy: boolean = true): Promise<Array<AddressAutocompleteResult>> {

  const options = {
    baseUrl: 'https://dawa.aws.dk',
  }

  const params = {
    q: text,
    type: 'adresse',
    multilinje: false,
    adgangsadresserOnly: true,
    stormodtagerpostnumre: true,
    supplerendebynavn: true,
    fuzzy: fuzzy,
    noformat: "y", //optimize network
  };

  const result = await fetch(`${options.baseUrl}/autocomplete?${formatParams(params)}`);
  const items = await result.json();
  const results = items.map((i) => ({
    text: i.tekst.replace(", ,", ','), // for some reason dawa sometimes returns ", ," it looks ugly
    address: i.forslagstekst.replace(", ,", ','), // for some reason dawa sometimes returns ", ," it looks ugly
    complete: (i.type == "adresse" || i.type == "adgangsadresse"),
    location: { lat: i.data.y, lon: i.data.x },
    extra: {
      dawa_id: i.data?.id,
      zipcode: i.data?.postnr
    },
    _dawa_type: i.type,
  }) as AddressAutocompleteResult);
  return results;
}

let autocompleteService: google.maps.places.AutocompleteService;


export const GoogleAddressAutocomplete = async function (text: string, fuzzy: boolean = true): Promise<Array<AddressAutocompleteResult>> {

  if (!(window as any).google) {
    console.warn(`'google' is not defined`);
    return;
  }

  if (!autocompleteService) {
    autocompleteService = new google.maps.places.AutocompleteService();
  }

  const service = new google.maps.places.AutocompleteService();

  return new Promise((resolve, reject) => {

    //TODO: Move the bias out of the inner function
    service.getQueryPredictions({ input: text, location: new google.maps.LatLng(55.8, 10.5), radius:  600000}, function(predictions, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
        reject(status);
      }
      let result = predictions?.map((item, index) => {
        return {
          text: item.description,
          address: item.description,
          complete: true,
          location: { lat: 0, lon: 0 },
          _google_place_id: item.place_id
        }
      });
      resolve(result);
    });

  }) 
}


export const DemoAddressAutocomplete = async function (text: string): Promise<Array<AddressAutocompleteResult>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          text: "Demovej 1",
          address: "Demovej 1",
          complete: true,
          location: { lat: 55.1, lon: 11.4 }
        }

      ]);
    }, 300);
  })
}

