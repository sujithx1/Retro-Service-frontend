import { FC, useState } from 'react';
import { Response_ServiceBooking_History_types, ReviewRating_Types } from '../../../types/clients/UsersTypes';
import { AppDispatch } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { User_post_Employee_feedBack } from '../../../reducers/users/UserapiCalls';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
interface Props{
  paymentDetails:Response_ServiceBooking_History_types
}
const ReviewRating:FC<Props> = ({paymentDetails}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const dispatch:AppDispatch=useDispatch()
  const navigate=useNavigate()
  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({ rating, feedback });

    // if (paymentDetails) {
      
    // }
    const data:ReviewRating_Types={
      userId:paymentDetails.userId,
      employeeId:paymentDetails.employeeId,
      rating:rating?rating:0,
      feedback:feedback
    }

    dispatch(User_post_Employee_feedBack(data))
    .unwrap()
    .then(()=>{
      toast.success("Thank you for feedback")
      navigate('/home')
    })
    
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        How would you rate the overall user experience ?
      </h2>
      {/* <p className="text-center text-gray-600 mt-2">
        Do you find the app easy to use?
      </p> */}
      <div className="flex justify-center mt-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-3xl ${
              rating && rating >= star ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">
          Can you tell us more?
        </label>
        <textarea
          placeholder="Add feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={() => {
            setRating(null);
            setFeedback('');
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewRating;
