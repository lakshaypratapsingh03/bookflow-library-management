import {createSlice} from "@reduxjs/toolkit";

const popupSlice = createSlice({
    name: "popup",
    initialState: {
        settingPopup: false,
        addBookPopup: false,
        readBookPopup: false,
        recordBookPopup: false,
        returnBookPopup: false,
        receiptPopup: false,
        addNewAdminPopup: false,
        addNewLibrarianPopup: false,
    },
    reducers:{
        toggleSettingPopup(state){
            state.settingPopup = !state.settingPopup;
        },
        toggleAddBookPopup(state){
            state.addBookPopup = !state.addBookPopup;
        },
         toggleReadBookPopup(state){
            state.readBookPopup = !state.readBookPopup;
        },
         toggleRecordBookPopup(state){
            state.recordBookPopup = !state.recordBookPopup;
        },
        
         toggleAddNewAdminPopup(state){
            state.addNewAdminPopup = !state.addNewAdminPopup;
        },
         toggleAddNewLibrarianPopup(state){
            state.addNewLibrarianPopup = !state.addNewLibrarianPopup;
        },
         toggleReturnBookPopup(state){
            state.returnBookPopup = !state.returnBookPopup;
        },
         toggleReceiptPopup(state){
            state.receiptPopup = !state.receiptPopup;
        },
        closeAllPopup(state){
            state.addBookPopup = false;
            state.addNewAdminPopup = false;
            state.addNewLibrarianPopup = false;
            state.readBookPopup = false;
            state.recordBookPopup = false;
            state.returnBookPopup = false;
            state.receiptPopup = false;
            state.settingPopup = false;
        },
    },
});

export const { 
    closeAllPopup,
    toggleAddBookPopup,
    toggleAddNewAdminPopup,
    toggleAddNewLibrarianPopup,
    toggleReadBookPopup,
    toggleRecordBookPopup,
    toggleReturnBookPopup,
    toggleReceiptPopup,
    toggleSettingPopup,
} = popupSlice.actions;

export default popupSlice.reducer;