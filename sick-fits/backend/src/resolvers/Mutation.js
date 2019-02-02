const Mutations = {
    createDog( parent, args, ctx, info ) {
        // Create a dog
        global.dogs = global.dogs || [];
        const newDog = { name: args.name };
        global.dogs.push( newDog );
        // console.log( 'args', args );
        return newDog;
    }
};

module.exports = Mutations;
