import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

export const navItems = [
    { label: "How it Works", href: "#breakdown" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact"},
];

export const features = [
    { 
        icon: <BotMessageSquare />, 
        description: "StudyScript is an AI powered tool with an LLM operating behind the scenes to give you smooth and informative conversation.",
        text: "AI Powered"
    },
    { 
        icon: <Fingerprint />, 
        description: "StudyScript's AI is personalized to your video, giving you access to a unique expert of the content that you are trying to learn.",
        text: "Personalized"
    },
    { 
        icon: <PlugZap />, 
        description: "Confused? No problem! Ask away, and the AI tutor will try its best to offer you a solution. StudyScript allows you to learn at your own pace, and at your own time.",
        text: "Control the Pace"
    }
];