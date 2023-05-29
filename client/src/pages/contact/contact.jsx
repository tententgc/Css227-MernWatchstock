import React, { useState, useRef } from "react";
import emailjs from "emailjs-com";
import MainLayout from "../../components/MainLayout";
import { images } from "../../constants";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const form = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_z4r2qbo",
        "template_9ge0o65",
        form.current,
        "4PmhhqSxwrrkiQH7t"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row items-center bg-white min-h-screen">
        <div className="w-full md:w-1/2">
          <img
            src={images.Contact}
            alt="Your description"
            className="object-cover h-64 md:h-full w-full"
          />
        </div>
        <div className="w-full md:w-1/2">
          <form
            ref={form}
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-4 md:p-6 my-10 bg-white rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-gray-700">Full Name</span>
                <input
                  type="text"
                  value={name}
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-600 focus:ring focus:ring-orange-600 focus:ring-opacity-50"
                  placeholder="tenten tgc"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Email Address</span>
                <input
                  type="email"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-600 focus:ring focus:ring-orange-600 focus:ring-opacity-50"
                  placeholder="Example@gmail.com"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Message</span>
                <textarea
                  value={message}
                  name="message"
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-600 focus:ring focus:ring-orange-600 focus:ring-opacity-50"
                  rows={3}
                  placeholder="Type your message..."
                ></textarea>
              </label>
              <div className="block">
                <button
                  type="submit"
                  className="mt-1 block w-full py-2 px-4 rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:bg-orange-700"
                >
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
