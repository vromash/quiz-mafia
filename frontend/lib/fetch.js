const getActiveGames = async () => {
    const res = await fetch('http://localhost:3001/api/active-games');
    return res.json();
};

const isUserInGame = async (userId) => {
    const res = await fetch(`http://localhost:3001/api/user-in-game/${userId}`);
    return res.json();
};

module.exports = {
    getActiveGames,
    isUserInGame
};
