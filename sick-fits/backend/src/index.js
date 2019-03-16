const cookieParser = require( 'cookie-parser' );
const jwt = require( 'jsonwebtoken' );
require( 'dotenv' ).config( { path: '.env' } );
const createServer = require( './createServer' );
const db = require( './db' );

const server = createServer();

// use express middleware to handle cookies (JWT)
server.express.use( cookieParser() );

// decode JWT so we can get the user id on each request
server.express.use( ( req, res, next ) => {

    const { token } = req.cookies;

    if ( token ) {

        const { userId } = jwt.verify( token, process.env.APP_SECRET );

        // put the userId onto the req for future requests to access
        req.userId = userId;
    }

    next();

});

// TODO: use express middleware to populate current user
server.express.use( async ( req, res, next ) => {

    // if they aren't logged in, skip
    if ( !req.userId ) return next();

    // query the user that matches the userId
    const user = await db.query.user(
        { where: { id: req.userId } },
        '{ id, permissions, email, name }' /* gql code of what we want returned from the query */
    );

    req.user = user;

    next();
});

server.start( {
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, ( serverInfo ) => {

    console.log( `Server is now running on port http:/localhost:${ serverInfo.port }`);
} );