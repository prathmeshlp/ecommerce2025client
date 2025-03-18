// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
// import { motion } from "framer-motion";
// import { RootState } from "../redux/store";

// const Cart: React.FC = () => {
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state: RootState) => state.cart.items);

//   const handleRemove = (productId: string) => {
//     dispatch(removeFromCart(productId));
//   };

//   const handleQuantityChange = (productId: string, quantity: number) => {
//     dispatch(updateQuantity({ productId, quantity }));
//   };

//   const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   if (cartItems.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="container mx-auto p-4 text-center"
//       >
//         <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
//         <p>Your cart is empty.</p>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="container mx-auto p-4"
//     >
//       <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
//       {cartItems.map((item) => (
//         <motion.div
//           key={item.productId}
//           initial={{ x: -50, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white p-4 mb-4 rounded-lg shadow-md flex justify-between items-center"
//         >
//           <div>
//             <h2 className="text-xl font-semibold">{item.name}</h2>
//             <p className="text-lg font-bold">₹{item.price.toLocaleString("en-IN")}</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <input
//               type="number"
//               min="1"
//               value={item.quantity}
//               onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
//               className="w-16 p-1 border rounded"
//             />
//             <motion.button
//               onClick={() => handleRemove(item.productId)}
//               className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Remove
//             </motion.button>
//           </div>
//         </motion.div>
//       ))}
//       <div className="text-right mt-4">
//         <p className="text-xl font-bold">Total: ₹{total.toLocaleString("en-IN")}</p>
//         <motion.button
//           onClick={() => dispatch(clearCart())}
//           className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           Checkout
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// export default Cart;
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(cartItems,"cartItems")

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Your Cart
      </motion.h1>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <motion.div
              key={item.productId}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p>₹{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => dispatch(updateQuantity({ productId: item.productId, quantity: Number(e.target.value) }))}
                  className="w-16 p-1 border rounded"
                />
                <button
                  onClick={() => dispatch(removeFromCart(item.productId))}
                  className="p-2 bg-red-500 text-white rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
          <div className="text-right mt-6">
            <p className="text-xl font-semibold">Total: ₹{total.toLocaleString()}</p>
            <motion.button
              onClick={() => navigate("/app/checkout")}
              className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;