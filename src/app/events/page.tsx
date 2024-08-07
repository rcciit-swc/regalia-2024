"use client";
import { EventCard } from "@/components/event/EventCard";
import Header from "@/components/event/Header";
import { events } from "@/utils/constants/Events";
import { getAllEvents } from "@/utils/functions/getAllEvents";
import {  useMemo, useState } from "react";
import { PuffLoader } from "react-spinners";


export default function CardHoverEffectDemo() {
  const [eventData, setEventData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useMemo(()=>{
    const fetchEvents = async()=>{
      const data = await getAllEvents();
      setEventData(data!);
      setLoading(false);

    }
    fetchEvents();
  },[])
  return (
    <div className="mx-auto max-w-full md:px-20">
      <Header />
      {loading ? <div className="flex flex-col min-h-[80vh] items-center justify-center mx-auto w-full">
        <PuffLoader color="" size={30} />
        </div>  : <div className="oveflow-x-hidden flex min-h-[60vh] flex-col items-center gap-10">
        <div className=" flex flex-col items-center  justify-center gap-5">
           <div className="mt-5 pb-24 flex flex-row flex-wrap justify-center gap-10 md:gap-16">
            {events && events?.length > 0 && events.map((event:any, index:number) => (
              <EventCard
              link={`/events/${event.title}`}
                key={index}
                title={event.title}
                image={event.hoverImage}
                hoverImage={event.hoverImage}
              />
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}
