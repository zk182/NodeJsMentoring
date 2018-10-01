const axios = require('axios');
const client = require('../config/db.js')

let testController = function (){

    let getPage = function(req, res){
        let url = req.query.url;
        
        const getRedisUrlData = () => {
            client.get(url, function(error, data) {
                if (error) throw error;
                return data;
            });
        }

        const fetchUrlData = async () => {
            try {
                return await axios.get(url)
            } catch (error) {
                //console.error(error)
            }
        }

        const resolveUrl = async () => {
            client.set(url, 'hola');
            const urlData = getRedisUrlData(url);
            if (urlData){
                //Expired
                console.log('existe');
                //Not expired
            }
            else {
                //Fetch
                console.log('no existe');
                const fetchUrl = await fetchUrlData()
            }
        }

        /*
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
        */
        return resolveUrl();
    };

    return {
        getPage: getPage
    };
};

module.exports = testController;