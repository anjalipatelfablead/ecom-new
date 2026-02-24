"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { useCart } from "@/lib/cart-context";
import { fetchProducts, fetchProductById } from "@/redux/products/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Heart } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { createCart, updateCart, fetchCart } from "@/redux/products/cartSlice";
import { addToWishlist } from "@/redux/products/wishlistSlice";
import { getImageUrl } from "@/lib/utils";

export default function ProductDetailsPage() {
  const router = useRouter();
  const productsStatus = useSelector((state: RootState) => state.products.status);
  const { selectedProduct: product, status } = useSelector(
    (state: RootState) => state.products
  );
  const { cartId, items } = useSelector(
    (state: RootState) => state.cart
  );
  const userId = useSelector(
    (state: RootState) => state.auth.currentUser?._id
  );

  const [quantity, setQuantity] = useState(1);

  const params = useParams();
  const productId = params.id as string;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);




  // const handleAddToCart = () => {
  //   if (product) {
  //     addToCart(product, quantity);
  //     toast.success(`${quantity} × ${product.title} added to cart!`);
  //     router.push("/cart");
  //   }
  // };

  // const handleAddToCart = () => {
  //   if (!product) return;

  //   dispatch(createCart({ product, quantity, }));

  //   toast.success(`${quantity} × ${product.title} added to cart!`);
  //   router.push("/cart");
  // };

  const handleAddToCart = async () => {
    if (!product || !userId) {
      toast.error("Please login first");
      return;
    }

    try {
      if (!cartId && items.length === 0) {
        await dispatch(fetchCart(userId)).unwrap();
      }

      const currentCartId = cartId;
      const currentItems = items;

      const existingItem = currentItems.find(
        (item) => item.product._id === product._id
      );

      let updatedItems;

      if (existingItem) {
        updatedItems = currentItems.map((item) =>
          item.product._id === product._id
            ? { product: product._id, quantity: item.quantity + quantity }
            : { product: item.product._id!, quantity: item.quantity }
        );
      } else {
        updatedItems = [
          ...currentItems.map((item) => ({
            product: item.product._id!,
            quantity: item.quantity,
          })),
          { product: product._id, quantity: quantity },
        ];
      }

      if (!currentCartId) {
        await dispatch(
          createCart({
            user: userId,
            items: [{ product: product._id, quantity: quantity }],
          })
        ).unwrap();
      } else {
        await dispatch(
          updateCart({
            cartId: currentCartId,
            items: updatedItems,
          })
        ).unwrap();
      }

      await dispatch(fetchCart(userId));
      toast.success(`${quantity} × ${product.title} added to cart!`);
      router.push("/cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToWishlist = () => {
    if (!product || !userId) {
      toast.error("Please login first");
      return;
    }
    dispatch(addToWishlist({ userId, productId: product._id }));
    toast.success(`${product.title} added to wishlist `);
  };



  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (productsStatus === "loading" && !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product && productsStatus === "succeeded") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Guard: if product is still undefined for any other status, avoid rendering
  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-white  ">
            <Image
              src={getImageUrl(product.image)}
              alt={product.title}
              fill
              className="object-contain p-6"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
            )}
            <h1 className="mb-4 text-3xl font-bold">{product.title}</h1>
            <p className="text-primary mb-4 text-4xl font-bold">
              ${product.price.toFixed(2)}
            </p>
            <div>
              <Badge
                className={`${(product.stock ?? 0) > 0
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                  } rounded-full px-3 py-1`}
              >
                {(product.stock ?? 0) > 0
                  ? `In Stock: ${product.stock}`
                  : "Out of Stock"}
              </Badge>
            </div>
          </div>

          {product.rating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-black dark:text-white">
                  {product.rating.rate}
                </span>
              </div>
              <span>({product.rating.count} reviews)</span>
            </div>
          )}

          {product.description && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-8 text-center text-lg font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {/* <Button
                      onClick={handleAddToCart}
                      className="w-full"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart - ₹ {(product.price * quantity).toFixed(2)}
                    </Button> */}

                    <Button
                      onClick={handleAddToCart}
                      className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                      size="lg"
                      disabled={(product.stock ?? 0) === 0}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {(product.stock ?? 0) === 0
                        ? "Out of Stock"
                        : `Add to Cart - ₹ ${(product.price * quantity).toFixed(2)}`}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleAddToWishlist}
                      className="w-full bg-gray-600 text-white hover:bg-gray-200"
                    >
                      <Heart className="mr-2 h-4 w-4 text-red-500" />
                      Wishlist
                    </Button>
                  </div>

                  <div className="text-muted-foreground space-y-1 text-sm">
                    <p>✓ Free shipping on orders over $100</p>
                    <p>✓ 30-day return policy</p>
                    <p>✓ 1-year warranty included</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
