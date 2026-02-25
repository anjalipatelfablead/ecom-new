"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
  Review,
} from "@/redux/products/reviewSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, CheckCircle, XCircle, Trash2, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ReviewsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, loading } = useSelector((state: RootState) => state.review);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const status = filterStatus === "all" ? undefined : filterStatus;
    dispatch(getAllReviews(status));
  }, [dispatch, filterStatus]);

  const handleApprove = async (reviewId: string) => {
    try {
      await dispatch(approveReview(reviewId)).unwrap();
      toast.success("Review approved successfully");
    } catch (error: any) {
      toast.error(error || "Failed to approve review");
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await dispatch(rejectReview(reviewId)).unwrap();
      toast.success("Review rejected successfully");
    } catch (error: any) {
      toast.error(error || "Failed to reject review");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
      toast.success("Review deleted successfully");
    } catch (error: any) {
      toast.error(error || "Failed to delete review");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <Loader2 className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getProductTitle = (product: Review["product"]) => {
    if (typeof product === "string") {
      return "Unknown Product";
    }
    return product.title || "Unknown Product";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviews Management</h1>
          <p className="text-muted-foreground">
            Manage product reviews and ratings
          </p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 flex-col items-center justify-center">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No reviews found</p>
            <p className="text-muted-foreground">
              {filterStatus === "all"
                ? "There are no reviews yet."
                : `No ${filterStatus} reviews found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review._id}>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">
                        {getProductTitle(review.product)}
                      </CardTitle>
                      {getStatusBadge(review.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>By {review.user?.username || "Unknown User"}</span>
                      <span>•</span>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {review.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(review._id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {review.status === "approved" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(review._id)}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    )}
                    {review.status === "rejected" && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(review._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(review._id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
