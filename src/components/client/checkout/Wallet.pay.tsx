import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { WalletReq, WalletResponse } from "../../../types/employee/EmployeeTypes";
import { User_checkoutUsingWallet, User_get_CartnyUserId, user_get_walletdetails } from "../../../reducers/users/UserapiCalls";
import { AppDispatch,  } from "../../../store/store";
import { useDispatch,  } from "react-redux";
import { Cart, Checkout_paymentTypes } from "../../../types/clients/UsersTypes";
import { ToastMsg } from "../../../types/admin/admintypes";
import ToastAlert from "../../alert/ToastAlert";
// import { setCheckoutBoolean } from "../../../reducers/users/UserReducers";

const WalletPayment = () => {
const {userId} =useParams()
// const {checkoutBoolean}=useSelector((state:RootState)=>state.user)
  const [walletBalance, setWalletBalance] = useState<WalletResponse | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartTotal,setCartTotal]=useState(0)
  const [isPaying, setIsPaying] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [showError,setShowError]=useState<ToastMsg>({
    action:false,
    message:'',
    type:'idle'
  })
  useEffect(() => {
    if (userId) {
      const data: WalletReq = { userId, userType: "user" };
      dispatch(user_get_walletdetails(data))
        .unwrap()
        .then((res) => setWalletBalance(res))
        .catch((err) => console.error("Error fetching wallet details:", err));

      dispatch(User_get_CartnyUserId(userId))
        .unwrap()
        .then((res) => setCart(res))
        .catch((err) => {
          console.error("Error fetching cart details:", err);
          navigate("/payment-failed");
        });
    }
  }, [dispatch, userId, navigate]);

  useEffect(()=>{
    if (cart) {
        setCartTotal(cart.products.reduce((res, product) => res + product.price , 0))
        
    }
  },[cart])

  
const handleSubmit=()=>{
    setIsPaying(true)

    // if (checkoutBoolean) {
    //   setShowError({
    //     action:true,
    //     message:"Payment Already procces",
    //     type:'info'
    // })
    // setTimeout(() => {
      
    //   navigate('/stores')
    
    // }, 3000);
    // return
    // }

if(cart)
    {    const data: Checkout_paymentTypes = {
        cartId: cart.id,
        total: cartTotal,
        paymentMethode:'wallet',
        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`
  
    };

    // dispatch(setCheckoutBoolean(true))


    dispatch(User_checkoutUsingWallet(data)).unwrap()
    .then(()=>{

        setShowError({
            action:true,
            message:"success",
            type:'success'
        })

        // dispatch(setCheckoutBoolean(false))

        
        setTimeout(() => {
            
            navigate('/order-history')
        }, 2000);
        setCart(null);
        
          setIsPaying(false);
    })
    .catch(()=>{

        setShowError({
            action:true,
            message:"Payment Failed",
            type:'error'
        })

    })


}}

  return (
    <>
     {showError.action && <ToastAlert onClose={()=>setShowError((prev)=>({...prev,action:false}))} message={showError.message} type={showError.type as "info"|"success"|"error"} />}

    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Wallet Payment</h2>
        <p className="text-gray-600 text-center mt-2">User ID: {userId}</p>

        {/* Wallet Balance */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-lg font-semibold text-blue-700">Wallet Balance: ₹{walletBalance?.balance ?? "Loading..."}</p>
        </div>

        {/* Cart Items */}
        <div className="mt-4">
          {cart?.products?.length ? (
            cart.products.map((item,index) => (
              <div key={index} className="flex items-center gap-4 p-3 border-b">
                <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <p className="text-gray-800 font-medium">{item.product.name}</p>
                  <p className="text-gray-500">₹{item.price} x {item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No items in cart</p>
          )}
        </div>

        {/* Total Amount */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-700">Cart Total: ₹{cartTotal}</p>
        </div>

        {/* Pay Button */}
        <button
        type="button"
          onClick={handleSubmit}
          disabled={!walletBalance || !cart || walletBalance.balance < cartTotal || isPaying}
          className={`mt-6 w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            walletBalance && cart && walletBalance.balance >= cartTotal
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          {isPaying ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
    </>
  );
};

export default WalletPayment;
