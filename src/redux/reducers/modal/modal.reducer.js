import { createSlice } from "@reduxjs/toolkit"
import { startOfYesterday } from "date-fns"
import { FaSleigh } from "react-icons/fa"
const initialState = {
    type: '',
    isOpen: false,

    data: null,
    isFeelingOpen: false,
    isFileDialogOpen: false,
    isGifModalOpen: false,
    isReactionsModalOpen: false,
    isCommentsModalOpen: false,
    isDeleteDialogOpen: false

}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action) => {
            console.log("OPEN MODAL");
            const { type, data } = action.payload
            state.isOpen = true;
            
            state.type = type;
            state.data = data
        },

        closeModal: (state) => {
            state.isOpen = false;
            state.type = '';
            state.data = null;
            state.isFeelingOpen = false;
            state.isGifModalOpen = false;
            state.isReactionsModalOpen = false;
            state.isCommentsModalOpen = false;
            state.isFileDialogOpen = false;
          
            state.isDeleteDialogOpen = false;
        },

        updateModalIsFileDialogOpen: (state, action) => {
            state.isFileDialogOpen = action.payload;
        },

        updateModalIsFeelingOpen: (state, action) => {
            state.isFeelingOpen = action.payload;
        },
        updateModalIsGifModalOpen: (state, action) => {
            state.isGifModalOpen = action.payload;
        },
        updateIsReactionsModalOpen: (state, action) => {
            state.isReactionsModalOpen = action.payload;
        },
        updateModalIsCommentsModalOpen: (state, action) => {
            state.isCommentsModalOpen = action.payload;
        },
        updateModalIsDeleteDialogOpen: (state, action) => {
       
            state.isDeleteDialogOpen = action.payload;
         
        }
    }
})


export const {
    openModal,
    closeModal,

    updateModalIsFileDialogOpen,
    updateModalIsFeelingOpen,
    updateModalIsGifModalOpen,
    updateIsReactionsModalOpen,
    updateModalIsCommentsModalOpen,
    updateModalIsDeleteDialogOpen
} = modalSlice.actions;
export default modalSlice.reducer;