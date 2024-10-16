export const getCartData = async () => {
  const response = await fetch("/cart.js");
  const data = await response.json()
  return data
};

export const addFreeProductToCart = async (freeProductVariantId) => {
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: freeProductVariantId,
            quantity: 1,
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error adding free product:', errorData);
    } else {
      const data = await response.json();
      console.log('Free product added:', data);
    }
  } catch (error) {
    console.error('Failed to add free product:', error);
  }
};

export const removeFreeProductFromCart = async (freeProductVariantId) => {
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: freeProductVariantId,
        quantity: 0,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error removing free product:', errorData);
    } else {
      const data = await response.json();
      console.log('Free product removed:', data);
    }
  } catch (error) {
    console.error('Failed to remove free product:', error);
  }
};