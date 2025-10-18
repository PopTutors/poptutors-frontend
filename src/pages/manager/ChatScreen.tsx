import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    GraduationCap,
    Users,
    Phone,
    Image,
    Mic,
    Plus,
    Send,
    Check,
    RotateCw,
} from "lucide-react";
import { StudentSwitchIcon, TeacherSwitchIcon } from "../../assets/managers";

// ------------------ MOCK DATA ---------------------
interface ChatItem {
    id: string;
    name: string;
    message: string;
    time: string;
    avatar: string;
    unread?: number;
    online?: boolean;
}

const initialChats: ChatItem[] = [
    {
        id: "1",
        name: "Sophia Wilson",
        message: "Hey, are you available?",
        time: "09:21 AM",
        avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/e0dde27bbf0bb42ab3deb4a79cfafa4781fda053?width=96",
        online: true,
    },
    {
        id: "2",
        name: "Jenny Wilson",
        message: "Thanks for the update!",
        time: "10:15 AM",
        avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/e0dde27bbf0bb42ab3deb4a79cfafa4781fda053?width=96",
    },
    {
        id: "3",
        name: "Marvin McKinney",
        message: "Let's finalize the price",
        time: "11:05 AM",
        avatar:
            "https://api.builder.io/api/v1/image/assets/TEMP/e0dde27bbf0bb42ab3deb4a79cfafa4781fda053?width=96",
        online: true,
    },
];

// ------------------ MAIN COMPONENT ---------------------
export default function ChatPage() {
    const [chats, setChats] = useState(initialChats);
    const [activeChatId, setActiveChatId] = useState("1");
    const [search, setSearch] = useState("");

    const [messages, setMessages] = useState < Record < string, any[]>> ({
        "1": [
            { id: "m1", from: "them", text: "Offered Price $125", time: "09:21 AM" },
            { id: "m2", from: "me", text: "Negotiation Price $100", time: "09:22 AM" },
        ],
        "2": [{ id: "m1", from: "them", text: "Thanks!", time: "10:10 AM" }],
        "3": [
            { id: "m1", from: "them", text: "Let's discuss pricing", time: "11:00 AM" },
        ],
    });

    const [newMsg, setNewMsg] = useState("");
    const scrollRef = useRef < HTMLDivElement | null > (null);

    const activeChat = chats.find((c) => c.id === activeChatId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, activeChatId]);

    const handleSend = () => {
        if (!newMsg.trim()) return;
        const msg = {
            id: `m${Date.now()}`,
            from: "me",
            text: newMsg,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), msg],
        }));
        setNewMsg("");
    };

    const handleAccept = () => {
        const msg = {
            id: `m${Date.now()}`,
            from: "me",
            text: "Accepted 👍🏻",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), msg],
        }));
    };

    const handleRenegotiate = () => {
        const msg = {
            id: `m${Date.now()}`,
            from: "me",
            text: "Renegotiation Price $120",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), msg],
        }));
    };

    const filteredChats = chats.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    // ------------------ RENDER ---------------------
    return (
        <div className="flex w-full h-[90vh] bg-gray-50 overflow-hidden">
            {/* LEFT SIDEBAR - CHAT LIST */}
            <div className="flex flex-col w-[380px] bg-white border-r border-gray-200">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
                        <div className="flex border border-gray-200">
                            <button className="p-2 hover:bg-gray-50">
                                <img src={StudentSwitchIcon} className="w-[18px] h-[18px]" />
                            </button>
                            <button className="p-2 bg-gray-900 text-white hover:bg-gray-800 ">
                                <img src={TeacherSwitchIcon} className="w-[18px] h-[18px]" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center mt-3 px-3 py-2 border border-gray-200 bg-gray-50">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                            className="flex-1 bg-transparent border-none outline-none text-sm ml-2"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    {filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={`flex items-center gap-3 p-4 cursor-pointer transition ${chat.id === activeChatId ? "bg-primary/5" : "hover:bg-gray-50"
                                }`}
                        >
                            <div className="relative">
                                <img
                                    src={chat.avatar}
                                    alt={chat.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium font-inter text-[16px] text-[#141414] truncate">{chat.name}</h3>
                                    <span className="text-[12px] text-[#8E8E93] font-regular font-inter">{chat.time}</span>
                                </div>
                                <p className="text-[14px] text-[#8E8E93] font-regular font-inter">{chat.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE - CHAT CONVERSATION */}
            {activeChat ? (
                <div className="flex-1 flex flex-col p-5 bg-white shadow-inner">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-3 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14">
                                <img
                                    src={activeChat.avatar}
                                    alt={activeChat.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                                {activeChat.online && (
                                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                )}
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">{activeChat.name}</h2>
                                <p className="text-sm text-gray-500">
                                    {activeChat.online ? "Active Now" : "Offline"}
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
                            <Phone className="w-4 h-4 text-primary" />
                            <span className="text-primary text-sm font-medium">Connect</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto flex flex-col gap-5 p-3 bg-gray-50 rounded-lg"
                    >
                        {messages[activeChatId]?.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-2 ${msg.from === "me" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {msg.from !== "me" && (
                                    <img
                                        src={activeChat.avatar}
                                        alt="user"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                )}
                                <div
                                    className={`p-3 rounded-lg text-sm ${msg.from === "me"
                                        ? "bg-primary text-white rounded-br-none"
                                        : "bg-white border"
                                        }`}
                                >
                                    {msg.text}
                                    <div className="text-[10px] mt-1 opacity-60">{msg.time}</div>
                                </div>
                                {msg.from === "me" && (
                                    <img
                                        src="https://api.builder.io/api/v1/image/assets/TEMP/5fc1647f8cfe1254a84405a6fb9f53c12d4f6dac?width=80"
                                        alt="me"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                )}
                            </div>
                        ))}

                        {/* Accept / Renegotiate Buttons */}
                        <div className="flex items-center justify-center gap-3 pt-4">
                            <button
                                onClick={handleAccept}
                                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                            >
                                <Check className="w-4 h-4" /> Accept
                            </button>
                            <button
                                onClick={handleRenegotiate}
                                className="flex items-center gap-2 px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90"
                            >
                                <RotateCw className="w-4 h-4" /> Renegotiate
                            </button>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-3 h-12 mt-4 px-4 border border-gray-200 rounded-md bg-gray-50">
                        <input
                            value={newMsg}
                            onChange={(e) => setNewMsg(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                        />
                        <div className="flex items-center gap-3">
                            <Image className="w-5 h-5 text-gray-700 hover:text-primary cursor-pointer" />
                            <Mic className="w-5 h-5 text-gray-700 hover:text-primary cursor-pointer" />
                            <Plus className="w-5 h-5 text-gray-700 hover:text-primary cursor-pointer" />
                        </div>
                        <div className="w-[1px] h-5 bg-gray-300" />
                        <button onClick={handleSend}>
                            <Send className="w-5 h-5 text-primary hover:text-primary/80" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                    Select a chat to start messaging
                </div>
            )}
        </div>
    );
}
