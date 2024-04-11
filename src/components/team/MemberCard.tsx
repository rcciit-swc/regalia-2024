"use client";
import React from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import Image from "next/image";

type Props = {
    name: string, 
    image: string, 
    role: string
}

export function MemberCard({name, image, role}: Props) {
  return (
    <div>
      <BackgroundGradient className="max-w-sm rounded-[22px] bg-[#151515] p-4 dark:bg-zinc-900 sm:p-10">
        <Image
          src={image}
          alt="image"
          width={200}
          height={200}
          style={{ objectFit: "cover", objectPosition: "0 10%" }}
          className="h-52 w-52 rounded-full object-cover border-4 border-white dark:border-zinc-900"
        //   onLoad={() => setLoaded(true)}
        />
        <p className="mb-2 mt-10 text-base text-white dark:text-neutral-200 sm:text-xl">
          {name}
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">{role || "Member"}</p>
        
      </BackgroundGradient>
    </div>
  );
}