<script>
	// @ts-nocheck

	import { format_timestamp } from '$lib/utilities.js';

	export let data;

	const events = data.events;

	console.log(events);
</script>

<h2>Event details</h2>

<h4>customer</h4>

<div class="table-responsive-md">
	<table class="table table-striped">
		<tbody>
			<tr>
				<th>ID</th>
				<td>{events[0].customer_id}</td>
			</tr>
			<tr>
				<th>customer name</th>
				<td>{events[0].customer.name}</td>
			</tr>
			<tr>
				<th>phone</th>
				<td>{events[0].customer.phone}</td>
			</tr>
			<tr>
				<th>email</th>
				<td>{events[0].customer.email}</td>
			</tr>
			<tr>
				<th>vehiclemodel</th>
				<td>{events[0].customer.vehiclemodel}</td>
			</tr>
		</tbody>
	</table>
</div>

<h4>Event</h4>
<div class="table-responsive-md">
	<table class="table table-striped">
		<tbody>
			<tr>
				<th>session_id</th>
				<td>{events[0].session_id}</td>
			</tr>
			<tr>
				<th>customer_id</th>
				<td>{events[0].customer_id}</td>
			</tr>
			<tr>
				<th>station_id</th>
				<td>{events[0].station_id}</td>
			</tr>
			<tr>
				<th>starttime</th>
				<td>{format_timestamp(events[0].starttime)}</td>
			</tr>
			<tr>
				<th>endtime</th>
				<td>{format_timestamp(events[0].endtime)}</td>
			</tr>
		</tbody>
	</table>
</div>