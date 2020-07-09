Simple app for running query's on twitter Api.
user has the ability to drag tweets to saved list and retrieve them after refresh.

Please note:
in order for the app to run, an .env file need to be provided in the root of the app and which would include:   
    CONSUMER_KEY='your-consumer-key'
    CONSUMER_SECRET='your-consumer-secret'

this is neccessary for twitter api authentication.
The application uses a proxy server (implemented in express) to overcome no-cors issues present on twitter api.

to run the app, please clone and run the following commands:

yarn install
yarn dev
