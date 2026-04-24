import { createSlice } from '@reduxjs/toolkit';

const load = () => {
  try { return JSON.parse(localStorage.getItem('adoremom_orders') || '[]'); } catch { return []; }
};
const save = (orders) => {
  try { localStorage.setItem('adoremom_orders', JSON.stringify(orders)); } catch {}
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { orders: load() },
  reducers: {
    placeOrder: (state, { payload }) => {
      const order = {
        id: `ORD-${Date.now()}`,
        ...payload,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      state.orders.unshift(order);
      save(state.orders);
    },
    updateOrderStatus: (state, { payload: { orderId, status } }) => {
      const o = state.orders.find(o => o.id === orderId);
      if (o) o.status = status;
      save(state.orders);
    },
  },
});

export const { placeOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
