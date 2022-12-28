import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  useEffect(() => {
    const sse = new EventSource("http://localhost:4000/api/notif-stream");

    sse.onmessage = (e) => {
      const dataObj = JSON.parse(e.data);
      console.log(dataObj.message);
      toast(dataObj.message);
    };

    sse.onerror = () => {
      sse.close();
    };

    return () => {
      sse.close();
    };
  }, []);

  return <ToastContainer />;
};

export default Notification;
