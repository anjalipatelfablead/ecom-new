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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { deleteCart } from "@/redux/products/cartSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Truck } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { createOrder } from "@/redux/products/orderSlice";
import router from "next/router";

const checkoutFormSchema = z.object({
  // Shipping Information
  username: z.string().min(2, "user name must be at least 2 characters"),
  // lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country is required"),

  // // Payment Information
  // cardNumber: z.string().min(16, "Card number must be 16 digits"),
  // expiryDate: z
  //   .string()
  //   .regex(/^\d{2}\/\d{2}$/, "Expiry date must be MM/YY format"),
  // cvv: z.string().min(3, "CVV must be 3 digits"),
  // cardholderName: z.string().min(2, "Cardholder name is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, cartId } = useSelector((state: RootState) => state.cart);
  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const sessionUser =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loggedUser") || "{}")
      : {};

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      username: sessionUser.username || "",
      email: sessionUser.email || "",
      phone: "",
      address: sessionUser.address || "",
      city: "",
      state: "",
      zipCode: "",
      country: "",

      // cardNumber: "",
      // expiryDate: "",
      // cvv: "";
      // cardholderName: "",
    },
  });

  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_8x2aEZcmdaVCcc84Dxbsc02";

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!userId) {
      toast.error("Please login to continue");
      return;
    }

    const shippingCost = totalPrice >= 100 ? 0 : 9.99;
    const tax = totalPrice * 0.08;
    const finalTotal = totalPrice + shippingCost + tax;

    const orderItems = items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    try {
      await dispatch(
        createOrder({
          user: userId,
          items: orderItems,
          totalAmount: finalTotal,
          shippingAddress: {
            username: values.username,
            email: values.email,
            phone: values.phone,
            address: values.address,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            country: values.country,
          },
          paymentMethod: "stripe",
        })
      ).unwrap();

      toast.success("Order created successfully!");

      if (cartId) {
        await dispatch(deleteCart(cartId));
      }

      window.location.href = STRIPE_PAYMENT_LINK;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create order");
    }
  };

  const shippingCost = totalPrice >= 100 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button onClick={() => router.push("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* Checkout Form */}
          <div className="space-y-8 lg:col-span-2">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="(555) 123-4567"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <FormField

                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


              </CardContent>
            </Card>

            {/* Payment Information */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234 5678 9012 3456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4" />
                  Your payment information is secure and encrypted
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex items-center space-x-3">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          className="rounded-md object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.product.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          ${item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Subtotal (
                      {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0
                        ? "Free"
                        : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Processing..."
                    : "Place Order"}
                </Button>

                <div className="text-muted-foreground space-y-1 text-xs">
                  <p>✓ Secure 256-bit SSL encryption</p>
                  <p>✓ 30-day money-back guarantee</p>
                  <p>✓ Free returns on all orders</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
