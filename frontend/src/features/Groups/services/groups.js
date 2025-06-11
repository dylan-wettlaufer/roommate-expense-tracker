import api from "../../../services/api";

export const createGroup = async (name, description) => {
    const response = await api.post('/groups/create', { name, description });
    return response.data;
};

export const viewGroups = async () => {
    const response = await api.get('/groups/all');
    return response.data;
};

export const joinGroup = async (invite_code) => {
    const response = await api.post('/groups/join', { invite_code });
    return response.data;
};

export const viewGroup = async (id) => {
    const response = await api.get(`/groups/single/${id}`);
    return response.data;
}

export const getGroupMembers = async (group_id) => {
    const response = await api.get(`/groups/get-members/${group_id}`);
    var users = [];
    
    for (let i = 0; i < response.data.length; i++) {
        var temp = await api.get(`/users/single/${response.data[i].user_id}`);
        users.push(temp.data);
    }

    return users;
}