import React, { useState } from "react";
import { Star, MessageSquare, Send, AlertTriangle } from "lucide-react";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { user_post_reportrefund } from "../../../reducers/users/UserapiCalls";
import { ReviewRating_Types } from "../../../types/clients/UsersTypes";

interface ReportEmployeeProps {
  employeeId: string;
  userId: string;
  paymentId?: string; // Required for refunds
  amount?: number; // Required for refunds
  bookingId:string
}

const ReportEmployee: React.FC<ReportEmployeeProps> = ({ employeeId, userId, paymentId, amount,bookingId }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      setErrorMessage("Please provide a rating.");
      return;
    }
    if (!feedback.trim()) {
      setErrorMessage("Please provide feedback.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const data: ReviewRating_Types = {
        userId: userId,
        employeeId: employeeId,
        type: "report", // Always reporting
        rating,
        feedback: feedback.trim(),
        paymentId, // Required for refund
        amount, // Refund amount,
    
        bookingId
        
        
      };
      dispatch(user_post_reportrefund(data));

      setSuccessMessage("Report submitted successfully!");
      setFeedback("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting report:", error);
      setErrorMessage("Failed to submit the report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <AlertTriangle size={24} className="text-red-600" /> Report Employee
      </h2>
      <p className="text-gray-600 mt-2 text-base">
        If you encountered any issues, please report the employee below. Your feedback is important to us.
      </p>

      {/* Rating Section */}
      <div className="mt-4">
        <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Star className="text-yellow-500" /> Rate Employee
        </label>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button" // Prevent form submission on button click
              className={`p-1 rounded-full transition-all ${
                rating >= star ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => {
                setRating(star);
                setErrorMessage(null); // Clear error when user interacts
              }}
            >
              <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Input */}
      <div className="mt-4">
        <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <MessageSquare className="text-blue-500" /> Feedback
        </label>
        <textarea
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          rows={4}
          placeholder="Describe the issue..."
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            setErrorMessage(null); // Clear error when user interacts
          }}
        ></textarea>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="mt-4 text-center text-base font-medium text-red-600">
          {errorMessage}
        </p>
      )}

      {/* Submit Button */}
      <button
        className="w-full mt-6 py-3 bg-red-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-all"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        <Send size={18} />
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </button>

      {/* Success Message */}
      {successMessage && (
        <p className="mt-4 text-center text-base font-medium text-green-600">
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default ReportEmployee;