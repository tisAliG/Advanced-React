const bcrypt = require( 'bcryptjs' );
const jwt = require( 'jsonwebtoken' );
const { promisify } = require( 'util' );
const { randomBytes } = require( 'crypto' );
const { transport, makeANiceEmail } = require( '../mail' );

const Mutations = {
    async createItem( parent, args, ctx, info ) {

        // TODO: check if they are logged in

        // all these functions from our database return promises
        const item = await ctx.db.mutation.createItem( {
            data: {
                ...args
            }
        }, info );

        return item;
    },
    updateItem( parent, args, ctx, info ) {

        // first take a copy of the updates
        const updates = { ...args };

        // remove the id from the updates
        delete updates.id;

        // run the update method
        return ctx.db.mutation.updateItem( {
            data: updates,
            where: {
                id: args.id
            }
        }, info );
    },
    async deleteItem( parent, args, ctx, info ) {

        const where = { id: args.id };

        // 1. Find the item
        const item = await ctx.db.query.item( { where }, `{ id title }` );

        // 2. Check if they own that item, or have the permissions
        // TODO
        // 3. Delete it

        return ctx.db.mutation.deleteItem( { where }, info );

    },
    async signup( parent, args, ctx, info ) {

        // lowercase the email so that there are no issues if they use capitols certain times when they login
        args.email = args.email.toLowerCase();

        // Hash the users password so that the direct password isn't in the db, and pass `10` as the "salt" which makes sure no matter how many times they use that same password no db will have the same hash
        const password = await bcrypt.hash( args.password, 10 );

        // create the new user in the db
        const user = await ctx.db.mutation.createUser( {
            data: {
                ...args,
                password,
                permissions: { 'set': [ 'USER' ] }
            }
        }, info );

        // create JWT token for the user (so they can stay logged in)
        const token = jwt.sign( { userId: user.id }, process.env.APP_SECRET );

        // set the token in a cookie on the response (so they can stay logged in)
        ctx.response.cookie( 'token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie (milliseconds, seconds, minutes, hours, days)
        } );

        // finally we can return the user to the browser
        return user;
    },
    async signin( parent, { email, password }, ctx, info ) {

        // 1. Check if there is a user with that email
        const user = await ctx.db.query.user( { where: { email } } );
        if ( !user ) {
            throw new Error( `No such user found with ${ email }.` );
        }

        // 2. Check if the password is correct (password that came from the form, and password in the db)
        const valid = await bcrypt.compare( password, user.password );
        if ( !valid ) {
            throw new Error( 'Invalid password.' );
        }

        // 3. Generate JWT token
        const token = jwt.sign( { userId: user.id }, process.env.APP_SECRET );

        // 4. Set token as cookie
        ctx.response.cookie( 'token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        } );

        // 5. Return the user
        return user;
    },
    signout( parent, args, ctx, info ) {

        ctx.response.clearCookie( 'token' );
        return { message: 'logged out!' };
    },
    async requestReset( parent, args, ctx, info ) {

        // 1. Check if this is a real user
        const user = await ctx.db.query.user( { where: { email: args.email } } );

        if ( !user ) {
            throw new Error(`No such user found for email ${ args.email }`);
        }

        // 2. Set a reset token and expiry on that user
        const randomBytesPromisified = promisify( randomBytes );
        const resetToken = ( await randomBytesPromisified( 20 ) ).toString( 'hex' );
        const resetTokenExpiry = Date.now() + 3600000; //one hour
        const res = await ctx.db.mutation.updateUser( {
            where: { email: args.email },
            data: { resetToken, resetTokenExpiry }
        } );


        // 3. Email them that reset token
        const mailRes = await transport.sendMail( {
            from: 'ali.groening@gmail.com',
            to: user.email,
            subject: 'Your password reset token',
            html: makeANiceEmail( `
                Your password reset token is here!
                \n
                <a href=${ process.env.FRONTEND_URL }/reset?resetToken=${ resetToken }>Click here to reset!</a>
            ` )
        } );

        // 4. Return success message text
        return{ message: 'Thanks!' };
    },
    async resetPassword( parent, args, ctx, info ) {

        // 1. check if the passwords match (can be done on the clientside instead)
        if ( args.password !== args.confirmPassword ) {

            throw new Error( 'The passwords do not match' );
        }

        // 2. check if its a legit reset token (as in is there one that is the same as this in the db)
        // 3. check if its expired
        const [ user ] = await ctx.db.query.users( {
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000
            }
        } );

        if ( !user ) {
            throw new Error( 'This token is either invalid or expired.' );
        }

        // 4. hash the new password
        const password = await bcrypt.hash( args.password, 10 );

        // 5. save the new password to the user and remove reset token fields
        const updatedUser = await ctx.db.mutation.updateUser( {
            where: { id: user.id },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null
            }
        } );

        // 6. generate jwt
        const token = jwt.sign( { userId: updatedUser.id }, process.env.APP_SECRET );

        // 7. set the jwt cookie
        ctx.response.cookie( 'token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        } );

        // 8. return the new user
        return updatedUser;
    }
};

module.exports = Mutations;
