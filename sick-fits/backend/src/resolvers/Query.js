const Query = {

    dogs( parent, args, ctx, info ) {
        global.dogs = global.dogs || [];
        return global.dogs;
        // return [ { name: 'Oliver' }, { name: 'Salty' } ]
    }
};

module.exports = Query;
