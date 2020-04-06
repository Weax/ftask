import React, { ChangeEvent } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { GOOGLE_JS_URL } from '../../api/Google';
import { FormikProps, Field } from 'formik';

function loadScript(src: string, position: HTMLElement | null, id: string) {
    if (!position) {
        return;
    }

    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };
const placesService = { current: null };

const useStyles = makeStyles((theme) => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
}));

interface PlaceType {
    description: string;
    place_id: string;
    terms: {
        value: string;
    }[];
    types: [];
    structured_formatting: {
        main_text: string;
        secondary_text: string;
        main_text_matched_substrings: [
            {
                offset: number;
                length: number;
            },
        ];
    };
}

interface FormValues {
    [name: string]: string;
}

interface FieldProps {
    field: typeof Field;
    margin: TextFieldProps["margin"];
    form: FormikProps<FormValues>;
    onChange: (val: any) => any;
}

const FormikPlacesAutoComplete = ({
    field,
    field: { name },
    form: { errors, touched, isSubmitting },
    margin = "normal",
    onChange,
    ...props
}: FieldProps) => {
    const classes = useStyles();
    const [inputValue, setInputValue] = React.useState('');

    const [options, setOptions] = React.useState<PlaceType[]>([]);
    const loaded = React.useRef(false);

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#google-maps')) {
            loadScript(
                GOOGLE_JS_URL + '&libraries=places',
                document.querySelector('head'),
                'google-maps',
            );
        }

        loaded.current = true;
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const getPlaceDetails = (placeId: string) => {
        const request = {
            placeId: placeId,
            fields: ['name', 'address_component']
        };
        (placesService.current as any).getDetails(request, (place: any, status: string) => {
            if (status === 'OK') {
                const p = place.address_components;

                const [cityL] = p.filter((r: { types: string[] }) => r.types.includes("locality"));
                const [countryL] = p.filter((r: { types: string[] }) => r.types.includes("country"));
                const [codeL] = p.filter((r: { types: string[] }) => r.types.includes("postal_code"));
                const [houseL] = p.filter((r: { types: string[] }) => r.types.includes("street_number"));
                const [routeL] = p.filter((r: { types: string[] }) => r.types.includes("route"));

                const city = cityL ? cityL.long_name : "";
                const country = countryL ? countryL.long_name : "";
                const code = codeL ? codeL.long_name : "";
                const house = (routeL ? routeL.long_name : "") + (houseL ? " " + houseL.long_name : "");

                onChange({city, country, code, house});
            }
        });
    }

    const handleOptionSelect = (place: PlaceType | null) => {
        if (place) {
            getPlaceDetails(place.place_id);            
        }
    }

    const fetchPredictions = React.useMemo(() =>
        throttle((request: { input: string }, callback: (results?: PlaceType[]) => void) => {
            (autocompleteService.current as any).getPlacePredictions(request, callback);
        }, 200),
        [],
    );

    React.useEffect(() => {
        let active = true;

        if (!autocompleteService.current && (window as any).google) {
            //autocomplete Service for displaying suggestions as MUI Autocomplete options
            autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
        }
        if (!placesService.current && (window as any).google) {
            //we need to pass map element to PlacesService... 
            const map = new (window as any).google.maps.Map(document.getElementById(`gMap${name}`) as HTMLElement);
            placesService.current = new (window as any).google.maps.places.PlacesService(map);
        }
        if (!autocompleteService.current || !placesService.current) {
            return undefined;
        }

        if (inputValue === '') {
            setOptions([]);
            return undefined;
        }

        fetchPredictions({ input: inputValue }, (results?: PlaceType[]) => {
            if (active) {
                setOptions(results || []);
            }
        });

        return () => {
            active = false;
        };
    }, [inputValue, fetchPredictions, name]);

    const hasError = (errors[name] && touched[name]) || false;

    return (
        <>
            <div id={`gMap${name}`}></div>
            <Autocomplete
                disabled={isSubmitting}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
                onChange={(event: ChangeEvent<{}>, newValue: PlaceType | null) => {
                    handleOptionSelect(newValue);
                }}
                filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        onChange={handleInputChange}
                        margin={margin}
                        error={hasError}
                        helperText={hasError && errors[name]}
                        {...props}
                    />
                )}
                renderOption={(option) => {
                    const matches = option.structured_formatting.main_text_matched_substrings;
                    const parts = parse(
                        option.structured_formatting.main_text,
                        matches.map((match: any) => [match.offset, match.offset + match.length]),
                    );

                    return (
                        <Grid container alignItems="center">
                            <Grid item>
                                <LocationOnIcon className={classes.icon} />
                            </Grid>
                            <Grid item xs>
                                {parts.map((part, index) => (
                                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                        {part.text}
                                    </span>
                                ))}
                                <Typography variant="body2" color="textSecondary">
                                    {option.structured_formatting.secondary_text}
                                </Typography>
                            </Grid>
                        </Grid>
                    );
                }}
            />
        </>
    );
}

export default FormikPlacesAutoComplete;