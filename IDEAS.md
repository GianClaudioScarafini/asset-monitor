# Ideas Backlog

## Multi-Tenancy (Next Phase)
- Multiple users each see only their own data — this pattern is called **row-level data ownership**
- Requires: `users` table, hashed passwords (`bcrypt`), `POST /auth/register` endpoint
- Add `user_id` foreign key to `readings` table
- Filter all queries by `user_id` so data is isolated per user
- Foundation of almost every SaaS product

## IFC Viewer Integration
- Parse IFC file to extract room/space data
- Link sensor_id to IFC space GUIDs
- Visualise live sensor readings overlaid on 3D model
- Potential library: IFC.js or xeokit

## Power Monitoring
- Monitor energy usage per socket and whole flat
- Look at Shelly smart plugs — WiFi, API accessible, no hub needed
- Possible to correlate power spikes with sensor anomalies
- Could extend the compliance spec to include wattage thresholds

## IFC 3D Room Viewer
- Render IFC model of flat in browser using web-ifc-viewer
- Link sensor_id to IFC space GUIDs
- Colour rooms red/green based on compliance status
- Click room to see live readings and AI report