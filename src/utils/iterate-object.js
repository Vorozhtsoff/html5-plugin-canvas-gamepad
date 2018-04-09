const iterateObject = (object, fn) => (
    Object.entries(object).forEach(([key, value]) => fn(key, value))
);

export default iterateObject;
