import {  useState } from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ConfirmationCancellModal from "../../../components/are you sure/CancellModal";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { User_put_cancelReq_service } from "../../../reducers/users/UserapiCalls";
import { Service_Booking_Put_status_type } from "../../../types/clients/UsersTypes";
import ToastAlert from "../../../components/alert/ToastAlert";

interface ConfirmBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;  
}

const ConfirmBookingModal: React.FC<ConfirmBookingModalProps> = ({
  isOpen,
  
  bookingId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cancelModal,setCancelModal]=useState(false)
const [showmsg,setShowmsg]=useState(false)
  const dispatch:AppDispatch=useDispatch()

const navigate=useNavigate()
  const handlePayment = async () => {
    setIsLoading(true);
    navigate(`/advancepayment?service=${bookingId}`)
   
  };

  if (!isOpen) return null;

  const handleDelete=()=>{
    const data:Service_Booking_Put_status_type={
          id:bookingId,
          status:'CANCELLED'
        }
    dispatch(User_put_cancelReq_service(data)).unwrap()
    .then(()=>{
      navigate('/home')
      setShowmsg(true)
      

    }
  )
    
    
    
  
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md">
      {/* Modal Box */}
      {showmsg && <ToastAlert message="Booking Cancelled !" type="success" onClose={() => setShowmsg(false)} />}

      { cancelModal &&  <ConfirmationCancellModal  isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={handleDelete}
         />}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Confirm & Pay ₹100
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Your booking is ready. Confirm and pay ₹100 to proceed.
        </p>

        {/* Buttons */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handlePayment}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-lg font-medium text-white rounded-lg transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirm & Pay ₹100
              </>
            )}
          </button>

          <button
          onClick={()=>setCancelModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 text-lg font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
          >
            <XCircle className="w-5 h-5" /> Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmBookingModal;
