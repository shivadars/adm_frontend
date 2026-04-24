import { configureStore } from '@reduxjs/toolkit';
import cartReducer     from '../features/cart/cartSlice';
import productReducer  from '../features/products/productSlice';
import authReducer     from '../features/auth/authSlice';
import ordersReducer   from '../features/orders/ordersSlice';
import adminReducer    from '../features/admin/adminSlice';
import editModeReducer from '../features/editMode/editModeSlice';
import petReducer      from '../features/pets/petSlice';

export const store = configureStore({
  reducer: {
    cart:     cartReducer,
    products: productReducer,
    auth:     authReducer,
    orders:   ordersReducer,
    admin:    adminReducer,
    editMode: editModeReducer,
    pets:     petReducer,
  },
});
