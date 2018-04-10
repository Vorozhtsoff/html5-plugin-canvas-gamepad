import generateId from '../utils/generate-id';
import localStorage from '../utils/local-storage';

const auth = () => {
    const id = localStorage.getItem('id');
    if (!id) {
        localStorage.setItem('id', generateId());
        return auth();
    }

    return id;
};

export default auth;
