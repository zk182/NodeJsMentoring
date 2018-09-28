const axios = require('axios');
const redis = require('redis');
let testController = function (){

    let getPage = function(req, res){
        let url = req.query.url;
        
        const client = redis.createClient({
            port      : global.gConfig.node_port,
            host      : 'localhost'
        });


        const getRedisUrlData = () => {
            client.get(url, function(error, data) {
                if (error) throw error;
                return data;
            });
        }

        const fetchUrlData = () => {
            try {
                return await axios.get(url)
            } catch (error) {
                console.error(error)
            }
        }

        const resolveUrl = async () => {
            client.set(url, 'esta funcionando');
            const urlData = getRedisUrlData(url);
            if (urlData){
                //Expired
                console.log('existe');
                //Not expired
            }
            else {
                //Fetch
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