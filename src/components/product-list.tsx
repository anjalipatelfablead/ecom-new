"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProducts } from "@/redux/products/productSlice";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="py-12 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        {/* <Link href="/admin/add-product">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link> */}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) =>
          product ? <ProductCard key={product._id} product={product} /> : null
        )}
      </div>
      {products.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No products available at the moment.</p>
        </div>
      )}
    </div>
  );
}
