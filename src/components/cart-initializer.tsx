"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCart } from "@/redux/products/cartSlice";

export function CartInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector(
    (state: RootState) => state.auth.currentUser?._id
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [userId, dispatch]);

  return null;
}
