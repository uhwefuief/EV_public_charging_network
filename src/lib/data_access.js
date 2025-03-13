// @ts-nocheck

import { supabase } from './supabase.js';




export async function handleSubmit({ name, phone, email, vehicleModel, setError, setSuccessMessage }) {
    let error = "";
    let successMessage = "";

    if (!name || !phone || !email || !vehicleModel) {
        setError("All fields are required.");
        return;
    }

    const { data, error: insertError } = await supabase
      .from("customer")
      .insert([
        { 
          name, 
          phone, 
          email, 
          vehiclemodel: vehicleModel 
        }
      ])
      .select();

    if (insertError) {
        setError("Error inserting data: " + insertError.message);
        return;
    }

    setSuccessMessage("Customer registered successfully!");
}


// Get all customers via Supabase API
export async function get_all_customer() {
    try {
        const result = await supabase
            .from('customer')
            .select('*')
            .order('name', { ascending: true });

        if (result.error) throw result.error;
        return result.data;
    } catch (error) {
        console.error(`get_all_customer error:`, error);
        return [];
    }
}


export async function load({ fetch,params}) {

    const customer = await supabase.from('customer').select('*');
    

    const events = await supabase.from('events').select('*');

    if(customer && events) {
        return{
            customer: customer.data,
            events: events.data,
        };
    }


    return {
        error: 'error occured'
    };
}


// Get all events via Supabase API
export async function get_all_events(order_col = 'starttime', order_dir = true) {
    try {
        const result = await supabase
            .from('events')
            .select('*, customer(name)')
            .order(order_col, { ascending: order_dir }); // <- order_col should be defined

        if (result.error) throw result.error;
        return result.data;
    } catch (error) {
        console.error(`get_all_events error:`, error);
        return [];
    }
}

// Get events by customer_id
export async function get_events_by_customer_id(customer_id) {
    try {
        const result = await supabase
            .from('events')
            .select('*, customer(name)')
            .eq('customer_id', customer_id)
            .order('starttime', { ascending: true });

        if (result.error) throw result.error;
        return result.data;
    } catch (error) {
        console.error(`get_events_by_customer_id error:`, error);
        return [];
    }
}

// Delete event by ID
export async function delete_event_by_id(session_id) {
    try {
        if (!session_id || isNaN(session_id)) {
            throw new Error("Invalid session ID");
        }

        const result = await supabase
            .from('events')
            .delete()
            .eq('session_id', session_id); // Ensure 'session_id' matches your database schema

        if (result.error) throw result.error;

        console.log(`Event with session ID ${session_id} deleted successfully`);
        return true;
    } catch (error) {
        console.error("delete_event_by_id error:", error);
        return false;
    }
}


export async function search_events(search_text) { 
    try {
        if (!search_text.trim()) return [];

        const result = await supabase
            .from('events')
            .select('*, customer!inner(name)') // Ensure inner join on customer
            .ilike('customer.name', `%${search_text}%`) // Search by name
            .order('starttime', { ascending: true });

        if (result.error) throw result.error;

        console.log("Filtered Events:", result.data);
        return result.data;
    } catch (error) {
        console.error(`search_events error:`, error);
        return [];
    }
}



// Get details for a single event by ID
export async function get_event_by_id(session_id) {
    try {
        const result = await supabase
            .from('events')
            .select('*, customer(*)')
            .eq('session_id', session_id);

        if (result.error) throw result.error;
        return result.data;
    } catch (error) {
        console.error(`get_event_by_id error:`, error);
        return null;
    }
}