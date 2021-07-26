const axios = require('axios');

const getActiveGames = async () => {
    try {
        const options = {
            url: 'http://localhost:3001/api/active-games',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        };

        const response = await axios(options);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const isUserInGame = async (userId) => {
    try {
        const options = {
            url: `http://localhost:3001/api/user-in-game/${userId}`,
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        };

        const response = await axios(options);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports = {
    getActiveGames,
    isUserInGame
};
