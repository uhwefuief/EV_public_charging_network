#!/bin/bash

# Vars - from app settings
SUPABASE_URL="https://otiaokdhjugujpxwlmon.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWFva2RoanVndWpweHdsbW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzE4NTYsImV4cCI6MjA1NTY0Nzg1Nn0.eyDCqutPWP7ej5HSODY5ogxEtcbvTzdkmzPHhEVUp8w"
API_EVENTS="/rest/v1/events"
API_STATION="/rest/v1/chargingstation"

MY_APP='EV_public_charging_network'

# HTTP Headers
REQ_HEADER='Content-type: application/json'
REQ_METHOD='POST'

BRK=localhost  # Change to broker.hivemq.com if using a remote broker

# Instructions
echo "Run this script in one terminal."
echo "To publish, use: mosquitto_pub -h $BRK -t $MY_APP -m 130,30,6,2025-2-13_12:00:00,50,13,Unpaid,no"
echo "Check your database for results."

echo 'Starting...'

# Subscribe and process messages
mosquitto_sub -v -h $BRK -t "$MY_APP/#" | while read line
do
    echo "Received: $line"

    # Extract CSV data from MQTT message
    msg=$(echo $line | cut -f2 -d' ')
    
    # Split into variables
    session_id=$(echo $msg | cut -f1 -d,)
    customer_id=$(echo $msg | cut -f2 -d,)
    station_id=$(echo $msg | cut -f3 -d,)
    starttime=$(echo $msg | cut -f4 -d,)
    energyconsumed=$(echo $msg | cut -f5 -d,)
    cost=$(echo $msg | cut -f6 -d,)
    paymentstatus=$(echo $msg | cut -f7 -d,)
    status=$(echo $msg | cut -f8 -d,)  #  Read real-time status
    realtimestatus=$status

    echo "session_id: $session_id"
    echo "customer_id: $customer_id"
    echo "station_id: $station_id"
    echo "starttime: $starttime"
    echo "energyconsumed: $energyconsumed"
    echo "cost: $cost"
    echo "paymentstatus: $paymentstatus"
    echo "status: $status"
    echo "realtimestatus: $realtimestatus"

    #  Insert into events table
    JSON_INSERT='{
        "session_id": "'"$session_id"'",
        "customer_id": "'"$customer_id"'",
        "station_id": "'"$station_id"'",
        "starttime": "'"$starttime"'",
        "energyconsumed": "'"$energyconsumed"'",
        "cost": "'"$cost"'",
        "paymentstatus": "'"$paymentstatus"'",
        "status": "'"$status"'"
    }'

    echo "Inserting event..."
    response_insert=$(curl -X $REQ_METHOD "$SUPABASE_URL$API_EVENTS" \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        -H "$REQ_HEADER" \
        -d "$JSON_INSERT")
    
    echo "Insert response: $response_insert"

    #  Update chargingstation.realtimestatus
    JSON_UPDATE='{
    "realtimestatus": "'"$realtimestatus"'" 
    }'

    echo "Updating charging station status..."
    response_update=$(curl -X PATCH "$SUPABASE_URL$API_STATION?station_id=eq.$station_id" \
       -H "apikey: $SUPABASE_KEY" \
       -H "Authorization: Bearer $SUPABASE_KEY" \
       -H "$REQ_HEADER" \
       -d "$JSON_UPDATE")

    echo "Update response: $response_update"
done
