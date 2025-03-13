// import the client instance (created earlier)
import * as db from '$lib/data_access.js';

// The load function is executed when the page is loaded
// Here it is used to get data for display
export async function load({ fetch, params }) {

	// get all customer
	const customer = await db.get_all_customer();

	// get all events
	const events = await db.get_all_events('session_id', false);

	console.log(events);
  
	// return data to page
	if (customer && events) {
		return {
			customer: customer,
			events: events
		};
	}

	// in case of error - return status code amd message
	return {
		error: 'error occured'
	};
}