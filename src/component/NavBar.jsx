import React from "react";
import { TbWorld } from "react-icons/tb";

import { FiSearch } from "react-icons/fi";

const NavBar = ({ setMode, mode, checkMode }) => {
  return (
    <div
      className="w-full flex flex-col md:flex-row justify-around bg-white drop-shadow-lg p-2"
      dir={`${checkMode() === "ar" ? "rtl" : "ltr"}`}
    >
      <div className="w-full  py-4 hidden  justify-around md:flex">
        <div className="flex 1/2">
          <div className="flex  items-center gap-x-8 w-full  px-4">
            <div
              className="hidden justify-center items-center md:flex-1 md:flex   gap-x-2 md:gap-x-5  mx-4 cursor-pointer "
              onClick={() => (window.location.href = "/main")}
            >
              <img
                src="/main_images/nav.svg"
                className="w-10 h-10 md:w-12 md:h-12 "
              />
            </div>
            <span className="font-bold cursor-pointer hover:opacity-75 transition-all">
              {checkMode(" Home", "الرئيسية").word}
            </span>
            <span className="font-bold cursor-pointer hover:opacity-75 transition-all">
              {checkMode(" About Abshr ", "   عن أبشر").word}
            </span>
            <span className="font-bold cursor-pointer hover:opacity-75 transition-all">
              {
                checkMode(
                  "  	eParticipation  ",
                  "             المشاركة القانونية "
                ).word
              }
            </span>
            <span className="font-bold cursor-pointer hover:opacity-75 transition-all">
              {checkMode(" Service Guide ", " دليل الخدمات ").word}
            </span>
          </div>
          <div
            className="md:hidden justify-center items-center  flex   gap-x-2   mx-4 cursor-pointer "
            onClick={() => (window.location.href = "/main")}
          >
            <img
              src="/main_images/nav1.png"
              className="w-10 h-10 md:w-20 md:h-20 lg:w-24 lg:h-24 lg:ml-8"
              style={
                mode === "ar"
                  ? { borderLeft: "1px solid #eee" }
                  : { borderRight: "1px solid #eee" }
              }
            />
            <img
              src="/main_images/nav2.png"
              className="w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20"
            />
          </div>
        </div>

        <div className="flex md:w-1/2 justify-between items-center py-2 w-full">
          <div className="flex gap-x-8 flex-1  items-center   justify-center">
            <span className="font-bold cursor-pointer hover:opacity-75 transition-all">
              {checkMode(" Other Absher Platforms ", " منصات أبشر الأخري").word}
            </span>
            <span
              className=" cursor-pointer select-none hover:text-blue-900 flex gap-x-3 font-bold items-center   pb-1  md:text-base w-fit "
              onClick={() => {
                localStorage.setItem("lang", mode === "ar" ? "en" : "ar");
                setMode(mode === "ar" ? "en" : "ar");
              }}
            >
              <TbWorld className="text-green-800" />
              {mode === "ar" ? "English" : "العربيه"}
            </span>{" "}
            <span className=" cursor-pointer select-none hover:text-blue-900 flex gap-x-3 font-bold items-center   pb-1  md:text-base w-fit ">
              <FiSearch className="text-black" />
              {checkMode("Search", "ابحث").word}
            </span>
            <div
              className="hidden  justify-center items-center  md:flex   gap-x-2 md:gap-x-5  mx-4 cursor-pointer "
              onClick={() => (window.location.href = "/main")}
            >
              <img
                src="/main_images/nav1.png"
                className="w-20 h-10 "
                style={
                  mode === "ar"
                    ? { borderLeft: "1px solid #eee" }
                    : { borderRight: "1px solid #eee" }
                }
              />

              <img src="/main_images/nav3.jpg" className="w-10 h-10 " />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden w-full p-1 flex justify-between">
        <div className="w-1/2 flex items-center ">
          <img className="w-16 h-16" src="/navbar1.png" />
        </div>
        <div className="w-1/2 flex items-center gap-x-4 justify-center">
          <img className="w-10" src="/navbar2.png" />
          <img
            className="w-5"
            src="/navbar3.png"
            onClick={() => {
              localStorage.setItem("lang", mode === "ar" ? "en" : "ar");
              setMode(mode === "ar" ? "en" : "ar");
            }}
          />
          <img className="w-6" src="/navbar4.png" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
