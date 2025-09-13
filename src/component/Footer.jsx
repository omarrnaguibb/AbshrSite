import React from "react";
import { BsEye, BsSnapchat, BsTwitterX, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";

const Footer = ({ checkMode }) => {
  const mode = localStorage.getItem("lang");
  return (
    // <div className="w-full my-2" dir={mode === "ar" ? "rtl" : "ltr"}>
    //   <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-y-8 place-items-center bg-white py-8">
    //     <div className="flex flex-col gap-y-2 items-center justify-center w-11/12">
    //       <span className="text-sm text-gray-500">
    //         {checkMode("Social Media", "وسائل التواصل الاجتماعي").word}
    //       </span>
    //       <div className="flex gap-x-3 items-center justify-center w-11/12">
    //         <FaFacebook
    //           className="bg-white text-gray-400 rounded-full text-3xl p-1 cursor-pointer"
    //           style={{ border: "1px solid #eee" }}
    //         />
    //         <BsYoutube
    //           className="bg-white text-gray-400 rounded-full text-3xl p-1 cursor-pointer"
    //           style={{ border: "1px solid #eee" }}
    //         />
    //         <BsSnapchat
    //           className="bg-white text-gray-400 rounded-full text-3xl p-1 cursor-pointer"
    //           style={{ border: "1px solid #eee" }}
    //         />
    //         <BsTwitterX
    //           className="bg-white text-gray-400 rounded-full text-3xl p-1 cursor-pointer"
    //           style={{ border: "1px solid #eee" }}
    //         />
    //       </div>
    //       <span className="text-sm text-gray-500">
    //         {checkMode("Help Tools", "ادوات المساعده").word}
    //       </span>
    //       <div className="flex gap-x-3 items-start justify-center w-11/12">
    //         <BsEye
    //           className="bg-white text-gray-400 rounded-full text-3xl p-1 cursor-pointer"
    //           style={{ border: "1px solid #eee" }}
    //         />
    //         <span
    //           className="bg-white text-gray-400 rounded-full text-base p-1 cursor-pointer"
    //           style={{ border: "1px solid #eee" }}
    //         >
    //           +A
    //         </span>
    //         <span
    //           className="bg-white text-gray-400 rounded-full text-base p-1 cursor-pointer"
    //           style={{ border: "1px solid #eee" }}
    //         >
    //           -A
    //         </span>
    //       </div>
    //       <span className="bg-green-500  text-white px-8 py-2 rounded-lg">
    //         {checkMode("Sign language support", "  دعم لغه الاشاره ").word}
    //       </span>
    //     </div>
    //     <div className="flex flex-col gap-y-3 items-center justify-center w-11/12">
    //       <span className="text-sm text-gray-500">
    //         {checkMode("Abshr Platform", "عن منصه ابشر").word}
    //       </span>
    //       <div className="flex flex-col justify-center items-center gap-y-3">
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {checkMode("About Abshr ", "عن ابشر").word}
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {checkMode("privacy & policy", "سياسه الخصوصيه ").word}
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {checkMode("terms of use", "شروط الاستخدام  ").word}
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {
    //             checkMode("Service level agreement", " اتفاقيه مستوي الخدمه  ")
    //               .word
    //           }
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {checkMode("Accessibility tools", "ادوات سهوله الوصول    ").word}
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {checkMode("Information Security", "   امن المعلومات ").word}
    //         </span>
    //       </div>
    //     </div>
    //     <div className="flex flex-col gap-y-3 items-center justify-center w-11/12">
    //       <span className="text-sm text-gray-500">
    //         {checkMode("Help & Support", "المساعده و الدعم").word}
    //       </span>
    //       <div className="flex flex-col justify-center items-center gap-y-3 w-11/12">
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {checkMode("Contact Us", "اتصل بنا   ").word}
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {checkMode("Report of corruption", "بلاغ عن فساد ").word}
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {checkMode("Common Questions", "الاسئله الشائعه ").word}
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {checkMode("Service channels", "قنوات الخدمه ").word}
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {checkMode("Accessibility tools", "ادوات سهوله الوصول").word}
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {checkMode("Information Security ", " امن المعلومات").word}
    //         </span>
    //       </div>
    //     </div>
    //     <div className="flex flex-col gap-y-3 items-center justify-center w-11/12">
    //       <span className="text-sm text-gray-500">
    //         {" "}
    //         {checkMode("Important Links", "روابط مهمه ").word}
    //       </span>
    //       <div className="flex flex-col justify-center items-center  gap-y-3 w-11/12">
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {
    //             checkMode("Ministry of Interior links", "روابط وزاره الداخلية ")
    //               .word
    //           }
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {
    //             checkMode(
    //               "The unified national platform",
    //               " المنصه الوطنيه الموحده "
    //             ).word
    //           }
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {
    //             checkMode(
    //               "National strategy for data and artificial intelligence",
    //               "الاستراتيجية الوطنية للبيانات والذكاء الاصطناعي      "
    //             ).word
    //           }
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {checkMode("Abshr Platform", "منصة البيانات المفتوحة ").word}
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {
    //             checkMode(
    //               "Electronic participation portal",
    //               "بوابة المشاركة الالكترونية "
    //             ).word
    //           }
    //         </span>
    //         <span className="text-xs text-gray-400 cursor-pointer">
    //           {" "}
    //           {
    //             checkMode(
    //               "Financial Services Platform ",
    //               "منصة الخدمات المالية (اعتماد)  "
    //             ).word
    //           }
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="w-full flex flex-col gap-y-3 items-center justify-center">
    //     <div className="bg-green-600 rounded-b-lg py-5 w-full flex flex-col items-center justify-center">
    //       <img src="/main_images/footer.png" className="w-16 h-16" />
    //       <span className="text-white">920020405</span>
    //     </div>
    //     <div className="flex items-center justify-center bg-white mb-2">
    //       <img src="/main_images/huawei.png" className="w-20 " />
    //       <img src="/main_images/apple.png" className="w-20 " />
    //       <img src="/main_images/google.png" className="w-20 " />
    //     </div>
    //   </div>
    //   <div className="w-full bg-white flex flex-col gap-y-3 py-2">
    //     <div className="flex items-center justify-center gap-x-2">
    //       <span className="navDesc lg:text-sm">
    //         {checkMode("Website Map", " خريطه الموقع  ").word}
    //       </span>
    //       <span className="navDesc lg:text-sm">|</span>
    //       <span className="navDesc lg:text-sm">
    //         {checkMode("Calendar", "التقويم").word}
    //       </span>
    //     </div>
    //     <span className="text-center text-gray-400 cursor-pointer navDesc">
    //       {" "}
    //       {
    //         checkMode(
    //           "Developing and operating the National Information Center",
    //           "تطوير وتشغيل مركز المعلومات الوطني "
    //         ).word
    //       }
    //     </span>
    //   </div>
    // </div>
    <div className="w-full flex items-center justify-center">
      {mode === "ar" ? <img src="/home14.png" /> : <img src="/home14web.png" />}

    </div>
  );
};

export default Footer;
