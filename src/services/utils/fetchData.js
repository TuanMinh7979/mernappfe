import axios from "../axios"
export const postAPI = async (url, post, token) => {
    const res = await axios.post(url, post, {
        headers: { Authorization: token },
    });

    return res;
};
export const getAPI = async (url, token) => {
    const res = await axios.get(url, {
        headers: { Authorization: token },
    });

    return res;
};

export const patchAPI = async (url, post, token) => {
    const res = await axios.patch(url, post, {
        headers: { Authorization: token },
    });

    return res;
};
export const putAPI = async (url, post, token) => {
    const res = await axios.put(url, post, {
        headers: { Authorization: token },
    });

    return res;
};
export const deleteAPI = async (url, token) => {
    const res = await axios.delete(url, {
        headers: { Authorization: token },
    });

    return res;
};
