const localStorageApi = window.localStorage;

const localStorage = {
    getItem: (...args) => JSON.parse(localStorageApi.getItem(...args)),
    removeItem: (...args) => JSON.stringify(localStorageApi.removeItem(...args)),
    clear: localStorageApi.clear,
    getLength: () => localStorageApi.length
};

export default localStorage;

