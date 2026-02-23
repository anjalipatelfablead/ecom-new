"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppDispatch, RootState } from "@/redux/store";
import {
  uploadProductImage,
  setImageUrl,
  resetForm,
} from "@/redux/products/productFormSlice";
import {
  fetchProductById,
  updateProduct,
} from "@/redux/products/productSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as z from "zod";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

const productSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  price: z.string().min(1, "Price is required"),
  image: z.string().min(1, "Product image is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { selectedProduct } = useSelector((state: RootState) => state.products);

  const { imageUploadStatus, imageUrl } = useSelector(
    (state: RootState) => state.productForm
  );

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: "",
      image: "",
      description: "",
      category: "",
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id as string));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      form.reset({
        title: selectedProduct.title,
        price: selectedProduct.price.toString(),
        image: selectedProduct.image,
        description: selectedProduct.description,
        category: selectedProduct.category,
      });
      dispatch(setImageUrl(selectedProduct.image));
    }
  }, [selectedProduct, form, dispatch]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await dispatch(uploadProductImage(formData)).unwrap();
      form.setValue("image", result);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast.error(error?.message || "Failed to upload image");
    }
  };

  const removeImage = () => {
    dispatch(setImageUrl(""));
    form.setValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const finalImageUrl = imageUrl || data.image;

      const productData = {
        title: data.title,
        price: parseFloat(data.price),
        description: data.description,
        category: data.category,
        image: finalImageUrl,
      };

      await dispatch(
        updateProduct({
          id: id as string,
          data: productData,
        })
      ).unwrap();

      dispatch(resetForm());
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">
          Update the product details for your store.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Electronics, Clothing"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {imageUrl ? (
                          <div className="relative inline-block">
                            <Image
                              src={imageUrl}
                              alt="Product"
                              width={200}
                              height={200}
                              className="rounded-lg object-cover"
                              unoptimized
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex w-full items-center justify-center">
                            <label
                              htmlFor="dropzone-file"
                              className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="mb-2 h-8 w-8 text-gray-500" />
                                <p className="text-sm text-gray-500">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                              <input
                                id="dropzone-file"
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={imageUploadStatus === "uploading"}
                              />
                            </label>
                          </div>
                        )}
                        {imageUploadStatus === "uploading" && (
                          <p className="text-muted-foreground text-sm">
                            Uploading...
                          </p>
                        )}
                        <Input
                          type="hidden"
                          {...field}
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter product description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading || imageUploadStatus === "uploading"}
                >
                  {loading ? "Updating Product..." : "Update Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
