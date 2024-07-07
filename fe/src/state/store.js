import {createStore,applyMiddleware} from "redux"
import {userReducer} from './reducer'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'


export const store=createStore(userReducer,composeWithDevTools(applyMiddleware(thunk)))
