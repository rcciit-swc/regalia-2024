import React, { useEffect, useMemo, useState } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { BackgroundGradient } from "../ui/background-gradient";
import Image from "next/image";
import { TiTick } from "react-icons/ti";
import EventButton from "./EventButton";
import parse from "html-react-parser";
import RulesModal from "../admin/RulesModal";
import Link from "next/link";
import EventRegForm from "./EventRegForm";
import { useUser } from "@/lib/store/user";
import { checkIfUserRegistered } from "@/utils/functions/checkIfUserRegistered";
import { login } from "@/utils/functions";
import { useRouter } from "next/navigation";

type preview = {
  url: string;
  title: string;
};

const EventDetails = ({ eventDetails }: any) => {
  const router = useRouter();
  const [openRules, setOpenRules] = useState<boolean>(false);
  const [openRegister, setOpenRegister] = useState<boolean>(false);
  const [registeredEvent, setRegisteredEvent] = useState<boolean>(false);
  const user = useUser((state) => state.user);
  useMemo(() => {
    const getInfo = async () => {
      if (user) {
        const ifRegistered = await checkIfUserRegistered({
          phone_param: user?.phone!,
        });
        if (ifRegistered.find((e: any) => e.event_id === eventDetails?.id)) {
          setRegisteredEvent(true);
        }
      }
    };
    getInfo();
  }, [user, eventDetails]);
  useEffect(() => {
    if (openRules || openRegister) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });
  return (
    <>
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="mt-12 font-hollirood text-3xl text-regalia dark:text-white md:mt-0">
              Explore <br />
              <span className=" mt-1 text-3xl font-bold leading-none md:text-4xl  lg:text-5xl">
                {eventDetails.event_name}
              </span>
            </h1>
          </>
        }
      >
        <BackgroundGradient className="h-full w-full rounded-[22px] bg-[#151515]">
          <div>
            <div className=" flex w-full flex-row justify-center gap-5 px-10 py-5 max-md:flex-wrap-reverse md:items-start lg:items-center">
              <div className="items-left flex w-full flex-col justify-center gap-5 md:w-[5/6] lg:w-[70%]">
                <h1 className="text-center font-retrolight text-3xl font-bold tracking-widest text-yellow-400 md:pb-6">
                  {eventDetails.event_name}
                </h1>
                <div className="flex flex-col-reverse justify-between gap-5 text-lg md:flex-row">
                  <div className=" space-y-5">
                    <div className="items-left flex flex-col justify-center gap-5 font-hollirood text-sm tracking-widest md:text-xs lg:text-sm">
                      {parse(eventDetails.desc)}
                    </div>

                    <div className="items-left flex flex-col justify-center gap-5 font-hollirood tracking-widest">
                      {parse(eventDetails.schedule)}
                    </div>
                    <div className="items-left flex flex-col justify-center gap-5 font-hollirood tracking-widest">
                      Registration Fees: ₹{eventDetails.registration_fees}
                    </div>
                    {eventDetails?.prize && (
                      <div className="items-left flex flex-col justify-center gap-5 font-hollirood tracking-widest">
                        Prize Pool: ₹{eventDetails.prize}
                      </div>
                    )}
                    <div className="items-left flex flex-col justify-center gap-5 font-hollirood tracking-widest">
                      Team Size: {eventDetails.min_team_member} -{" "}
                      {eventDetails.max_team_member}
                    </div>
                  </div>
                </div>
                <div className=" flex flex-row space-x-5">
                  <EventButton
                    name="Rules"
                    onClick={() => setOpenRules(true)}
                  />
                  {eventDetails?.links.length > 0 &&
                    eventDetails.links.map((link: preview, index: number) => {
                      return (
                        <Link
                          className="relative my-2 inline-flex h-12 overflow-hidden rounded-full p-1 font-retrolight focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 md:my-3"
                          href={link.url}
                          key={index}
                          target="_blank"
                        >
                          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FEC923_0%,#0917F5_50%,#FEC923_100%)]" />
                          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl md:text-lg">
                            {link.title}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              </div>
              <div className="mx-auto flex h-full w-full flex-col max-lg:mt-10 max-md:mt-0 md:w-[1/6] lg:w-[30%]">
                <Image
                  src={eventDetails.event_image_url}
                  alt="hero"
                  height={600}
                  width={250}
                  className=" mx-auto rounded-2xl object-cover object-left-top"
                />
                {!registeredEvent! &&
                  eventDetails! &&
                  eventDetails!.is_open && (
                    <button
                      className="relative mx-auto my-2 inline-flex h-12 w-auto overflow-hidden rounded-full p-1 font-retrolight focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 md:my-3"
                      disabled={!eventDetails.is_open}
                      onClick={async () => {
                        if (!user) {
                          login();
                        }
                        setOpenRegister(true);
                      }}
                    >
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FEC923_0%,#0917F5_50%,#FEC923_100%)]" />
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white backdrop-blur-3xl md:text-sm lg:text-lg">
                        Register Now
                      </span>
                    </button>
                  )}
                {registeredEvent! && (
                 <button
                 className="relative mx-auto my-2 inline-flex h-12 w-auto overflow-hidden rounded-full p-1 font-retrolight focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 md:my-3"
                  onClick={
                   () => {
                    router.push("/dashboard")
                   }
                  }
               >
                     <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FEC923_0%,#0917F5_50%,#FEC923_100%)]" />
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white backdrop-blur-3xl md:text-sm lg:text-sm">
                      Already Registered
                      <TiTick size={24} />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </BackgroundGradient>
      </ContainerScroll>
      <RulesModal
        isOpen={openRules}
        onClose={() => setOpenRules(false)}
        rules={eventDetails.rules}
      />
      <EventRegForm
        isOpen={openRegister}
        onClose={() => setOpenRegister(false)}
        eventDetails={eventDetails}
      />
    </>
  );
};

export default EventDetails;
