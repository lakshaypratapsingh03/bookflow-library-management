import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toggleAddNewAdminPopup, toggleAddNewLibrarianPopup } from './popUpSlice';

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
    },

    reducers: {
        fetchAllUsersRequest(state) {
            state.loading = true;
        },

        fetchAllUsersSuccess(state, action) {
            state.loading = false;
            state.users = action.payload;
        },

        fetchAllUsersFailure(state, action) {
            state.loading = false;
            state.users = action.payload;

        },

        addNewAdminRequest(state) {
            state.loading = true;
        },
        addNewAdminSuccess(state) {
            state.loading = false;
        },
        addNewAdminFailure(state) {
            state.loading = false;
        },

        addNewLibrarianRequest(state) {
            state.loading = true;
        },
        addNewLibrarianSuccess(state) {
            state.loading = false;
        },
        addNewLibrarianFailure(state) {
            state.loading = false;
        },

    },

});

export const fetchAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUsersRequest());
    await axios.
        get("http://localhost:4000/api/v1/user/all", { withCredentials: true })
        .then(res => {
            dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
        })
        .catch(err => {
            dispatch(
                userSlice.actions.fetchAllUsersFailure(err.response.data.message)
            );

        });
};

export const addNewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addNewAdminRequest());
    await axios.
        post("http://localhost:4000/api/v1/user/add/new-admin", data, { withCredentials: true,
            headers: {"Content-Type": "multipart/form-data",
        }   
         })
        .then(res => {
            dispatch(userSlice.actions.addNewAdminSuccess());
            toast.success(res.data.message);
            dispatch(toggleAddNewAdminPopup());
            dispatch(fetchAllUsers());
        })
        .catch(err => {
        dispatch(userSlice.actions.addNewAdminFailure());
            toast.error(err.response.data.message);
        });
    };

export const addNewLibrarian = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addNewLibrarianRequest());
    await axios.
        post("http://localhost:4000/api/v1/user/add/new-librarian", data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        })
        .then(res => {
            dispatch(userSlice.actions.addNewLibrarianSuccess());
            toast.success(res.data.message);
            dispatch(toggleAddNewLibrarianPopup());
            dispatch(fetchAllUsers());
        })
        .catch(err => {
            dispatch(userSlice.actions.addNewLibrarianFailure());
            toast.error(err.response.data.message);
        });
    };

    export default userSlice.reducer;