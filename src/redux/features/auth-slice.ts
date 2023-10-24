import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type InitialState = {
  value: AuthState;
}

type AuthState = {
  isAuth: boolean;
  username: string;
}

const initialState = {
  value: {
    isAuth: false,
    username: ''
  } as AuthState
} as InitialState;

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: () => initialState,
    logIn: (state, action: PayloadAction<string>) => {
      return {
        value: {
          isAuth: true,
          username: action.payload,
        }
      }
    }
  }
})

export const {logIn, logOut} = auth.actions;
export default auth.reducer;
