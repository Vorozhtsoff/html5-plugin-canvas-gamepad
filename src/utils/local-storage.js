const localStorageApi = window.localStorage;

const localStorage = {
    getItem: (...args) => JSON.parse(localStorageApi.getItem(...args)),
    setItem: (key, value) => localStorageApi.setItem(key, JSON.stringify(value)),
    removeItem: (...args) => localStorageApi.removeItem(...args),
    clear: localStorageApi.clear,
    getLength: () => localStorageApi.length
};

export default localStorage;

