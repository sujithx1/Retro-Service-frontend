import type React from "react"
import { useState } from "react"

interface Employee {
  username: string
}

interface Message {
  message: string
  from: string
}

const ChatComponent: React.FC<{ employee?: Employee; messages: Message[] }> = ({ employee, messages }) => {
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    // Add logic to send the message here
    console.log("Sending message:", inputMessage)
    setInputMessage("")
  }

  return (
    <div className="w-3/4 bg-white flex flex-col h-screen shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <div className="w-12 h-12 bg-white rounded-full mr-3 flex items-center justify-center text-purple-500 font-bold text-lg">
          {employee?.username?.[0].toUpperCase() || "E"}
        </div>
        <div>
          <h3 className="text-xl font-bold">{employee?.username || "Employee"}</h3>
          <p className="text-sm text-purple-200">Online</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.from === "You" ? "flex justify-end" : "flex justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                msg.from === "You"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                  : "bg-white text-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-md"
              } p-4`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className={`text-xs mt-1 ${msg.from === "You" ? "text-purple-200" : "text-gray-500"}`}>{msg.from}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
          <input
            type="text"
            className="flex-1 p-3 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage()
            }}
          />
          <button
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:from-purple-600 hover:to-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatComponent

