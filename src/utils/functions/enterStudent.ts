import { supabase } from "@/lib/supabase-client";

export type DayEntry = {
    security: string;
    time: string;
    band_no: string;
}

export type User = {
    email: string;
    full_name: string;
    college_roll: string;
    phone: number;
    day1: DayEntry | null;
    day2: DayEntry | null;
}

export const checkDayEntry = () => {
    const today = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
    switch (today) {
        case '14/5/2024':
            return 'day1';
        case '15/5/2024':
            return 'day2';
        default:
            return 'day_missed';
    }
};

export const getCurrentSession = async() => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.id;
}

export const getSecurityRoll = async () => {

    const sessionId = await getCurrentSession();

    const userRoles = await supabase
      .from("roles")
      .select("role")
      .eq("id", sessionId);

    let roles = [];
    if (userRoles && userRoles.data) {
        for (const obj of userRoles.data) {
            roles.push(obj.role);
        }
    }

    return roles;
};

export const getStudent = async (inputs: {
    email?: string;
    phone?: string;
    college_roll?: string;
}): Promise<void | User & {security: string}> => {

    const sessionId = await getCurrentSession();
    
    const { data: users, error: usersError } = await supabase
        .from("SWC")
        .select("*")
        .or(`email.eq.${inputs.email},phone.eq.${inputs.phone || '0'},college_roll.eq.${inputs.college_roll}`)

        if (usersError) {
            return;
        }

        if (users.length > 0) {
            return {
                ...users[0],
                security: sessionId
            }
        }
};

export const enterStudent = async(input: {
    userEntry: DayEntry;
    email: string;
    day: string;
}): Promise<boolean> => {

    const data = await supabase
        .from("SWC")
        .update({ [input.day]: input.userEntry })
        .eq("email", input.email);
    
    if (data.error) {
        return false;
    }

    return true;
};

export const addStudent = async (input: User): Promise<boolean> => {
    const { data, error } = await supabase
        .from("SWC")
        .insert([input]);

    if (error) {
        return false;
    }

    return true;
};