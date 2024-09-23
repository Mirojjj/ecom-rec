import {
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  Input,
} from "@chakra-ui/react";

import { useCartStore } from "../store/useCartStore";

const DrawerModel = ({ isOpen, onClose, btnRef }) => {
  const cart = useCartStore((state) => state.cart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.Price * item.quantity,
    0
  );
  //   const cartTotal = useCartStore((state) => state.cartTotal);

  const handleQuantityChange = (itemId, quantity) => {
    updateQuantity(itemId, quantity);
  };

  return (
    <>
      <Drawer
        size="sm"
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent className="bg-white">
          <DrawerCloseButton />
          <DrawerHeader className="text-lg font-semibold text-gray-800 border-b border-gray-200">
            Your Shopping Cart
          </DrawerHeader>

          <DrawerBody>
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-6">
                Your cart is empty
              </p>
            ) : (
              <>
                <button
                  className="bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-lg mb-4 hover:bg-red-600 transition-colors duration-300 w-full"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b pb-4 mb-4 border-gray-200"
                  >
                    <img
                      src={item.ImageURL.match(/^([^|]+)/)?.[0] || ""}
                      className="w-28 h-28 object-contain rounded-md"
                      alt={item.Name}
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 text-lg font-medium">
                        {item.Name}
                      </p>
                      <p className="text-gray-500 text-sm mb-2">
                        Price: ${item.Price}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-700 text-sm">Qty:</p>
                        <Input
                          min={1}
                          width={16}
                          height={8}
                          className="text-center"
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.ProdID, e.target.value)
                          }
                        />
                      </div>
                      <button
                        className="mt-2 text-red-600 font-medium text-sm hover:underline"
                        onClick={() => removeItem(item.ProdID)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </DrawerBody>

          <DrawerFooter
            alignItems="left"
            paddingX="6"
            className="border-t flex flex-col"
          >
            <div className="w-full flex justify-between text-lg font-bold text-gray-900">
              <p>Subtotal</p>
              <p>$ {Math.ceil(totalPrice)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-orange-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-700 transition-colors duration-300">
                Checkout
              </button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or
                <button
                  type="button"
                  className="ml-1 font-medium text-orange-600 hover:text-orange-500 transition-colors duration-300"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </p>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerModel;
