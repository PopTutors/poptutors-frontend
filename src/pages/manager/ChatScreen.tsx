// // components/ChatScreen.tsx
// "use client";

// import React, { useState, useRef, useEffect } from 'react';
// import {
//     Search,
//     MoreVertical,
//     Settings,
//     Phone,
//     Video,
//     Send,
//     Paperclip,
//     Smile,
//     Check,
//     CheckCheck,
//     Circle
// } from 'lucide-react';
// import { Button } from '../../components/ui/button';
// import { Input } from '../../components/ui/input';
// import { Avatar } from '../../components/ui/avatar';

// // Types
// interface Contact {
//     id: string;
//     name: string;
//     lastMessage: string;
//     time: string;
//     avatar: string;
//     unreadCount?: number;
//     isOnline?: boolean;
// }

// interface Message {
//     id: string;
//     senderId: string;
//     content: string;
//     timestamp: string;
//     type: 'text' | 'price' | 'negotiation' | 'accepted' | 'system';
//     isCurrentUser: boolean;
//     status?: 'sent' | 'delivered' | 'read';
//     priceData?: {
//         yourPrice: number;
//         offeredPrice: number;
//         negotiationPrice?: number;
//         isAccepted?: boolean;
//     };
// }

// // Sample data
// const contacts: Contact[] = [
//     {
//         id: '1',
//         name: 'Sophia Wilson',
//         lastMessage: 'Hello...',
//         time: '09:21 AM',
//         avatar: '/avatars/sophia.jpg',
//         unreadCount: 1,
//         isOnline: true
//     },
//     {
//         id: '2',
//         name: 'Jenny Wilson',
//         lastMessage: 'Thank you so much, sir',
//         time: '2 d',
//         avatar: '/avatars/jenny.jpg',
//         unreadCount: 1
//     },
//     {
//         id: '3',
//         name: 'Marvin McKinney',
//         lastMessage: 'You\'re Welcome',
//         time: '1 m',
//         avatar: '/avatars/marvin.jpg',
//         unreadCount: 1
//     },
//     {
//         id: '4',
//         name: 'Eleanor Pena',
//         lastMessage: 'Thank you so much, sir',
//         time: '1 m',
//         avatar: '/avatars/eleanor.jpg'
//     },
//     {
//         id: '5',
//         name: 'Ronald Richards',
//         lastMessage: 'Sorry, I can\'t help you',
//         time: '2 m',
//         avatar: '/avatars/ronald.jpg'
//     },
//     {
//         id: '6',
//         name: 'Kathryn Murphy',
//         lastMessage: 'new message',
//         time: '2 m',
//         avatar: '/avatars/kathryn.jpg'
//     },
//     {
//         id: '7',
//         name: 'Jacob Jones',
//         lastMessage: 'Thank you so much, sir',
//         time: '6 m',
//         avatar: '/avatars/jacob.jpg'
//     },
//     {
//         id: '8',
//         name: 'Cameron Williamson',
//         lastMessage: 'It\'s okay, no problem brother, I will fix everything...',
//         time: '6 m',
//         avatar: '/avatars/cameron.jpg'
//     }
// ];

// const currentUser = {
//     id: 'current',
//     name: 'You',
//     avatar: '/avatars/current-user.jpg'
// };

// const activeContact: Contact = {
//     id: 'jane-cooper',
//     name: 'Jane Cooper',
//     lastMessage: '',
//     time: '',
//     avatar: '/avatars/jane.jpg',
//     isOnline: true
// };

// const messages: Message[] = [
//     {
//         id: '1',
//         senderId: 'jane-cooper',
//         content: '',
//         timestamp: '09:21 AM',
//         type: 'price',
//         isCurrentUser: false,
//         priceData: {
//             yourPrice: 110,
//             offeredPrice: 125
//         }
//     },
//     {
//         id: '2',
//         senderId: 'current',
//         content: 'Negotiation Price $100',
//         timestamp: '09:21 AM',
//         type: 'negotiation',
//         isCurrentUser: true,
//         status: 'read'
//     },
//     {
//         id: '3',
//         senderId: 'jane-cooper',
//         content: 'Renegotiation Price $120',
//         timestamp: '09:21 AM',
//         type: 'negotiation',
//         isCurrentUser: false
//     },
//     {
//         id: '4',
//         senderId: 'current',
//         content: 'Accepted ✓',
//         timestamp: '09:21 AM',
//         type: 'accepted',
//         isCurrentUser: true,
//         status: 'read'
//     },
//     {
//         id: '5',
//         senderId: 'jane-cooper',
//         content: 'Offer Accepted. Pay advance to start work',
//         timestamp: '',
//         type: 'system',
//         isCurrentUser: false
//     }
// ];

// // Contact List Component
// const ContactList = ({
//     contacts,
//     activeContactId,
//     onContactSelect
// }: {
//     contacts: Contact[];
//     activeContactId: string;
//     onContactSelect: (contact: Contact) => void;
// }) => {
//     const [searchQuery, setSearchQuery] = useState('');

//     const filteredContacts = contacts.filter(contact =>
//         contact.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full">
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200">
//                 <div className="flex items-center justify-between mb-4">
//                     <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
//                     <div className="flex items-center gap-2">
//                         <Button variant="ghost" size="sm" className="p-2">
//                             <Settings className="h-4 w-4" />
//                         </Button>
//                         <Button variant="ghost" size="sm" className="p-2">
//                             <MoreVertical className="h-4 w-4" />
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Search */}
//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                         placeholder="Search..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="pl-10 h-10"
//                     />
//                 </div>
//             </div>

//             {/* Contact List */}
//             <div className="flex-1 overflow-y-auto">
//                 {filteredContacts.map((contact) => (
//                     <div
//                         key={contact.id}
//                         onClick={() => onContactSelect(contact)}
//                         className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${activeContactId === contact.id ? 'bg-blue-50' : ''
//                             }`}
//                     >
//                         <div className="relative">
//                             <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                                 <img
//                                     src={contact.avatar}
//                                     alt={contact.name}
//                                     className="w-full h-full object-cover"
//                                     onError={(e) => {
//                                         const target = e.target as HTMLImageElement;
//                                         target.style.display = 'none';
//                                         target.nextElementSibling!.textContent = contact.name.split(' ').map(n => n[0]).join('');
//                                     }}
//                                 />
//                                 <span className="text-sm font-medium text-gray-600">
//                                     {contact.name.split(' ').map(n => n[0]).join('')}
//                                 </span>
//                             </div>
//                             {contact.isOnline && (
//                                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                             )}
//                         </div>

//                         <div className="flex-1 min-w-0">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
//                                 <span className="text-xs text-gray-500">{contact.time}</span>
//                             </div>
//                             <p className="text-sm text-gray-600 truncate mt-1">{contact.lastMessage}</p>
//                         </div>

//                         {contact.unreadCount && (
//                             <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
//                                 <span className="text-xs text-white">{contact.unreadCount}</span>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// // Price Section Component
// const PriceSection = ({ priceData }: { priceData: any }) => {
//     return (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
//             <div className="text-sm font-medium text-blue-900 mb-2">Price Section</div>
//             <div className="space-y-1">
//                 <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Your Price</span>
//                     <span className="font-medium">${priceData.yourPrice}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Offered Price</span>
//                     <span className="font-medium">${priceData.offeredPrice}</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Message Component
// const MessageBubble = ({ message }: { message: Message }) => {
//     const renderMessageContent = () => {
//         switch (message.type) {
//             case 'price':
//                 return <PriceSection priceData={message.priceData} />;

//             case 'negotiation':
//                 return (
//                     <div className={`px-4 py-2 rounded-full text-sm font-medium ${message.isCurrentUser
//                         ? 'bg-blue-500 text-white'
//                         : 'bg-gray-200 text-gray-900'
//                         }`}>
//                         {message.content}
//                     </div>
//                 );

//             case 'accepted':
//                 return (
//                     <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
//                         <span>{message.content}</span>
//                     </div>
//                 );

//             case 'system':
//                 return (
//                     <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">
//                         {message.content}
//                     </div>
//                 );

//             default:
//                 return (
//                     <div className={`px-4 py-2 rounded-lg text-sm ${message.isCurrentUser
//                         ? 'bg-blue-500 text-white'
//                         : 'bg-gray-100 text-gray-900'
//                         }`}>
//                         {message.content}
//                     </div>
//                 );
//         }
//     };

//     return (
//         <div className={`flex items-end gap-2 mb-4 ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
//             {!message.isCurrentUser && (
//                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
//                     <img
//                         src={activeContact.avatar}
//                         alt={activeContact.name}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                             const target = e.target as HTMLImageElement;
//                             target.style.display = 'none';
//                             target.nextElementSibling!.textContent = activeContact.name[0];
//                         }}
//                     />
//                     <span className="text-xs font-medium text-gray-600">{activeContact.name[0]}</span>
//                 </div>
//             )}

//             <div className={`flex flex-col ${message.isCurrentUser ? 'items-end' : 'items-start'}`}>
//                 {renderMessageContent()}

//                 <div className="flex items-center gap-1 mt-1">
//                     {message.timestamp && (
//                         <span className="text-xs text-gray-500">{message.timestamp}</span>
//                     )}
//                     {message.isCurrentUser && message.status && (
//                         <div className="text-blue-500">
//                             {message.status === 'sent' && <Check className="h-3 w-3" />}
//                             {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
//                             {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {message.isCurrentUser && (
//                 <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
//                     <span className="text-xs font-medium text-white">Y</span>
//                 </div>
//             )}
//         </div>
//     );
// };

// // Chat Area Component
// const ChatArea = ({ contact }: { contact: Contact }) => {
//     const [messageText, setMessageText] = useState('');
//     const messagesEndRef = useRef < HTMLDivElement > (null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const handleSendMessage = () => {
//         if (messageText.trim()) {
//             // Handle send message logic here
//             console.log('Sending message:', messageText);
//             setMessageText('');
//         }
//     };

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     return (
//         <div className="flex-1 flex flex-col h-full bg-white">
//             {/* Chat Header */}
//             <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
//                 <div className="flex items-center gap-3">
//                     <div className="relative">
//                         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                             <img
//                                 src={contact.avatar}
//                                 alt={contact.name}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                     const target = e.target as HTMLImageElement;
//                                     target.style.display = 'none';
//                                     target.nextElementSibling!.textContent = contact.name[0];
//                                 }}
//                             />
//                             <span className="text-sm font-medium text-gray-600">{contact.name[0]}</span>
//                         </div>
//                         {contact.isOnline && (
//                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                         )}
//                     </div>
//                     <div>
//                         <h2 className="font-semibold text-gray-900">{contact.name}</h2>
//                         <p className="text-sm text-green-600">Active Now</p>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                     <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white px-4">
//                         Connect
//                     </Button>
//                     <Button variant="ghost" size="sm" className="p-2">
//                         <Phone className="h-4 w-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm" className="p-2">
//                         <Video className="h-4 w-4" />
//                     </Button>
//                 </div>
//             </div>

//             {/* Today Label */}
//             <div className="text-center py-2 text-sm text-gray-500 bg-gray-50">
//                 Today
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {messages.map((message) => (
//                     <MessageBubble key={message.id} message={message} />
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>

//             {/* Message Input */}
//             <div className="border-t border-gray-200 p-4 bg-white">
//                 <div className="flex items-center gap-3">
//                     <Button variant="ghost" size="sm" className="p-2 text-gray-400">
//                         <Paperclip className="h-5 w-5" />
//                     </Button>

//                     <div className="flex-1 relative">
//                         <Input
//                             placeholder="Type a message..."
//                             value={messageText}
//                             onChange={(e) => setMessageText(e.target.value)}
//                             onKeyPress={handleKeyPress}
//                             className="pr-12 h-10"
//                         />
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400"
//                         >
//                             <Smile className="h-4 w-4" />
//                         </Button>
//                     </div>

//                     <Button
//                         onClick={handleSendMessage}
//                         disabled={!messageText.trim()}
//                         size="sm"
//                         className="bg-blue-500 hover:bg-blue-600 text-white p-2"
//                     >
//                         <Send className="h-4 w-4" />
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Main Chat Component
// export default function ChatScreen() {
//     const [activeContact, setActiveContact] = useState < Contact > (contacts[0]);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     return (
//         <div className="h-screen flex bg-gray-100">
//             {/* Mobile overlay */}
//             <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
//                 onClick={() => setIsMobileMenuOpen(false)} />

//             {/* Contact List - Mobile Sidebar */}
//             <div className={`lg:relative fixed top-0 left-0 h-full z-30 transform transition-transform duration-300 lg:transform-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//                 }`}>
//                 <ContactList
//                     contacts={contacts}
//                     activeContactId={activeContact.id}
//                     onContactSelect={(contact) => {
//                         setActiveContact(contact);
//                         setIsMobileMenuOpen(false);
//                     }}
//                 />
//             </div>

//             {/* Chat Area */}
//             <div className="flex-1 flex flex-col">
//                 {/* Mobile Header */}
//                 <div className="lg:hidden bg-white border-b border-gray-200 p-4">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setIsMobileMenuOpen(true)}
//                         className="text-gray-600"
//                     >
//                         ☰ Chats
//                     </Button>
//                 </div>

//                 <ChatArea contact={activeContact} />
//             </div>
//         </div>
//     );
// }
