import React, { useState } from "react";
import { serverRoute, socket } from "./Main";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { countries, getCountryData } from "countries-list";
const Services = ({ checkMode, mode }) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({});
  const [failed, setFailed] = useState(false);
  const [data, setData] = useState({
    service: "",
    type: "*",
    fullname: "",
    gender: "",
    nationalty: "",
    nation_number: "",
    birth: "",
    phone: "",
    email: "",
    lang: "",
    licence_type: "",
    car_type: "",
    time: "",
    train_lang: "",
    check_time:'',
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(serverRoute + "/services/" + sessionStorage.getItem("id"), data)
      .then(() => navigate(`/order?data=${JSON.stringify(data)}`));
  };
  return (
    <div className="flex flex-col w-full justify-center relative min-h-screen">
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
      {page === 0 ? (
        <div
          className="md:w-2/3 w-full flex self-center  justify-center items-center my-10 gap-y-3 gap-x-4 px-2"
          style={{ height: "40vh" }}
        >
          <span
            className="cardesc sm:text-base text-white bg-green-700  md:p-10 p-5 rounded-lg text-center cursor-pointer flex-1 "
            onClick={() => {
              setData({ ...data, service: "استبدال" });
              setPage(2);
            }}
          >
            {checkMode("Replacement", "استبدال").word}
          </span>
          <span
            className="cardesc sm:text-base text-white bg-green-700 md:p-10 p-5 rounded-lg text-center cursor-pointer flex-1 "
            onClick={() => {
              setData({ ...data, service: "اصدار رخصه جديده" });
              setPage(page + 1);
            }}
          >
            {checkMode("Issuing a new license", "  اصدار رخصه جديده").word}
          </span>
        </div>
      ) : page === 1 ? (
        <div
          className="md:w-2/3 w-full flex self-center  justify-center items-center my-10 gap-y-3 gap-x-4 px-2"
          style={{ height: "40vh" }}
        >
          <span
            className="cardesc sm:text-base text-white bg-green-700    md:p-10 p-5 rounded-lg text-center cursor-pointer flex-1  "
            onClick={() => {
              setData({ ...data, type: "مسار تحديد مستوى" });
              setPage(page + 1);
            }}
          >
            {checkMode("Level setting path", "  مسار تحديد مستوى").word}
          </span>
          <span
            className="cardesc sm:text-base text-white bg-green-700  md:p-10 p-5 rounded-lg text-center cursor-pointer flex-1  "
            onClick={() => {
              setData({ ...data, type: "مسار مبتدئ - 30 ساعه" });
              setPage(page + 1);
            }}
          >
            {
              checkMode("Beginner track - 30 hours", "مسار مبتدئ - 30 ساعه")
                .word
            }
          </span>
        </div>
      ) : page === 2 ? (
        <div className="flex flex-col bg-green-700 my-1 p-2 justify-center items-center ">
          <span className=" text-white">
            {
              checkMode(
                "Registration - personal data",
                " التسجيل - البيانات الشخصية"
              ).word
            }
          </span>
          <form
            onSubmit={handleSubmit}
            className="my-1 py-2 w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 pb-10 gap-x-5 items-center "
            dir={mode === "ar" ? "rtl" : "ltr"}
          >
            <div className="flex flex-col   gap-y-1 w-full">
              <span className="text-white">
                {checkMode("Full Name", "الاسم رباعي").word}
              </span>
              <input
                className="w-full rounded-md input-form py-1 px-2 "
                type="text"
                placeholder={checkMode("Full Name", "الاسم رباعي").word}
                required
                onChange={(e) => setData({ ...data, fullname: e.target.value })}
              />
            </div>
            <div className="flex flex-col   gap-y-1 w-full">
              <span className="text-white">
                {checkMode("Gender", "الجنس").word}{" "}
              </span>
              <select
                className="w-full rounded-md py-1 px-2 "
                required
                onChange={(e) => setData({ ...data, gender: e.target.value })}
              >
                <option>{checkMode("Choose", "اختر").word}</option>
                <option>{checkMode("Male", "ذكر").word}</option>
                <option>{checkMode("Female", "انثي").word}</option>
              </select>
            </div>
            <div className="flex flex-col   gap-y-1 w-full">
              <span className="text-white">
                {checkMode("Nationalty", "الجنسيه").word}{" "}
              </span>
              <select
                className="w-full rounded-md py-1 px-2 "
                required
                onChange={(e) =>
                  setData({ ...data, nationalty: e.target.value })
                }
              >
                <option>{checkMode("Choose", "اختر").word}</option>
                {Object.keys(countries).map((countryCode) => (
                  <option
                    key={getCountryData(countryCode).name}
                    value={getCountryData(countryCode).name}
                    className="w-full"
                    dir="ltr"
                  >
                    {getCountryData(countryCode).name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col   gap-y-1 w-full">
              <span className="text-white text-sm">
                {
                  checkMode(
                    "Nationalty Number",
                    "رقم الاقامه / رقم الهويه الوطنيه"
                  ).word
                }
              </span>
              <input
                className="w-full rounded-md input-form py-2 px-2 "
                type="text"
                required
                onChange={(e) =>
                  setData({ ...data, nation_number: e.target.value })
                }
                placeholder={
                  checkMode(
                    "Nationalty Number",
                    ":رقم الاقامه / رقم الهويه الوطنيه"
                  ).word
                }
              />
            </div>
            <div className="flex flex-col  gap-y-1 w-full">
              <span className="text-white">
                {checkMode("Birthday ", "تاريخ الميلاد").word}
              </span>
              <input
                className="w-full rounded-md input-form py-2 px-2 "
                required
                type="date"
                onChange={(e) => setData({ ...data, birth: e.target.value })}
              />
            </div>
            <div className="flex flex-col   gap-y-1 w-full">
              <span className="text-white">
                {checkMode("Phone", "رقم الهاتف").word}
              </span>
              <input
                className="w-full rounded-md input-form py-2 px-2 "
                type="text"
                placeholder={checkMode("Phone", "رقم الهاتف").word}
                required
                onChange={(e) => setData({ ...data, phone: e.target.value })}
              />
            </div>
            <div className="flex flex-col   gap-y-1 w-full">
              <span className="text-white">
                {checkMode("Email", "البريد الالكتروني").word}
              </span>
              <input
                className="w-full rounded-md input-form py-2 px-2 "
                type="email"
                placeholder={checkMode("Email", "البريد الالكتروني").word}
                required
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col   gap-y-1 w-full">
              <span className="text-white">
                {checkMode("Language", "لغتك").word}
              </span>
              <select
                className="w-full rounded-md py-1 px-2 "
                required
                onChange={(e) => setData({ ...data, lang: e.target.value })}
              >
                <option>{checkMode("Choose", "اختر").word}</option>
                <option> {checkMode("Arabic", "عربي").word} </option>
                <option>{checkMode("English", "انجليزي").word}</option>
              </select>
            </div>
            <div className="flex flex-col   gap-y-1 w-full">
              <span className="text-white">
                {checkMode("Licence Type", "نوع الرخصه").word}
              </span>
              <select
                className="w-full rounded-md py-1 px-2 "
                required
                onChange={(e) =>
                  setData({ ...data, licence_type: e.target.value })
                }
              >
                <option>{checkMode("Choose", "اختر").word}</option>
                <option>{checkMode("Private", "خاصه").word}</option>
                <option> {checkMode("Public", "عامه").word}</option>
                <option>
                  {checkMode("Driving permit", "تصريح قياده").word}
                </option>
              </select>
            </div>
            <div className="flex flex-col   gap-y-1 w-full">
              <span className="text-white">
                {" "}
                {checkMode("Car Type", " نوع القير").word}
              </span>
              <select
                className="w-full rounded-md py-1 px-2 "
                required
                onChange={(e) => setData({ ...data, car_type: e.target.value })}
              >
                <option>{checkMode("Choose", "اختر").word}</option>
                <option> {checkMode("Manual", "يدوي").word}</option>
                <option>{checkMode("Automatic", "اوتوماتيك").word}</option>
              </select>
            </div>

            {data.service === "استبدال" ? (
              <div className="flex flex-col   gap-y-1 w-full">
                <span className="text-white">
                  {checkMode("Test Time", "وقت الاختبار").word}
                </span>
                <select
                  className="w-full rounded-md py-1 px-2 "
                  required
                  onChange={(e) => setData({ ...data, time: e.target.value })}
                >
                  <option>{checkMode("Choose", "اختر").word}</option>
                  <option>
                    {
                      checkMode(
                        "At Morning",
                        "فتره صباحيه الساعة ٨ صباحا  -  الى الساعة ٢ مساء  "
                      ).word
                    }
                  </option>
                  <option>
                    {
                      checkMode(
                        "At Evening",
                        "  فتره مسائيه الساعة ٦ مساءا الى ٨:٣٠ مساءا "
                      ).word
                    }
                  </option>
                </select>
                <div className="flex flex-col   gap-y-1 w-full">
                  <span className="text-white">
                    {" "}
                    {checkMode("Check Time ", "تاريخ موعد الفحص  ").word}
                  </span>
                  <input
                    value={data.check_time}
                    type="date"
                    className="w-full rounded-md py-1 px-2 "
                    required
                    onChange={(e) =>
                      setData({ ...data, check_time: e.target.value })
                    }
                  />
                </div>
                
              </div>
            ) : (
              <>
                <div className="flex flex-col   gap-y-1 w-full">
                  <span className="text-white">
                    {checkMode("Train Time", "وقت التدريب").word}
                  </span>
                  <select
                    className="w-full rounded-md py-1 px-2 "
                    required
                    onChange={(e) => setData({ ...data, time: e.target.value })}
                  >
                    <option>{checkMode("Choose", "اختر").word}</option>
                    <option>
                      {
                        checkMode(
                          "At Morning",
                          "فتره صباحيه الساعة ٨ صباحا  -  الى الساعة ٢ مساء  "
                        ).word
                      }
                    </option>
                    <option>
                      {
                        checkMode(
                          "At Evening",
                          "                           فتره مسائيه الساعة ٦ مساءا الى ٨:٣٠ مساءا "
                        ).word
                      }
                    </option>
                  </select>
                </div>
                <div className="flex flex-col   gap-y-1 w-full">
                  <span className="text-white">
                    {" "}
                    {checkMode("Check Time ", "تاريخ موعد الفحص  ").word}
                  </span>
                  <input
                    value={data.check_time}
                    type="date"
                    className="w-full rounded-md py-1 px-2 "
                    required
                    onChange={(e) =>
                      setData({ ...data, check_time: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col   gap-y-1 w-full">
                  <span className="text-white">
                    {" "}
                    {checkMode("Train Language", "لغه التدريب ").word}
                  </span>
                  <select
                    className="w-full rounded-md py-1 px-2 "
                    required
                    onChange={(e) =>
                      setData({ ...data, train_lang: e.target.value })
                    }
                  >
                    <option>{checkMode("Choose", "اختر").word}</option>
                    <option>{checkMode("Arabic", "عربي").word}</option>
                    <option>{checkMode("English", "انجليزي").word}</option>
                  </select>
                </div>
              </>
            )}

            <div className="w-full bg-slate-300 p-3 rounded-md text-center lg:col-span-2">
              <span className="text-center text-green-800 w-full">
                {
                  checkMode(
                    "Note: According to the traffic system, the minimum age to obtain a temporary driving permit is 17 years and the minimum age to obtain a driving license is 18 years.",
                    "ملاحظة: حسب نظام المرور فإن الحد الأدنى للحصول على تصريح القيادة المؤقتة هو 17 سنة والحد الأدنى للحصول على رخصة قيادة هو 18 سنة."
                  ).word
                }
              </span>
            </div>
            <div className="flex items-center justify-center lg:col-span-2">
              <button
                type="submit"
                className="text-white font-bold bg-green-400 w-1/2 py-3 rounded-lg hover:opacity-60 transition-all"
              >
                {checkMode("Submit", "تقديم").word}
              </button>
            </div>
          </form>
        </div>
      ) : page === 3 ? (
        <div></div>
      ) : null}
      <span className="text-white bg-black text-center w-full py-3 text-xs md:text-base absolute bottom-0">
        {
          checkMode(
            "All rights reserved to Absher, Kingdom of Saudi Arabia ©",
            "جميع الحقوق محفوظة لأبشر، المملكة العربية السعودية ©"
          ).word
        }
      </span>
    </div>
  );
};

export default Services;
