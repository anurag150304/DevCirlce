import axios from "axios";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/user.context.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import * as WebContainer from "../config/webContainer.config.js"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { InitializeSocket, receiveMessage, sendMessage } from "../config/socket.config.js";

export const Dashboard = () => {
    const language = useRef(null);
    const fileTree = useRef(null);
    const location = useLocation();
    const editorRef = useRef(null);
    const randomToken = useRef([]);
    const chatContainerRef = useRef(null);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const project = useRef(location.state?.project);
    const [addedUsers, setAddedUsers] = useState([]);
    const [iframeUrl, setIframeUrl] = useState(null);
    const [runProcess, setRunProcess] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [webContainer, setWebContainer] = useState(null);
    const [isGroupPanelOpen, setGroupPanelOpen] = useState(false);
    const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);

    useEffect(() => {
        InitializeSocket(project.current?._id);
        receiveMessage("project-message", (data) => handleIncomingMessage(data));
        initializeWebContainer();
    }, []);

    const initializeWebContainer = async () => {
        if (!webContainer) {
            const container = await WebContainer.getWebContainer();
            setWebContainer(container);
        }
    }

    useEffect(() => {
        async function getUsers() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/all`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
                );

                if (response.status === 200) {
                    setUsers(response.data.users);
                }
            } catch (error) {
                console.error(error.response.data.message || "Failed to fetch users:");

            }
        }

        async function getProjectUsers() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/projects/project-info`, {
                    params: { projectId: project.current?._id },
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
                });

                if (response.status === 200) {
                    setAddedUsers(response.data.users);
                }
            } catch (error) {
                console.error(error.response.data.message || "Failed to fetch project users:");
            }
        }

        async function getFileTree() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/projects/project-info`, {
                    params: { projectId: project.current?._id },
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
                });

                if (response.status === 200) {
                    fileTree.current = response.data?.fileTree;
                    setActiveFile(Object.keys(response.data?.fileTree)[0]);
                    setSelectedFiles([Object.keys(response.data?.fileTree)[0]]);
                }
            } catch (error) {
                console.error(error.response.data.message || "Failed to fetch file tree:");
            }
        }
        getUsers();
        getProjectUsers();
        getFileTree();
    }, [project?.current]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleIncomingMessage = (incomingMessage) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                id: Date.now(),
                type: "incoming",
                sender: incomingMessage?.sender.fullname.firstname,
                message: incomingMessage?.message,
            },
        ]);
    };

    const handleOutgoingMessage = (outgoingMessage) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                id: Date.now(),
                type: "outgoing",
                sender: user._id,
                message: outgoingMessage,
            },
        ]);
    };

    const handleUserSelect = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const addUsersToProject = async () => {
        setAddUserModalOpen(false);
        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/projects/add-user`,
                { projectId: project?.current._id, users: selectedUsers },
                { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });

            if (response.status === 200) {
                setAddedUsers([...addedUsers, ...response.data.users]);
            }
        } catch (error) {
            console.error(error.response.data.message || "Failed to add users to project:");
        }
    };

    const SendMessage = () => {
        if (message.trim() === "") return;
        handleOutgoingMessage(message);
        sendMessage("message", { message, sender: user._id });
        setMessage("");
    };



    const saveFileTree = async (file) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/projects/update-file-tree`,
                { projectId: project?.current._id, fileTree: file },
                { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });

            if (response.status === 200) {
                console.log("File tree updated successfully");
            }
        } catch (error) {
            console.error(error.response.data.message || "Failed to update file tree:");
        }
    }

    const handleFileClick = (fileName) => {
        setActiveFile(fileName);
        setSelectedFiles((prevSelectedFiles) => {
            if (!prevSelectedFiles.includes(fileName)) {
                return [...prevSelectedFiles, fileName];
            }
            return prevSelectedFiles;
        });
    };

    const WriteAIMessage = (messageObj) => {
        const parsedData = JSON.parse(messageObj.trim());
        if (!randomToken.current.includes(parsedData.randomToken)) { // for not re-rendering while editing code
            randomToken.current.push(parsedData.randomToken);

            if (parsedData.fileTree) {
                fileTree.current = {
                    ...fileTree.current, // Keep old files
                    ...parsedData.fileTree // Add new files
                }
                saveFileTree(fileTree.current);
            }
        }

        return (
            <ReactMarkdown
                className="text-white w-full break-words overflow-x-scroll"
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}>
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={`${className} text-yellow-400`} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}>
                {parsedData.text}
            </ReactMarkdown>
        )
    };

    return (
        <div className="flex h-screen">
            <section className="w-1/3 h-full  bg-gray-900 text-white flex flex-col relative">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <button
                        onClick={() => setAddUserModalOpen(true)}
                        className="p-2 rounded hover:bg-gray-700 transition">
                        <i className="ri-user-add-line text-xl" />
                    </button>
                    <p className="text-2xl font-medium">Group Chats</p>
                    <button
                        onClick={() => setGroupPanelOpen(!isGroupPanelOpen)}
                        className="p-2 rounded hover:bg-gray-700 transition">
                        <i className="ri-team-line text-2xl" />
                    </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto scroll-smooth" ref={chatContainerRef}>
                    <div className="flex flex-col justify-center gap-2">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`p-2 rounded-lg max-w-[70%] break-words ${msg.type === "incoming"
                                    ? msg.sender === "Genie AI"
                                        ? "bg-[#1e1e1e] self-start flex flex-col justify-center place-items-start border-2 border-white border-opacity-50"
                                        : "bg-blue-700 self-start flex flex-col justify-center place-items-start"
                                    : "bg-gray-800 self-end"
                                    }`}>
                                {msg.type === "incoming" && (
                                    <span className="text-xs text-white">{msg.sender}</span>
                                )}
                                {msg.sender === "Genie AI" ? (WriteAIMessage(msg.message)) : (
                                    <p className="text-white w-full break-words">{msg.message}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-700 relative">
                    <input
                        type="text"
                        name="message"
                        autoComplete="off"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") SendMessage() }}
                        placeholder="Type a message..."
                        className="w-[87%] p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <i className="ri-send-plane-fill absolute right-7 top-[1.35rem] text-2xl cursor-pointer"
                        onClick={SendMessage}
                    />
                </div>

                <AnimatePresence>
                    {isGroupPanelOpen && (
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            className="absolute top-0 left-0 h-full w-2/3 bg-gray-800 shadow-lg z-10">
                            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                                <h3 className="text-lg font-bold">Group Members</h3>
                                <button
                                    onClick={() => setGroupPanelOpen(false)}
                                    className="p-2 rounded hover:bg-gray-700 transition">
                                    <i className="ri-close-line text-xl" />
                                </button>
                            </div>
                            <div className="p-4 space-y-2 h-[80%] overflow-y-scroll">
                                {addedUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="p-2 bg-gray-700 rounded-lg flex items-center">
                                        {user.fullname.firstname} {user.fullname.lastname}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isAddUserModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-gray-900 p-6 rounded-lg w-[40%] overflow-y-scroll">
                                <h3 className="text-lg font-bold text-center mb-4">Add Collaborators</h3>
                                <div className="space-y-2 h-60 overflow-y-auto custom-scrollbar py-2">
                                    {users.map((user, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleUserSelect(user._id)}
                                            className={`p-2.5 rounded-lg cursor-pointer ${selectedUsers.includes(user._id) ? "bg-blue-700" : "bg-gray-800"
                                                }`}>
                                            {user.fullname.firstname} {user.fullname.lastname}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={addUsersToProject}
                                    disabled={selectedUsers.length === 0}
                                    className="mt-4 w-full bg-blue-700 py-3 rounded-lg text-white font-medium hover:bg-blue-800 transition">
                                    Add Users
                                </button>
                                <button
                                    onClick={() => setAddUserModalOpen(false)}
                                    className="mt-2 w-full bg-gray-700 py-3 rounded-lg text-white font-medium hover:bg-gray-600 transition">
                                    Cancel
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </section>
            <section className="w-2/3 h-full bg-gray-800 text-white flex"
                style={{ width: ((iframeUrl && webContainer) ? "33.333335%" : "66.666667%") }}>
                {/* Right-Left Section */}
                {fileTree.current && (
                    <>
                        <div className="w-[20%] h-full bg-gray-800 text-white p-4 custom-scrollbar">
                            <h3 className="text-lg font-bold mb-4 text-center">Files</h3>
                            {Object.keys(fileTree.current).map((file, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleFileClick(file)}
                                    className={`p-3 mb-2 rounded-lg cursor-pointer w-full overflow-hidden text-ellipsis text-nowrap transition-all ${activeFile === file
                                        ? "bg-blue-700 hover:bg-blue-800"
                                        : "bg-gray-700 hover:bg-gray-600"
                                        }`}>
                                    {file}
                                </div>
                            ))}
                        </div>

                        {/* Right-Right Section */}
                        <div className="w-[80%] h-full bg-gray-700">
                            {selectedFiles.length > 0 && (
                                <div className="flex justify-start items-center gap-2 p-2 w-full bg-gray-900 border-gray-700 overflow-x-auto">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className={`px-4 py-2 rounded-t-md flex items-center gap-2 cursor-pointer 
                                                    ${activeFile === file ?
                                                    "bg-gray-700 text-white" :
                                                    "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"}`}
                                            onClick={() => setActiveFile(file)}>
                                            <span className="text-sm">{file}</span>
                                            <button
                                                className="text-gray-400 hover:text-white"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(file);
                                                }}>
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeFile && (
                                <div className="p-4 h-[88.5%] w-full flex justify-center items-center bg-gray-700">
                                    <div className="relative w-[95%] h-full bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                                        <div className="h-fit w-fit absolute top-2 right-4 flex flex-row justify-between items-center z-50 bg-inherit">
                                            <button className="px-2 rounded-lg bg-inherit hover:shadow-inner hover:shadow-white opacity-70 transition cursor-pointer"
                                                onClick={async () => {
                                                    await webContainer?.mount(fileTree.current);
                                                    const installProcess = await webContainer?.spawn("npm", ["install"]);
                                                    installProcess.output.pipeTo(new WritableStream({
                                                        write(chunk) {
                                                            console.log(chunk);
                                                        }
                                                    }));
                                                }}>
                                                <i className="ri-download-2-line cursor-pointer text-white text-xl" />
                                            </button>
                                            <button
                                                className="px-2 rounded-lg bg-inherit hover:shadow-inner hover:shadow-white opacity-70 transition cursor-pointer"
                                                onClick={async () => {

                                                    if (runProcess) runProcess.kill();
                                                    const tempRunProcess = await webContainer?.spawn("npm", ["start"]);

                                                    tempRunProcess.output.pipeTo(new WritableStream({
                                                        write(chunk) {
                                                            console.log(chunk);
                                                        }
                                                    }));

                                                    setRunProcess(tempRunProcess);
                                                    webContainer?.on('server-ready', (port, url) => setIframeUrl(url));
                                                }}>
                                                <i className="ri-play-large-line cursor-pointer text-white text-xl" />
                                            </button>
                                        </div>
                                        <Editor
                                            height="100%"
                                            width="100%"
                                            theme="vs-dark"
                                            defaultLanguage="javascript"
                                            language={language.current}
                                            value={fileTree.current[activeFile].file.contents}
                                            onMount={(editor) => (editorRef.current = editor)}
                                            onChange={(newValue) => {
                                                fileTree.current[activeFile].file.contents = newValue;
                                                saveFileTree(fileTree.current);
                                                webContainer?.fs.writeFile(`/${activeFile}`, newValue);
                                            }}
                                            options={{
                                                readOnly: false,
                                                fontSize: 14,
                                                minimap: { enabled: false },
                                                scrollBeyondLastLine: false,
                                                automaticLayout: true,
                                                scrollbar: { vertical: "hidden", horizontal: "hidden" },
                                                padding: { top: 10, bottom: 10 },
                                            }}
                                        />
                                    </div>
                                </div>

                            )}
                        </div>
                    </>
                )}
            </section>
            {iframeUrl && webContainer && (
                <section className="w-[33.333%] h-full bg-gray-100 text-black flex flex-col border-l border-gray-700 shadow-lg">
                    {/* Address Bar */}
                    <div className="w-full p-2 bg-gray-200 flex items-center gap-2 border-b border-gray-300">
                        <span className="text-gray-500 px-2">🌍</span>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={iframeUrl}
                            onChange={(e) => setIframeUrl(e.target.value)}
                            className="text-black w-full bg-gray-100 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Iframe Preview */}
                    <iframe
                        src={iframeUrl}
                        title="Web Preview"
                        className="w-full h-full border-none rounded-b-lg"
                    />
                </section>
            )}

        </div>
    )
}
