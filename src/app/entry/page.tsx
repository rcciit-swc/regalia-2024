'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { PuffLoader } from "react-spinners";

import QrReader from './_components/QrCodePlugin';
import { checkDayEntry, getStudent, enterStudent, User, DayEntry, getSecurityRoll } from "@/utils/functions/enterStudent";
import EntryModal from "@/components/admin/EntryModal";

const EntryPage = () => {

    const [scanned, setScanned] = useState<string | undefined>();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [startScan, setStartScan] = useState<boolean>(false);
    const [day, setDay] = useState<DayEntry | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [data, setData] = useState<User & {security: string} | undefined>();
    const [canAddUser, setCanAddUser] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        getSecurityRoll().then((roles) => {
            if (roles.includes('super_admin') || roles.includes('security_admin')) {
                setCanAddUser(true);
            }
        });
    }, []);

    function resetEntry() {
        setScanned(undefined);
        setStartScan(false);
        setPhoneNumber('');
        setData(undefined);
        setDay(null);
    }

    async function handleEntry(data: {
        name?: string;
        email?: string;
        phone?: string;
        roll?: string;
    }) {
        if (!data.email && !data.phone && !data.roll) {
            alert('Invalid data');
            return;
        }
        const student = await getStudent({
            email: data.email,
            phone: data.phone,
            college_roll: data.roll
        });
        if (!student) {
            resetEntry();
            alert('Student not found!');
            return;
        }

        const dayEntry = checkDayEntry();
        if (dayEntry==='day_missed') {
            resetEntry();
            alert('Day missed!');
            return;
        }
        if (student[dayEntry]) {
            resetEntry();
            setScanned(student.full_name);
            setDay(student[dayEntry]);
            return;
        }

        setData(student);
        setIsOpen(true);
    }

    function handleScan(data: string | null) {
        setStartScan(false);
        try {
            const parsedData = JSON.parse(data || '');
            if (parsedData) {
                handleEntry(parsedData);
            }
        } catch (e) {
            resetEntry();
            alert('Invalid QR Code');
        }
        
    }

    function startScanning() {
        setScanned(undefined);
        setStartScan(true);
    }

    const handleSubmitPhoneNumber = () => {
        resetEntry();
        handleEntry({ phone: phoneNumber });
    };

    const handleInputPhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    }

    const handleAccept = async (band: string, data: User & {security: string}) => {
        setIsOpen(false);
        resetEntry();
        const dayEntry: DayEntry = {
            security: data.security,
            time: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
        }
        
        await enterStudent({
            userEntry: dayEntry,
            email: data.email,
            day: checkDayEntry()
        })

        setScanned(data.full_name);
    };

    const handleReject = () => {
        setIsOpen(false);
        resetEntry();
    };

    return (
        <div className="text-regalia font-hollirood  min-h-[80vh]  text-center text-3xl font-bold flex justify-center flex-col items-center">
          Only for Admins!

            <div className="bg-transparent h-[350px] w-[350px] m-5 flex flex-col justify-between">
                {
                    startScan ? (
                        <QrReader 
                        onScanSuccess={handleScan}
                        />
                    ) : (
                        <>
                            <div className="flex items-center justify-center h-full">
                                {
                                    scanned ? (
                                        <div className={`text-base p-2 rounded-lg ${day?'text-red-600':'text-white'}`}>
                                            {scanned} {day?'successfully':'has already'} entered the venue! 
                                        </div>
                                    ) : (
                                        <PuffLoader color="" size={30} />
                                    )
                                }
                            </div>
                            <div className="flex items-center justify-center mb-10">
                                <button 
                                    className="bg-regalia text-white p-2 rounded-lg text-lg"
                                    onClick={startScanning}
                                >
                                    Scan QR Code
                                </button>
                            </div>
                        </>
                    )
                }
            </div>

            <input 
                type="text"
                inputMode="numeric"
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChange={handleInputPhoneNumber}
                className="border-2 border-regalia p-2 rounded-lg w-[85%] text-lg text-black"
            />
            <button 
                className={`bg-regalia text-white p-2 rounded-lg mt-3 text-lg ${phoneNumber.length === 10 ? '' : 'cursor-not-allowed opacity-50'}`}
                disabled={phoneNumber.length !== 10}
                onClick={handleSubmitPhoneNumber}
            >
                Submit Phone Number
            </button>

            {canAddUser && (
                <button 
                className="bg-regalia text-white p-2 rounded-lg mt-5 text-lg"
                onClick={() => router.push('/entry/add')}
                >
                    Add Student
                </button>
            )}

            <EntryModal
            isOpen={isOpen}
            accept={handleAccept}
            reject={handleReject}
            data={data as User & {security: string}}
            />
        </div>
    );

};

export default EntryPage;