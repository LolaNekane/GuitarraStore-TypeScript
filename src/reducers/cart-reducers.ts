import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

export type CartActions = 
    { type: 'add-to-cart', payload: {item: Guitar} } |
    { type: 'remove-from-cart', payload: {id: Guitar['id']} } |
    { type: 'decrease-quantity', payload: {id: Guitar['id']} } |
    { type: 'increase-quantity', payload: {id: Guitar['id']} } |
    { type: 'clear-cart'}


export type CartState = {
    data: Guitar[],
    cart: CartItem[]
}

const initalCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('carrito')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

export const initialState : CartState = {
    data: db,
    cart: initalCart()
}

const MAX_ITEM = 10

export const cartReducer = (
    state: CartState = initialState,
    actions: CartActions
) => {
    if(actions.type === 'add-to-cart') {
        const itemExists = state.cart.find(guitar => guitar.id === actions.payload.item.id)
        let actulizadoCarrito : CartItem[] = []
        if(itemExists) {  // existe en el carrito
          actulizadoCarrito = state.cart.map(item => {
            if(item.id === actions.payload.item.id) {
                if(item.cantidad < MAX_ITEM){
                    return {...item, cantidad: item.cantidad +1}
                } else {
                    return item
                }
            } else {
                return item
            }
          })
        } else {
          const newItem : CartItem = {...actions.payload.item, cantidad : 1}
          actulizadoCarrito = [...state.cart, newItem]
        }
        return {
            ...state,
            cart: actulizadoCarrito
        }
    }

    if(actions.type === 'remove-from-cart') {
        const updateCarrito = state.cart.filter(item => item.id !== actions.payload.id)
        return {
            ...state,
            cart: updateCarrito
        }
    }

    if(actions.type === 'increase-quantity') {
        const updateCarrito = state.cart.map(item => {
            if(item.id === actions.payload.id && item.cantidad < MAX_ITEM) {
              return{
                ...item,
                cantidad: item.cantidad + 1
              }
            }
            return item
          })
        return {
            ...state,
            cart: updateCarrito
        }
    }

    if(actions.type === 'decrease-quantity') {
        const updateCarrito = state.cart.map(item => {
            if(item.id === actions.payload.id && item.cantidad > 1) {
              return{
                ...item,
                cantidad: item.cantidad - 1
              }
              
            }
            return item
          })
        return {
            ...state,
            cart: updateCarrito
        }
    }

    if(actions.type === 'clear-cart') {
        return {
            ...state,
            cart: []
        }
    }

    return state
}