import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, addToCart } from '../../features/cart/cartSlice';
import { Trash2 } from 'lucide-react';

export const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex bg-white p-4 rounded-2xl soft-shadow border border-brand-border mb-4 items-center">
      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-brand-muted" />
      <div className="flex-1 ml-4">
        <div className="flex justify-between">
          <h3 className="font-bold text-brand-dark text-lg">{item.name}</h3>
          <span className="font-extrabold text-brand-dark">${(item.price * item.cartQty).toFixed(2)}</span>
        </div>
        <div className="text-sm text-brand-dark/70 mb-2 mt-1">Size: <span className="font-bold">{item.size}</span></div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center border border-brand-border rounded-full bg-brand-muted px-2 h-8">
            <button 
              onClick={() => {
                if (item.cartQty > 1) {
                  dispatch(addToCart({ product: item, quantity: -1, size: item.size }));
                } else {
                  dispatch(removeFromCart({ id: item.id, size: item.size }));
                }
              }}
              className="text-brand-dark/70 hover:text-primary-dark font-bold px-2"
            >-</button>
            <span className="text-sm font-bold w-6 text-center">{item.cartQty}</span>
            <button 
              onClick={() => dispatch(addToCart({ product: item, quantity: 1, size: item.size }))}
              className="text-brand-dark/70 hover:text-primary-dark font-bold px-2"
            >+</button>
          </div>
          <button 
             onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
             className="text-red-400 hover:text-red-500 bg-red-50 p-2 rounded-full cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
