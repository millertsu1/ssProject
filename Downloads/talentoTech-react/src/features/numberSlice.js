//? importamos la funcion crearSlice que importamos desde reduxJS-Toolkit es una funcion que se utiliza para crear slice de un estado en redux
import { createSlice } from '@reduxjs/toolkit';

/** Crear el Slice */
const numberSlice = createSlice({
    name: 'number', // Nombre del Slice
    initialState: { // Estado inicial de la variable
        value: 0
    },
    reducers: {
        /** Funciones que cambiaran el estado de la variable */
        increaseNumber: (state) => {
            state.value +=1;
        },
        decreaseNumber: (state) => {
            state.value -=1;
        }
    }
});

/** Exporto las 2 funciones */
export const { increaseNumber, decreaseNumber } = numberSlice.actions;
export default numberSlice.reducer;