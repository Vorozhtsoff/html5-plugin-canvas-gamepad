import md5 from 'md5';

const generateId = (keyWord = 'Сиськи!!!') => md5(`${Date.now()}${keyWord}`);

export default generateId;
