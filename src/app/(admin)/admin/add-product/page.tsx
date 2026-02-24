// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { AppDispatch, RootState } from "@/redux/store";
// import { uploadProductImage, createProduct, setImageUrl, resetForm } from "@/redux/products/productFormSlice";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import * as z from "zod";
// import Image from "next/image";
// import { Upload, X } from "lucide-react";
// import { toast } from "sonner";

// const productSchema = z.object({
//   title: z.string().min(1, "Product title is required"),
//   price: z.string().min(1, "Price is required"),
//   image: z.string().min(1, "Product image is required"),
//   description: z.string().min(1, "Description is required"),
//   category: z.string().min(1, "Category is required"),
//   rating: z.string().optional(),
//   count: z.string().optional(),
// });

// type ProductFormData = z.infer<typeof productSchema>;

// export default function AddProductPage() {
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { imageUploadStatus, imageUrl } = useSelector(
//     (state: RootState) => state.productForm
//   );

//   const form = useForm<ProductFormData>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       title: "",
//       price: "",
//       image: "",
//       description: "",
//       category: "",
//       rating: "",
//       count: "",
//     },
//   });

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const result = await dispatch(uploadProductImage(formData)).unwrap();
//       form.setValue("image", result);
//       toast.success("Image uploaded successfully");
//     } catch (error: any) {
//       console.error("Image upload error:", error);
//       toast.error(error?.message || "Failed to upload image");
//     }
//   };

//   const removeImage = () => {
//     dispatch(setImageUrl(""));
//     form.setValue("image", "");
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const onSubmit = async (data: ProductFormData) => {
//     setLoading(true);
//     try {
//       const finalImageUrl = imageUrl || data.image;
//       console.log("Submitting product with image URL:", finalImageUrl);

//       const productData = {
//         title: data.title,
//         price: parseFloat(data.price),
//         description: data.description,
//         category: data.category,
//         image: finalImageUrl,
//         rating: data.rating ? parseFloat(data.rating) : 0,
//         count: data.count ? parseInt(data.count) : 0,
//       };

//       console.log("Product data being sent:", productData);
//       await dispatch(createProduct(productData)).unwrap();
//       dispatch(resetForm());
//       toast.success("Product added successfully");
//       router.push("/admin/products");
//     } catch (error: any) {
//       console.error("Error:", error);
//       toast.error(error?.message || "Failed to add product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-2xl space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
//         <p className="text-muted-foreground">
//           Create a new product for your store.
//         </p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Product Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Product Title</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter product title" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="price"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Price</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         step="0.01"
//                         placeholder="0.00"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="category"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Category</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="e.g., Electronics, Clothing"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="rating"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Rating (Optional)</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           step="0.1"
//                           min="0"
//                           max="5"
//                           placeholder="0"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="count"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Count (Optional)</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           min="0"
//                           placeholder="0"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="image"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Product Image</FormLabel>
//                     <FormControl>
//                       <div className="space-y-4">
//                         {imageUrl ? (
//                           <div className="relative inline-block">
//                             <Image
//                               src={imageUrl}
//                               alt="Product"
//                               width={200}
//                               height={200}
//                               className="rounded-lg object-cover"
//                               unoptimized
//                             />
//                             <Button
//                               type="button"
//                               variant="destructive"
//                               size="icon"
//                               className="absolute -top-2 -right-2 h-6 w-6"
//                               onClick={removeImage}
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         ) : (
//                           <div className="flex items-center justify-center w-full">
//                             <label
//                               htmlFor="dropzone-file"
//                               className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
//                             >
//                               <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                 <Upload className="w-8 h-8 mb-2 text-gray-500" />
//                                 <p className="text-sm text-gray-500">
//                                   <span className="font-semibold">Click to upload</span> or drag and drop
//                                 </p>
//                                 <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                               </div>
//                               <input
//                                 id="dropzone-file"
//                                 type="file"
//                                 ref={fileInputRef}
//                                 className="hidden"
//                                 accept="image/*"
//                                 onChange={handleImageUpload}
//                                 disabled={imageUploadStatus === "uploading"}
//                               />
//                             </label>
//                           </div>
//                         )}
//                         {imageUploadStatus === "uploading" && (
//                           <p className="text-sm text-muted-foreground">Uploading...</p>
//                         )}
//                         <Input
//                           type="hidden"
//                           {...field}
//                           value={field.value || ""}
//                         />
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl>
//                       <textarea
//                         className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//                         placeholder="Enter product description"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex gap-4">
//                 <Button type="submit" disabled={loading || imageUploadStatus === "uploading"}>
//                   {loading ? "Adding Product..." : "Add Product"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.push("/admin/products")}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }






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
  createProduct,
  setImageUrl,
  resetForm,
} from "@/redux/products/productFormSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as z from "zod";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const productSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  price: z.string().min(1, "Price is required"),
  image: z.string().min(1, "Product image is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  rating: z.string().optional(),
  count: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      rating: "",
      count: "",
    },
  });

  // STEP VALIDATION
  const nextStep = async () => {
    let fields: (keyof ProductFormData)[] = [];

    if (step === 1) fields = ["title", "price", "category"];
    if (step === 2) fields = ["description", "rating", "count"];
    if (step === 3) fields = ["image"];

    const valid = await form.trigger(fields);
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // IMAGE UPLOAD
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await dispatch(uploadProductImage(formData)).unwrap();
      form.setValue("image", result);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
    }
  };

  const removeImage = () => {
    dispatch(setImageUrl(""));
    form.setValue("image", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // SUBMIT
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
        rating: data.rating ? parseFloat(data.rating) : 0,
        count: data.count ? parseInt(data.count) : 0,
      };

      await dispatch(createProduct(productData)).unwrap();
      dispatch(resetForm());
      toast.success("Product added successfully");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -80 },
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 mt-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Add New Product
        </h1>
        <p className="text-muted-foreground">
          Create a new product for your store.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* STEP INDICATOR */}
              <div className="flex gap-2 mb-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 rounded-full ${step >= s ? "bg-primary" : "bg-gray-200"
                      }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mt-5">Product Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mt-5">Price</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mt-5">Category</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button type="button" onClick={nextStep} className="mt-10">Next</Button>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="rating" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mt-5">Rating</FormLabel>
                          <Input {...field} />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="count" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mt-5">Count</FormLabel>
                          <Input {...field} />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mt-5">Description</FormLabel>
                        <textarea className="w-full border rounded-md p-2" {...field} />
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="flex gap-4 mt-10">
                      <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                      <Button type="button" onClick={nextStep}>Next</Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mt-5">Product Image</FormLabel>
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
                                <div className="flex items-center justify-center w-full">
                                  <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                  >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
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
                                <p className="text-sm text-muted-foreground">
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
                    <div className="flex gap-4 mt-10">
                      <Button type="button" onClick={prevStep}>Back</Button>
                      <Button type="submit">
                        {loading ? "Adding..." : "Add Product"}
                      </Button>
                    </div>
                  </motion.div>

                )}
              </AnimatePresence>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
