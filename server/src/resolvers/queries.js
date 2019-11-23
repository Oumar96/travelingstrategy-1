const graphql = require('graphql');
const countryTable = require('./countryToAll')
const countryToCountry = require('./countryToCountry')
const {country_languages,languages_table} = require('./languages')
const logger = require('../logger/logger.js')

logger.info("Querying with GraphQL")

var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        countryTable,
        countryToCountry,
        country_languages,
        languages_table
    }
});

module.exports = queryType