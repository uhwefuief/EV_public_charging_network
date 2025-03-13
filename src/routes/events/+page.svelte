<script>
// @ts-nocheck

import * as db from '$lib/data_access.js';
import { format_timestamp } from '$lib/utilities.js';
import { writable } from 'svelte/store';

export let data;

let customer = data.customer;
let search_text = '';
let events = writable([...data.events]);

// Request Supabase to select * from events where customer_id = filter_id
async function filterBycustomer(filter_id = 0) {
    try {
        let cus_events = filter_id > 0 ? await db.get_events_by_customer_id(filter_id) : await db.get_all_events();
        events.set(cus_events);
    } catch (error) {
        console.error('filterBycustomer error:', error);
    }
}

// Handle search button event
async function search_events() {

if (search_text =='') {
	alert(`invalid search`);
	return false;
}
const result = await db.search_events(search_text);

$events = result;
}

// Handle delete button event
async function delete_event(id = 0) {
    if (isNaN(id)) {
        alert('Cannot delete event with invalid ID');
        return;
    }
    if (confirm(`Permanently deleting event with ID= ${id}\n\nAre you sure?`)) {
        try {
            const result = await db.delete_event_by_id(id);
            if (result) {
                alert(`Event with ID ${id} deleted`);
                events.update(items => items.filter(event => event.id !== id));
            }
        } catch (error) {
            console.error('delete_event error:', error);
        }
    }
}

// Track sort directions for each column
const table_sort = {
    session_id: false,
    customer_id: false,
    station_id: false,
    starttime: false,
    endtime: false,
	energyconsumed: false,
	cost: false,
	paymentstatus: false
};

// Get events sorted based on a given column
async function sort_by_col(col) {
    table_sort[col] = !table_sort[col];
    try {
        const sorted = await db.get_all_events(col, table_sort[col]);
        events.set(sorted);
    } catch (error) {
        console.error(`sort_by_col error (${col}):`, error);
    }
}

	</script>
	
	<!-- The HTML content of the page-->
	
	<div class="container">
		<div class="row">
			<!-- Page Header -->
			<h2 class="mt-5">Events Log from Supabase</h2>
		</div>
		<div class="row">
			<div class="col-sm-2">
				<!-- Page Body Left Column (menu) -->
				<div id="customer" class="list-group">
					<!-- customer links -->
					<button on:click={() => filterBycustomer(0)} class="list-group-item list-group-item-action">
						All Customers
					</button>
					{#each customer as cus}
						<button on:click={() => filterBycustomer(cus.customer_id)} class="list-group-item list-group-item-action">
							Customer {cus.name}
						</button>
					{/each}
				</div>
			</div>
			<!-- End customer col -->
			<div class="col-sm-10">
				<!-- Page Body Right Side (Content goes here) -->
	
				<!-- search box -->
				<form>
					<div class="row m-4">
						<div class="col-md-4 d-flex">
							<input type="text" bind:value={search_text} class="form-control" name="search" placeholder="Search Events" />
						</div>
						<!-- Submit button -->
						<div class="col-md-1">
							<button on:click={search_events} class="btn btn-primary">Search</button>
						</div>
					</div>
				</form>
				
	
				<div id="events">
					<table class="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th class="click-text" on:click={() => sort_by_col('session_id')}><i class={ table_sort['session_id'] ? 'bi bi-sort-down' : 'bi bi-sort-up'}></i>Session_ID</th>
								<th class="click-text" on:click={() => sort_by_col('customer_id')}><i class={ table_sort['customer_id'] ? 'bi bi-sort-down' : 'bi bi-sort-up'}></i>Customer_ID</th>
								<th class="click-text" on:click={() => sort_by_col('station_id')}><i class={ table_sort['station_id'] ? 'bi bi-sort-down' : 'bi bi-sort-up'}></i>Station_ID</th>
								<th>Name</th>
								<th>starttime</th>
								<th>endtime</th>
								<th>energyconsumed</th>
								<th>cost</th>
								<th>paymentstatus</th>
							</tr>
						</thead>
						<tbody>
							<!-- Note use of $events -->
							{#each $events as event}
								<tr>
									<td><a href="/events_details/{event.session_id}">{event.session_id}</a></td>
									<td>{event.customer_id}</td>
									<td>{event.station_id}</td>
									<td>{event.customer?.name || 'Unknown'}</td>
									<td>{format_timestamp(event.starttime)}</td>
									<td>{format_timestamp(event.endtime)}</td>
									<td>{event.energyconsumed}</td>
									<td>{event.cost}</td>
									<td>{event.paymentstatus}</td>
									<td>
										<button
										on:click={() => delete_event(event.session_id)}
										class="btn btn-sm btn-outline-danger"
										aria-label="Delete event">
										<span class="bi bi-trash"></span>  
									</button>
									
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
			<!-- End events col -->
		</div>
		<!-- End Row -->
	</div>
	<!-- End Main Content-->