import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserPayloadObject } from '../interfaces'
import { FieldProps } from './fields';

interface LeadsState {
    isShowCreate: boolean;
    leads: any[];
    lead: null | any;
    fields: FieldProps[];
}

const initialState: LeadsState = {
    isShowCreate: false,
    leads: [],
    lead: {},
    fields: [],
}

export const leads = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setIsShowCreate: (state, action: PayloadAction<boolean>) => {
            state.isShowCreate = action.payload
        },
        setLeads: (state, action: PayloadAction<any[]>) => {
            state.leads = action.payload;
        },
        appendLead: (state, action: PayloadAction<any[]>) => {
            let leads = state.leads;
            leads.unshift(action.payload);
            state.leads = leads;
        },
        setLead: (state, action: PayloadAction<any>) => {
            state.lead = action.payload;
        },
        setFields: (state, action: PayloadAction<any>) => {
            state.fields = action.payload;
        },
    }
})

// Action creators are generated for each case reducer function
export const {
    setIsShowCreate,
    setLeads,
    appendLead,
    setLead,
    setFields,
} = leads.actions

export default leads.reducer
