## Test app

About the app:

Inside src/api folder You will see apiBuilder component. This way I tried to mimic operations with localStorage like with traditional API's. I found this approach more reusable for the future app scaling than persisting State object using Redux middleware, store.subscribe() or else.

During development I tried to make components as reusable as possible. I didn't use Redux store for table and autocomplete parts with purpose of making them independent as much as possible.

Dealing with Google Maps API is always a challenge. Note the autocomplete - it uses Google places AutocompleteService for creating suggestion options, but this service doesn't return enough data for address fields. Therefore we need to access second service for place details. Another option was using plain old Google Autocomplete (without "Service" suffix), but it's ugly:)

## Available Scripts

In the project directory, you should run:

### `npm install`

then 

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.