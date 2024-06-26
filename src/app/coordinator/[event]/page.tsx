"use client";

import Table from "@/components/admin/Table";
import { getRegsByEvent } from "@/components/admin/getRegsByEvent";
import FormElement from "@/components/common/FormElement";
import Heading from "@/components/common/Heading";
import { supabase } from "@/lib/supabase-client";
import { clickSound } from "@/utils/functions";
import { dateTime } from "@/utils/functions/dateTime";
import { getEventInfo } from "@/utils/functions/getEventsInfo";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { PuffLoader } from "react-spinners";

const Page = () => {
  let eventId: any = useParams().event;
  const [inputs, setInputs] = useState({
    teamName: "",
    name: "",
    teamLeadPhone: "",
    transactionId: "",
    membersPhone: "",
    createdAt: "",
    swc: "",
  });
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [offlineReg, setOfflineReg] = useState(false);
  const [eventDetails, setEventDetails] = useState<any>({});
  const [attendesCount, setAttendesCount] = useState(0);
  useEffect(() => {
    const getAllEvents = async () => {
      const data = await getRegsByEvent(eventId);
      const attendees = data.filter((team: any) => team.attendance == true);
      setAttendesCount(attendees.length);
      const res = await getEventInfo(eventId);
      setEventDetails(res![0]!);
      setRegistrationData(data);
      setLoading(false);
    };
    getAllEvents();
  }, [eventId]);

  const [teamsWithMembers, setTeamsWithMembers] = useState<any[]>([]);
  const [downloadableCSV, setDownloadableCSV] = useState<boolean>(false);
  useEffect(() => {
    const getTeamRegistrations = async () => {
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select(
          "college,team_id,team_name,team_lead_phone,transaction_verified,attendance,events(event_name)",
        )
        .eq("event_id", eventId) as any;
       

      if (teamError) {
        console.error("Error fetching teams:", teamError.message);
        return;
      }

      if (teamData) {
        const teamsWithMembers = [];

        for (const team of teamData) {
          console.log(team)
          const { data: memberData, error: memberError } = await supabase
            .from("participations")
            .select("name,phone,email")
            .eq("team_id", team.team_id);
            console.log(memberData)
          if (memberError) {
            console.error("Error fetching team members:", memberError.message);
            continue;
          }

          if (memberData) {
            const membersWithUserData = [];

            for (const member of memberData) {
             

       

              membersWithUserData.push({
                event_name: team?.events!.event_name,
                team_name: team.team_name,
                name: member?.name,
                college: team?.college,
                phone: member.phone,
                email: member?.email,
                verified: team.transaction_verified,
              });
            }

            teamsWithMembers.push(...membersWithUserData);
          }
        }
        console.log(teamsWithMembers)
        setTeamsWithMembers(teamsWithMembers);
        setDownloadableCSV(true);
      }
    };

     getTeamRegistrations();
  }, [eventId]);

  // const [swcCount, setSwcCount] = useState(0);
  // const [nonSwcCount, setNonSwcCount] = useState(0);
  // const [collegeRegCount, setCollegeRegCount] = useState(0);
  // const [outCollegeRegCount, setOutCollegeRegCount] = useState(0);

  useEffect(() => {
    const filteredData = registrationData.filter(
      (registration: any) =>
        registration.team_lead_phone.includes(inputs.teamLeadPhone) &&
        registration.transaction_id
          .toLowerCase()
          .includes(inputs.transactionId.toLowerCase()) &&
        registration.team_name
          .toLowerCase()
          .includes(inputs.teamName.toLowerCase()) &&
        registration.team_lead_name
          .toLowerCase()
          .includes(inputs.name.toLowerCase()) &&
        registration.swc.toLowerCase().includes(inputs.swc.toLowerCase()) &&
        new Date(registration.created_at)
          .toLocaleDateString("en-US", options)
          .includes(inputs.createdAt) &&
        registration.team_members.some((member: any) =>
          member.phone.includes(inputs.membersPhone),
        ),
    );
    // const swcPaidRegistrationsCount = registrationData.filter(
    //   (res: any) => res.swc === "Yes"
    // ).length;
    // setSwcCount(swcPaidRegistrationsCount);
    // const nonswcPaidRegistrationsCount = registrationData.filter(
    //   (res: any) => res.swc === "No"
    // ).length;
    // setNonSwcCount(nonswcPaidRegistrationsCount);

    // const collegeRegs = registrationData.filter(
    //   (res: any) =>
    //     res.college.toLowerCase().includes("rcciit") ||
    //     res.college
    //       .toLowerCase()
    //       .includes("rcc institute of information technology")
    // ).length;
    // setOutCollegeRegCount(registrationData.length - collegeRegs);
    // setCollegeRegCount(collegeRegs);
    setFilteredData(filteredData);
  }, [inputs, registrationData]);

  const options: any = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any>,
  ) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };
  const router = useRouter();
  return (
    <div className="mx-auto my-10 flex min-h-[60vh] w-full flex-col items-center gap-10 overflow-x-hidden ">
      <Heading text="Registered Teams" />
      <div className="flex w-[90%] flex-row flex-wrap items-center justify-center gap-5  md:w-full">
        <FormElement
          name="Team Name"
          value={inputs.teamName}
          type="text"
          id="teamName"
          onChange={handleInputChange}
          width="1/3"
        />

        <FormElement
          name="Name"
          value={inputs.name}
          type="text"
          id="name"
          onChange={handleInputChange}
          width="1/3"
        />
        <FormElement
          name="Team Lead Phone"
          value={inputs.teamLeadPhone}
          type="text"
          id="teamLeadPhone"
          onChange={handleInputChange}
          width="1/3"
        />
        <FormElement
          name="Transaction ID"
          value={inputs.transactionId}
          type="text"
          id="transactionId"
          onChange={handleInputChange}
          width="1/3"
        />
        <FormElement
          name="Member Phone"
          value={inputs.membersPhone}
          type="text"
          id="membersPhone"
          onChange={handleInputChange}
          width="1/3"
        />
        {/* <FormElement
          name="SWC"
          value={inputs.swc}
          type="text"
          id="swc"
          onChange={handleInputChange}
          width="1/3"
        /> */}
        <FormElement
          name="Created At"
          value={inputs.createdAt}
          type="text"
          id="createdAt"
          onChange={handleInputChange}
          width="1/3"
        />
      </div>

      {/* <div className="flex flex-row flex-wrap font-semibold items-center text-center text-sm md:text-2xl gap-3  md:gap-10 justify-center">
        <h1>
          SWC Paid Registrations :{" "}
          <span className="text-green-600">{swcCount}</span>{" "}
        </h1>
        <h1>
          SWC Unpaid Registrations :{" "}
          <span className="text-red-600">{nonSwcCount} </span>
        </h1>
      </div>
      <div className="flex flex-row flex-wrap -mt-5 font-semibold items-center text-center text-sm md:text-2xl gap-3  md:gap-10 justify-center">
        <h1>
          College Inside Reg :{" "}
          <span className="text-green-600">{collegeRegCount}</span>{" "}
        </h1>
        <h1>
          College Outside Reg :{" "}
          <span className="text-red-600">{outCollegeRegCount} </span>
        </h1>
        <h1>
          Total Attendees :{" "}
          <span className="text-green-600">
            {attendesCount}/{registrationData.length}{" "}
          </span>
        </h1>
      </div> */}
      <div className="font-semibold justify-center flex flex-row items-center flex-wrap gap-5 text-sm md:text-xl">
        {/* <h1>For Offline Registration :</h1>
        <button
          onClick={() => setOfflineReg(true)}
          className="bg-black border border-black text-white px-10 py-2 rounded-xl hover:bg-white hover:text-black"
        >
          Registration
        </button>
        <Link
          href="/register/swc"
          target="_blank"
          className="bg-black border font-semibold  text-sm md:text-xl border-black text-white px-10 py-2 rounded-xl hover:bg-white hover:text-black"
        >
          Check SWC
        </Link> */}
        {downloadableCSV && (
          <CSVLink
            data={teamsWithMembers}
            filename={`registrations-${dateTime()}.csv`}
            className="w-fit-content rounded-md px-4 py-2 tracking-wider bg-regalia text-sm lg:text-lg font-semibold font-hollirood border-regalia text-black hover:border-regalia hover:text-regalia hover:bg-black border"
          >
            Download CSV
          </CSVLink>
        )}
         <Link
          className="w-fit-content rounded-md px-4 py-2 bg-regalia  tracking-wider text-sm lg:text-lg font-semibold font-hollirood border-regalia text-black hover:border-regalia hover:text-regalia hover:bg-black border "
          onClick={clickSound}
          href={`/coordinator/${eventId}/edit`}
        >
          Edit Event
        </Link>
      </div>
      
   
      {loading ? (
        <div className="flex min-h-[60vh] flex-col justify-center">
          <PuffLoader color={"#000"} size={100} />
        </div>
      ) : (
        <div className="mx-auto w-full overflow-x-auto px-3">
          <Table registrationData={filteredData} />
        </div>
      )}
      {/* <ManualRegModal
        isOpen={offlineReg}
        onClose={() => setOfflineReg(false)}
        eventDetails={eventDetails}
      /> */}
    </div>
  );
};

export default Page;
