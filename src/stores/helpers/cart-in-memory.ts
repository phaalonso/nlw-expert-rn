import { ProductProps } from "@/utils/data/products";
import { ProductsCartProps } from "../cart-store";

export function add(products: ProductsCartProps[], newProduct: ProductProps) {
  const existingProduct = products.find((p) => p.id === newProduct.id);

  if (existingProduct) {
    return products.map((product) =>
      product.id === existingProduct.id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
  }

  return [...products, { ...newProduct, quantity: 1 }];
}

export function remove(
  products: ProductsCartProps[],
  productRemovedId: string
) {
  const updatedProducts = products.map((product) =>
    product.id === productRemovedId
      ? {
          ...product,
          quantity: product.quantity > 1 ? product.quantity - 1 : 0,
        }
      : product
  );

  return updatedProducts.filter((product) => product.quantity > 0);
}
