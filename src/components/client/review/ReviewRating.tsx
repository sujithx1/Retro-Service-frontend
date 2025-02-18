import { FC, useState } from 'react';
import {
  Response_ServiceBooking_History_types,
  ReviewRating_Types,
} from '../../../types/clients/UsersTypes';
import { AppDispatch } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { User_post_Employee_feedBack } from '../../../reducers/users/UserapiCalls';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Props {
  paymentDetails: Response_ServiceBooking_History_types;
  serviceId:string
}

const ReviewRating: FC<Props> = ({ paymentDetails ,serviceId}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!rating) {
      toast.error('Please select a rating before submitting!');
      return;
    }

    const data: ReviewRating_Types = {
      userId: paymentDetails.userId,
      employeeId: paymentDetails.employeeId,
      rating: rating || 0,
      feedback: feedback,
      type:'feedback',
      amount:paymentDetails.amount,
      bookingId:serviceId

     
    
      
    };
    console.log(data);
    

    dispatch(User_post_Employee_feedBack(data))
      .unwrap()
      .then(() => {
        toast.success('Thank you for your feedback!');
        navigate('/home');
      });
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Rate Your Experience
      </h2>
      <p className="text-center text-gray-500 mt-2">
        Your feedback helps us improve our service.
      </p>
      <div className="flex justify-center mt-6 gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-4xl transition-transform ${
              rating && rating >= star
                ? 'text-yellow-400 scale-125'
                : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <div className="mt-8">
        <label className="block text-gray-700 font-medium mb-2">
          Additional Feedback
        </label>
        <textarea
          placeholder="Share your thoughts here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={4}
        />
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => {
            setRating(null);
            setFeedback('');
          }}
          className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!rating}
          className={`px-5 py-3 rounded-lg transition ${
            rating
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewRating;
