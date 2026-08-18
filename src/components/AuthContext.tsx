"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface TeamMember {
  name: string;
  matric: string;
  role: string;
  contribution: string;
}

export interface AuthUser {
  name: string;
  matric: string;
  role: string;
  contribution: string;
}

interface AuthContextType {
  user: AuthUser | null;
  signIn: (name: string, password: string) => { success: boolean; error?: string };
  signOut: () => void;
  isAuthenticated: boolean;
  teamMembers: TeamMember[];
}

/* ────────────────────────────────────────────
   Seeded Team Members (Group 11 — ECE 515.2)
   Password = matriculation number
   ──────────────────────────────────────────── */
const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Onyenaucheya Blessed Chimgozirim",
    matric: "U2021/3020046",
    role: "Group Leader",
    contribution: "System Architecture & Forward-Chaining Inference Engine",
  },
  {
    name: "Memena Emmanuel Chiedu",
    matric: "U2021/3020054",
    role: "Member",
    contribution: "ESP-NOW Protocol & Peer MAC Fault Tree",
  },
  {
    name: "Ordu ThankGod Meyi",
    matric: "U2021/3020045",
    role: "Member",
    contribution: "Brownout & Power Supply Diagnostic Rules",
  },
  {
    name: "Paul Godwin",
    matric: "U2021/3020047",
    role: "Member",
    contribution: "Wi-Fi Stack & FreeRTOS Watchdog Analysis",
  },
  {
    name: "Dickson Jessica Emem-Abasi",
    matric: "U2021/3020052",
    role: "Member",
    contribution: "GPIO Voltage Logic & Antenna Interference Domain",
  },
  {
    name: "Amadi Chibuike Eberechukwu",
    matric: "U2021/3020048",
    role: "Member",
    contribution: "I2C Bus Lockup & SPI Signal Integrity Testing",
  },
  {
    name: "Nwankwo Gift Chisom",
    matric: "U2021/3020049",
    role: "Member",
    contribution: "ADC2 Wi-Fi Conflict & Strapping Pin Validation",
  },
  {
    name: "Okonkwo Uchechukwu David",
    matric: "U2021/3020050",
    role: "Member",
    contribution: "Knowledge Base Data Entry & Rule Verification",
  },
  {
    name: "Justin Steve Homa",
    matric: "U2021/3020051",
    role: "Member",
    contribution: "Serial Monitor Panic Log Classifier Integration",
  },
  {
    name: "Okwudili Favour Chidinma",
    matric: "U2021/3020053",
    role: "Member",
    contribution: "UI/UX Design & Hardware Telemetry Dashboard",
  },
  {
    name: "Ugochukwu Emmanuel Kelechi",
    matric: "U2021/3020055",
    role: "Member",
    contribution: "Documentation, Testing & PDF Report Generation",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("netdiag_auth_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load auth session:", e);
    }
    setHydrated(true);
  }, []);

  const signIn = (name: string, password: string): { success: boolean; error?: string } => {
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, " ")
        .replace(/\s+/g, " ");

    const normInput = normalize(name);
    if (!normInput) {
      return { success: false, error: "Please enter your full name." };
    }

    // Find member by name
    const member = TEAM_MEMBERS.find((m) => {
      const normMember = normalize(m.name);
      if (normMember === normInput) return true;

      // Also match if all tokens match regardless of order (e.g., Last First Middle)
      const inputTokens = normInput.split(" ").filter(Boolean);
      const memberTokens = normMember.split(" ").filter(Boolean);
      if (inputTokens.length >= 2 && inputTokens.length === memberTokens.length) {
        const allMatch = inputTokens.every((t) => memberTokens.includes(t));
        if (allMatch) return true;
      }
      return false;
    });

    if (!member) {
      return { success: false, error: "Name not found in Group 11 roster. Please enter your registered full name." };
    }

    // Password is the matric number (case-insensitive and format-tolerant)
    const cleanPass = password.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanMatric = member.matric.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    if (cleanPass !== cleanMatric && member.matric.trim().toLowerCase() !== password.trim().toLowerCase()) {
      return { success: false, error: "Incorrect matriculation number. Please check and try again." };
    }

    const authUser: AuthUser = {
      name: member.name,
      matric: member.matric,
      role: member.role,
      contribution: member.contribution,
    };

    setUser(authUser);
    try {
      localStorage.setItem("netdiag_auth_user", JSON.stringify(authUser));
    } catch (e) {}

    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem("netdiag_auth_user");
    } catch (e) {}
  };

  // Don't render children until hydrated to avoid hydration mismatch
  if (!hydrated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isAuthenticated: !!user,
        teamMembers: TEAM_MEMBERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
