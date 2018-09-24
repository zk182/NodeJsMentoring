const axios = require('axios');
const redis = require('redis');
let testController = function (){

    let getPage = function(req, res){
        let url = req.query.url;
        const getBreeds = async () => {
            try {
              return await axios.get('https://dog.ceo/api/breeds/list/all')
            } catch (error) {
              console.error(error)
            }
        }

        const countBreeds = async () => {
            const breeds = await getBreeds()
          
            if (breeds.data.message) {
              res.send(`Got ${Object.entries(breeds.data.message).length} breeds`);
            }
        }

        return countBreeds();
    };

    return {
        getPage: getPage
    };
};

module.exports = testController;