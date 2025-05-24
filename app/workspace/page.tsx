/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "@/components/solana/ConnectWalletButton";
import Navbar from "@/components/Navbar";
import TrialExpirationModal from "@/components/TrialExpirationModal";
// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Create a custom Progress component since @/components/ui/progress isn't available
const Progress = ({
  value,
  className,
  indicatorClassName,
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
}) => (
  <div className={`w-full bg-gray-800 rounded-full h-2 ${className || ""}`}>
    <div
      className={`h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 ${
        indicatorClassName || ""
      }`}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Icons
import {
  UserRound,
  Calendar,
  CheckCircle,
  Clock,
  Github,
  MessageSquare,
  Send,
  ClipboardList,
  Plus,
  ArrowRight,
  Code,
  Rocket,
  Award,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with real data from API
const initialTeamMembers = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Frontend Dev",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=256",
    walletAddress: "FGj...x3K7",
  },
  {
    id: "2",
    name: "Priya Patel",
    role: "Smart Contract Dev",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256",
    walletAddress: "9Hj...z8P2",
  },
  {
    id: "3",
    name: "Miguel Santos",
    role: "UI/UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256",
    walletAddress: "3Kd...m7R9",
  },
  {
    id: "4",
    name: "You",
    role: "Backend Dev",
    avatar: "",
    walletAddress: "Current User",
  },
];

// const taskStatuses = ["To Do", "In Progress", "Review", "Completed"];

const initialTasks = [
  {
    id: "task-1",
    title: "Set up project repository",
    assignedTo: "1",
    status: "Completed",
    dueDate: "May 16, 2025",
  },
  {
    id: "task-2",
    title: "Create smart contract for team rewards",
    assignedTo: "2",
    status: "In Progress",
    dueDate: "May 18, 2025",
  },
  {
    id: "task-3",
    title: "Design project logo and UI kit",
    assignedTo: "3",
    status: "Review",
    dueDate: "May 17, 2025",
  },
  {
    id: "task-4",
    title: "Implement wallet connection",
    assignedTo: "4",
    status: "To Do",
    dueDate: "May 19, 2025",
  },
  {
    id: "task-5",
    title: "Write project documentation",
    assignedTo: "1",
    status: "To Do",
    dueDate: "May 22, 2025",
  },
];

const mockMessages = [
  {
    id: "msg-1",
    sender: "1",
    text: "Just pushed the initial UI components to the repo",
    timestamp: "10:32 AM",
  },
  {
    id: "msg-2",
    sender: "2",
    text: "Great! I'll review and start integrating with the Solana contract",
    timestamp: "10:45 AM",
  },
  {
    id: "msg-3",
    sender: "3",
    text: "Here's the figma link with our updated designs: figma.com/file/project-designs",
    timestamp: "11:15 AM",
  },
];

const TeamDashboard = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [tasks, setTasks] = useState(initialTasks);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    assignedTo: "",
    status: "To Do",
    dueDate: "",
  });
  
  // Configure trial days
  const TRIAL_DAYS = 15;
  
  // Show trial expired notification after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTrialExpired(true);
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once when component mounts

  // Handle upgrade button click
  const handleUpgrade = () => {
    router.push("/payment")
  };
  
  // Handle notification bar close
  const handleNotificationClose = () => {
    setIsTrialExpired(false);
  };

  // Fetch real user data from API
  useEffect(() => {
    const fetchUsers = async () => {
      if (!publicKey) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/workspace?walletAddress=${publicKey.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        if (data.users && data.users.length > 0) {
          // Transform the users data to match our team members structure
          const fetchedMembers = data.users.map(
            (
              user: {
                userData: {
                  name: any;
                  role: any;
                  profileImage: any;
                  walletAddress: string;
                };
              },
              index: number
            ) => ({
              id: (index + 1).toString(),
              name: user.userData.name || `User ${index + 1}`,
              role: user.userData.role || "Team Member",
              avatar: user.userData.profileImage || "",
              walletAddress: user.userData.walletAddress
                ? `${user.userData.walletAddress.substring(
                    0,
                    4
                  )}...${user.userData.walletAddress.substring(
                    user.userData.walletAddress.length - 4
                  )}`
                : "Unknown",
            })
          );

          // Add the current user
          const updatedMembers = [
            ...fetchedMembers,
            {
              id: "current",
              name: "You",
              role: "Team Member",
              avatar: "",
              walletAddress: publicKey
                ? `${publicKey.toString().substring(0, 4)}...${publicKey
                    .toString()
                    .substring(publicKey.toString().length - 4)}`
                : "Current User",
            },
          ];

          setTeamMembers(updatedMembers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        // Fallback to mock data if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [publicKey]);

  // Calculate project progress
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const progressPercentage = Math.round((completedTasks / tasks.length) * 100);

  // Time remaining calculation
  const hackathonEndDate = new Date("May 30, 2025").getTime();
  const currentDate = new Date().getTime();
  const timeRemaining = hackathonEndDate - currentDate;
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: `msg-${messages.length + 1}`,
        sender: "4", // Current user
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.assignedTo && newTask.dueDate) {
      const task = {
        id: `task-${tasks.length + 1}`,
        ...newTask,
        dueDate: new Date(newTask.dueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        assignedTo: "",
        status: "To Do",
        dueDate: "",
      });
      setIsAddTaskModalOpen(false);
    }
  };

  // Rendering helpers
  const getTeamMemberById = (id: string) =>
    teamMembers.find((member) => member.id === id);

  // Add current user ID constant
  const CURRENT_USER_ID = "current";

  if (!publicKey) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen pt-16 pb-24 md:pb-16">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="backdrop-blur-xl bg-white/2 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] rounded-xl p-8 text-center">
                <h2 className="text-xl font-bold mb-4">
                  Connect Wallet to Access Team Workspace
                </h2>
                <p className="text-gray-300 mb-6">
                  Connect your wallet to collaborate with your team
                </p>
                <div className="flex justify-center">
                  <ConnectWalletButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {isTrialExpired && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Your {TRIAL_DAYS}-day trial has ended. Upgrade now to continue accessing all features.</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleUpgrade}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Upgrade Now
              </Button>
              <button 
                onClick={handleNotificationClose}
                className="text-white hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={`min-h-screen pt-16 pb-24 md:pb-16 bg-black bg-[radial-gradient(ellipse_at_top_right,rgba(120,0,255,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(0,150,255,0.1),transparent_50%)] ${isTrialExpired ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                  Team Workspace
                </h1>
                <p className="text-gray-400">
                  Collaborate with your team on Project X
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <Clock className="text-purple-400 h-4 w-4 mr-2" />
                    <span className="text-sm text-gray-300">
                      Submission Deadline
                    </span>
                  </div>
                  <div className="text-xl font-mono font-bold text-white">
                    {daysRemaining}d {hoursRemaining}h
                  </div>
                </div>
                <div>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Rocket className="h-4 w-4 mr-2" />
                    Submit Project
                  </Button>
                </div>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team & Progress Section */}
              <div className="space-y-6">
                {/* Team card */}
                <Card className="backdrop-blur-xl bg-black/40 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
                  <CardHeader className="border-b border-white/5">
                    <CardTitle className="flex items-center">
                      <UserRound className="h-5 w-5 mr-2 text-purple-400" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {teamMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center p-4 hover:bg-white/5"
                          >
                            <Avatar className="h-10 w-10 border border-white/10">
                              <AvatarImage
                                src={member.avatar || "./avatar.avif"}
                                alt={member.name}
                              />
                              <AvatarFallback className="bg-purple-900 text-purple-200">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3 flex-1">
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-400">
                                {member.role}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-purple-500/30 text-purple-400 text-xs"
                            >
                              {member.walletAddress}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Progress card */}
                <Card className="backdrop-blur-xl bg-black/40 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
                  <CardHeader className="border-b border-white/5">
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-purple-400" />
                      Project Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Overall Completion
                      </span>
                      <span className="font-bold">{progressPercentage}%</span>
                    </div>
                    <Progress
                      value={progressPercentage}
                      className="h-2 bg-gray-800"
                      indicatorClassName="bg-gradient-to-r from-purple-600 to-blue-600"
                    />

                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                          <span className="text-sm">To Do</span>
                        </div>
                        <span className="text-sm font-medium">
                          {tasks.filter((t) => t.status === "To Do").length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm">In Progress</span>
                        </div>
                        <span className="text-sm font-medium">
                          {
                            tasks.filter((t) => t.status === "In Progress")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-orange-500 mr-2"></div>
                          <span className="text-sm">Review</span>
                        </div>
                        <span className="text-sm font-medium">
                          {tasks.filter((t) => t.status === "Review").length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm">Completed</span>
                        </div>
                        <span className="text-sm font-medium">
                          {tasks.filter((t) => t.status === "Completed").length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Links & Resources */}
                <Card className="backdrop-blur-xl bg-black/40 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
                  <CardHeader className="border-b border-white/5">
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2 text-purple-400" />
                      Project Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <a
                        href="/github"
                        className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        <Github className="h-5 w-5 mr-3 text-white" />
                        <div className="flex-1">
                          <div className="font-medium">GitHub Repository</div>
                          <div className="text-sm text-gray-400">
                            github.com/buddyfi/projectX
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </a>

                      <a
                        href="/guidelines"
                        className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        <Award className="h-5 w-5 mr-3 text-white" />
                        <div className="flex-1">
                          <div className="font-medium">
                            Hackathon Guidelines
                          </div>
                          <div className="text-sm text-gray-400">
                            Submission requirements & judging criteria
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </a>

                      <a
                        href="/docs"
                        className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        <AlertCircle className="h-5 w-5 mr-3 text-white" />
                        <div className="flex-1">
                          <div className="font-medium">
                            Technical Documentation
                          </div>
                          <div className="text-sm text-gray-400">
                            API specs & technical architecture
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tasks Section */}
              <Card className="backdrop-blur-xl bg-black/40 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] lg:col-span-2">
                <CardHeader className="border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <ClipboardList className="h-5 w-5 mr-2 text-purple-400" />
                      Tasks
                    </CardTitle>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                      onClick={() => setIsAddTaskModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="all" className="w-full">
                    <div className="border-b border-white/5">
                      <TabsList className="bg-transparent h-12 px-4">
                        <TabsTrigger
                          value="all"
                          className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-md"
                        >
                          All Tasks
                        </TabsTrigger>
                        <TabsTrigger
                          value="mine"
                          className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-md"
                        >
                          My Tasks
                        </TabsTrigger>
                        <TabsTrigger
                          value="upcoming"
                          className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-md"
                        >
                          Upcoming
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="all" className="m-0">
                      <div className="divide-y divide-white/5">
                        {tasks.map((task) => {
                          const assignee = getTeamMemberById(task.assignedTo);
                          return (
                            <div key={task.id} className="p-4 hover:bg-white/5">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div
                                    className={`h-2 w-2 rounded-full mr-2 ${
                                      task.status === "Completed"
                                        ? "bg-green-500"
                                        : task.status === "In Progress"
                                        ? "bg-blue-500"
                                        : task.status === "Review"
                                        ? "bg-orange-500"
                                        : "bg-purple-500"
                                    }`}
                                  ></div>
                                  <h3 className="font-medium">{task.title}</h3>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    task.status === "Completed"
                                      ? "border-green-500/30 text-green-400"
                                      : task.status === "In Progress"
                                      ? "border-blue-500/30 text-blue-400"
                                      : task.status === "Review"
                                      ? "border-orange-500/30 text-orange-400"
                                      : "border-purple-500/30 text-purple-400"
                                  }`}
                                >
                                  {task.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-gray-400">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage
                                      src={assignee?.avatar || "./avatar.avif"}
                                      alt={assignee?.name}
                                    />
                                    <AvatarFallback className="bg-purple-900 text-purple-200 text-xs">
                                      {assignee?.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{assignee?.name}</span>
                                </div>
                                <div className="flex items-center text-gray-400">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{task.dueDate}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="mine" className="m-0">
                      <div className="divide-y divide-white/5">
                        {tasks
                          .filter((task) => task.assignedTo === CURRENT_USER_ID)
                          .map((task) => {
                            const assignee = getTeamMemberById(task.assignedTo);
                            return (
                              <div
                                key={task.id}
                                className="p-4 hover:bg-white/5"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <div
                                      className={`h-2 w-2 rounded-full mr-2 ${
                                        task.status === "Completed"
                                          ? "bg-green-500"
                                          : task.status === "In Progress"
                                          ? "bg-blue-500"
                                          : task.status === "Review"
                                          ? "bg-orange-500"
                                          : "bg-purple-500"
                                      }`}
                                    ></div>
                                    <h3 className="font-medium">
                                      {task.title}
                                    </h3>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      task.status === "Completed"
                                        ? "border-green-500/30 text-green-400"
                                        : task.status === "In Progress"
                                        ? "border-blue-500/30 text-blue-400"
                                        : task.status === "Review"
                                        ? "border-orange-500/30 text-orange-400"
                                        : "border-purple-500/30 text-purple-400"
                                    }`}
                                  >
                                    {task.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center text-gray-400">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage
                                        src={
                                          assignee?.avatar || "./avatar.avif"
                                        }
                                        alt={assignee?.name}
                                      />
                                      <AvatarFallback className="bg-purple-900 text-purple-200 text-xs">
                                        {assignee?.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{assignee?.name}</span>
                                  </div>
                                  <div className="flex items-center text-gray-400">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{task.dueDate}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        {tasks.filter((task) => task.assignedTo === CURRENT_USER_ID)
                          .length === 0 && (
                          <div className="p-8 text-center text-gray-400">
                            <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>You don&apos;t have any assigned tasks yet</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="upcoming" className="m-0">
                      {/* Simplified for the demo */}
                      <div className="divide-y divide-white/5">
                        {tasks
                          .filter((task) => task.status !== "Completed")
                          .map((task) => {
                            const assignee = getTeamMemberById(task.assignedTo);
                            return (
                              <div
                                key={task.id}
                                className="p-4 hover:bg-white/5"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <div
                                      className={`h-2 w-2 rounded-full mr-2 ${
                                        task.status === "In Progress"
                                          ? "bg-blue-500"
                                          : task.status === "Review"
                                          ? "bg-orange-500"
                                          : "bg-purple-500"
                                      }`}
                                    ></div>
                                    <h3 className="font-medium">
                                      {task.title}
                                    </h3>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      task.status === "In Progress"
                                        ? "border-blue-500/30 text-blue-400"
                                        : task.status === "Review"
                                        ? "border-orange-500/30 text-orange-400"
                                        : "border-purple-500/30 text-purple-400"
                                    }`}
                                  >
                                    {task.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center text-gray-400">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage
                                        src={
                                          assignee?.avatar || "./avatar.avif"
                                        }
                                        alt={assignee?.name}
                                      />
                                      <AvatarFallback className="bg-purple-900 text-purple-200 text-xs">
                                        {assignee?.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{assignee?.name}</span>
                                  </div>
                                  <div className="flex items-center text-gray-400">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{task.dueDate}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Team Chat */}
              <Card className="backdrop-blur-xl bg-black/40 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] lg:col-span-3">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-purple-400" />
                    Team Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-64 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const sender = getTeamMemberById(message.sender);
                      const isCurrentUser = message.sender === "4";

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex max-w-md ${
                              isCurrentUser ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            <Avatar
                              className={`h-8 w-8 ${
                                isCurrentUser ? "ml-2" : "mr-2"
                              }`}
                            >
                              <AvatarImage
                                src={sender?.avatar || "./avatar.avif"}
                                alt={sender?.name}
                              />
                              <AvatarFallback className="bg-purple-900 text-purple-200 text-xs">
                                {sender?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div
                                className={`px-4 py-2 rounded-2xl text-sm ${
                                  isCurrentUser
                                    ? "bg-purple-600 text-white rounded-tr-none"
                                    : "bg-white/10 rounded-tl-none"
                                }`}
                              >
                                {message.text}
                              </div>
                              <div
                                className={`text-xs text-gray-400 mt-1 ${
                                  isCurrentUser ? "text-right" : "text-left"
                                }`}
                              >
                                {sender?.name} • {message.timestamp}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 border-t border-white/5">
                    <div className="flex items-center">
                      <Input
                        placeholder="Type your message..."
                        className="bg-white/5 border-white/10 focus:border-purple-500 focus:ring-purple-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="ml-2 px-3 bg-purple-600 hover:bg-purple-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <Dialog open={isAddTaskModalOpen} onOpenChange={setIsAddTaskModalOpen}>
        <DialogContent className="bg-black/90 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="Enter task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select
                value={newTask.assignedTo}
                onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10">
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newTask.status}
                onValueChange={(value) => setNewTask({ ...newTask, status: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10">
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddTaskModalOpen(false)}
              className="border-white/10 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTask}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamDashboard;
