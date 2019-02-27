const bcrypt = require( 'bcryptjs' );
const jwt = require( 'jsonwebtoken' );

const Mutations = {
    // createDog( parent, args, ctx, info ) {
    //     // Create a dog
    //     global.dogs = global.dogs || [];
    //     const newDog = { name: args.name };
    //     global.dogs.push( newDog );
    //     // console.log( 'args', args );
    //     return newDog;
    // }
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

        // Hash the users password so that the direct password isn't in the db, and pass `10` as the "salt" which makes sure no matter how many times they use their password no db will have the same hash
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
        const token = jwt.sign( { user: user.id }, process.env.APP_SECRET );

        // set the token in a cookie on the response (so they can stay logged in)
        ctx.response.cookie( 'token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie (milliseconds, seconds, minutes, hours, days)
        } );

        // finally we can return the user to the browser
        return user;
    }
};

module.exports = Mutations;
