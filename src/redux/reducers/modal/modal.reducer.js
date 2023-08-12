import { createSlice } from "@reduxjs/toolkit"
import { startOfYesterday } from "date-fns"
import { FaSleigh } from "react-icons/fa"
const initialState = {
    type: '',
    isOpen: false,
    feeling: '',
    image: '',
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
            state.feeling = '';
            state.image = '';
            state.data = null;
            state.isFeelingOpen = false;
            state.isGifModalOpen = false;
            state.isReactionsModalOpen = false;
            state.isCommentsModalOpen = false;
            state.isFileDialogOpen = false;
          
            state.isDeleteDialogOpen = false;
        },
        updModalFeeling: (state, action) => {
          
            const { feeling } = action.payload;
            state.feeling = feeling;
        },
        updModalIsFileDialogOpen: (state, action) => {
            state.isFileDialogOpen = action.payload;
        },

        updModalIsFeelingOpen: (state, action) => {
            state.isFeelingOpen = action.payload;
        },
        updModalIsGifModalOpen: (state, action) => {
            state.isGifModalOpen = action.payload;
        },
        updIsReactionsModalOpen: (state, action) => {
            state.isReactionsModalOpen = action.payload;
        },
        updModalIsCommentsModalOpen: (state, action) => {
            state.isCommentsModalOpen = action.payload;
        },
        updModalIsDeleteDialogOpen: (state, action) => {
            const { data, toggle } = action.payload;
            state.isDeleteDialogOpen = toggle;
            state.data = data;
        }
    }
})


export const {
    openModal,
    closeModal,
    updModalFeeling,
    updModalIsFileDialogOpen,

    updModalIsFeelingOpen,
    updModalIsGifModalOpen,
    updIsReactionsModalOpen,
    updModalIsCommentsModalOpen,
    updModalIsDeleteDialogOpen
} = modalSlice.actions;
export default modalSlice.reducer;