# Auht0 Challenge Front-end

### Description

This spa (no routing, as it is meant to work as an independent module in Auth0's management console) checks if the users is authorized (if not, then shows the Auth0Lock signin box) and then prepends the Bearer token to requests to an api endpoint that will validate the users jwt in order to return the requested data.

When the user's JWT has expired this app will ask to refresh it and then continue with the ususal flow.

Based on code boilerplate, dev setup and build script from [AlejoFernandez](https://github.com/AlejoFernandez)'s [React Stylus Webpack Boilerplate](https://github.com/AlejoFernandez/react-stylus-webpack-boilerplate).


### Run

```sh
npm install
gulp serve
```

And then open up a browser to http://localhost:8080

### Build

```sh
npm install
gulp build
```


### Side Notes

- Auth0 use Auth0 for user authentication (why wouldn't they!). This repo takes an app I created in their management console. This code should work for their own management console simply by changing the CLIENT ID and DOMAIN used by their Auht0Lock js client.
- Uses gravatar to display the user's avatar. In an upgrade or new feature I'd rather have the API return the full user profile to display more information (or at least the same signature :: username table does not include the user's email)

