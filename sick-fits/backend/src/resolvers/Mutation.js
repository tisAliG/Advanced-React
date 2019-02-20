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
    }
};

module.exports = Mutations;
