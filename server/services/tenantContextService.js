
let currentTenant = null;
module.exports = {
    setTenant: (id) => { currentTenant = id; },
    getTenant: () => currentTenant
};
