// app/page.js
"use client";
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  Bot,
  User,
  Globe,
  Book,
  Calculator,
  Atom,
  Music,
  Code,
  HeartPulse,
} from "lucide-react";
import Link from "next/link";

export default function UniversalChatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "হ্যালো! আমি আপনার AI সহায়ক। আপনি আমাকে যেকোনো বিষয়ে প্রশ্ন করতে পারেন - ACCA, বিজ্ঞান, প্রযুক্তি, স্বাস্থ্য, শিল্পকলা বা অন্য কোনো বিষয়।",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get AI response
  const getAIResponse = async (userMessage) => {
    try {
      const prompt = `
      আপনি একজন বহুভাষী AI সহায়ক যিনি যেকোনো বিষয়ে কথা বলতে পারেন। ব্যবহারকারীকে সাহায্য করতে এই নির্দেশাবলী অনুসরণ করুন:

      ১. ভাষা:
         - বাংলা প্রশ্নের বাংলা উত্তর দিন
         - ইংরেজি প্রশ্নের ইংরেজি উত্তর দিন
         - উত্তর পরিষ্কার এবং বোধগম্য করুন

      ২. বিষয়বস্তু:
         - ACCA সম্পর্কিত প্রশ্নের জন্য বিশেষজ্ঞের মত উত্তর দিন
         - অন্যান্য বিষয়ে সাধারণ জ্ঞান ভিত্তিক উত্তর দিন
         - ভুল তথ্য দেবেন না
         - উত্তর ৩০০ শব্দের মধ্যে সীমিত রাখুন

      ৩. টোন:
         - বন্ধুত্বপূর্ণ কিন্তু পেশাদার
         - জটিল বিষয় সহজভাবে ব্যাখ্যা করুন

      ব্যবহারকারীর প্রশ্ন: "${userMessage}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("AI error:", error);
      return "দুঃখিত, আমি এখন উত্তর দিতে পারছি না। পরে আবার চেষ্টা করুন।";
    }
  };

  // Handle sending message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(input);

      // Add bot message
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "ত্রুটি হয়েছে। আবার চেষ্টা করুন",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick question suggestions by category
  const quickQuestions = [
    {
      category: "ACCA",
      icon: <Calculator size={16} />,
      questions: [
        { text: "ACCA পরীক্ষার ফি", question: "ACCA পরীক্ষার ফি কত?" },
        { text: "ACCA সিলেবাস", question: "ACCA সিলেবাসে কি কি বিষয় আছে?" },
      ],
    },
    {
      category: "বিজ্ঞান",
      icon: <Atom size={16} />,
      questions: [
        { text: "কোয়ান্টাম কম্পিউটিং", question: "কোয়ান্টাম কম্পিউটিং কি?" },
        { text: "জিন এডিটিং", question: "CRISPR জিন এডিটিং কিভাবে কাজ করে?" },
      ],
    },
    {
      category: "প্রযুক্তি",
      icon: <Code size={16} />,
      questions: [
        {
          text: "AI ভবিষ্যৎ",
          question: "AI ভবিষ্যতে চাকরির বাজার কেমন পরিবর্তন আনবে?",
        },
        { text: "ব্লকচেইন", question: "ব্লকচেইন টেকনোলজি কিভাবে কাজ করে?" },
      ],
    },
    {
      category: "স্বাস্থ্য",
      icon: <HeartPulse size={16} />,
      questions: [
        { text: "ডায়াবেটিস", question: "ডায়াবেটিস নিয়ন্ত্রণের উপায় কি?" },
        { text: "মানসিক স্বাস্থ্য", question: "মানসিক চাপ কমাতে কি করা উচিত?" },
      ],
    },
    {
      category: "শিল্পকলা",
      icon: <Music size={16} />,
      questions: [
        {
          text: "চিত্রশিল্প",
          question: "বিখ্যাত চিত্রশিল্পী ভিনসেন্ট ভ্যান গগ সম্পর্কে বলুন",
        },
        { text: "সঙ্গীত", question: "রবীন্দ্র সঙ্গীতের বৈশিষ্ট্য কি?" },
      ],
    },
  ];

  return (
    <div className="h-screen">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col p-4 space-y-4 ">
        {/* Header */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-3 space-y-0">
            <Link href="/">
              <Button variant="outline" size="sm" className="cursor-pointer">
                Back To Home
              </Button>
            </Link>
            <Avatar>
              <AvatarImage src="/ai-assistant.png" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <CardTitle>সর্ব বিষয়ক AI সহায়ক</CardTitle>
          </CardHeader>
        </Card>

        {/* Quick Questions by Category */}
        <div className="flex flex-wrap space-4 w-full max-w-4xl pt-20">
          {quickQuestions.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap- text-sm font-medium">
                {category.icon}
                <span>{category.category}</span>
              </div>
              <div className="flex gap-2">
                {category.questions.map((q, qIndex) => (
                  <Button
                    key={qIndex}
                    variant="outline"
                    className="rounded-full gap-2"
                    onClick={() => setInput(q.question)}
                  >
                    {q.text}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Messages */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="h-full p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg p-3 flex items-start gap-2 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.sender === "bot" ? (
                      <Bot className="flex-shrink-0 mt-1" size={18} />
                    ) : (
                      <User className="flex-shrink-0 mt-1" size={18} />
                    )}
                    <div>
                      <p className="whitespace-pre-line">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {format(message.timestamp, "h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-lg p-3 flex items-center gap-2">
                    <Bot className="animate-pulse" size={18} />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Area */}
          <CardFooter className="border-t p-4">
            <form onSubmit={handleSend} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="যেকোনো বিষয়ে জিজ্ঞাসা করুন..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send size={18} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
