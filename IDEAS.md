# Ideas Backlog

## Multi-Tenancy (Next Phase)
- Multiple users each see only their own data — this pattern is called **row-level data ownership**
- Requires: `users` table, hashed passwords (`bcrypt`), `POST /auth/register` endpoint
- Add `user_id` foreign key to `readings` table
- Filter all queries by `user_id` so data is isolated per user
- Foundation of almost every SaaS product

## IFC Viewer + Sensor Integration (Phase 4)
- Admin-only IFC upload (`multer` for file handling, Cloudflare R2 or S3 for storage)
- Render IFC model in browser using `@thatopen/components` (formerly web-ifc-viewer)
- Users can orbit/pan/zoom the 3D model
- Map `sensor_id` to IFC space GUIDs — store mapping in a DB table
- Colour rooms red/green in the viewer based on live compliance status
- Click a room to see live readings and AI report
- **Time slicer** — scrub through historical readings and watch rooms change colour over time as compliance shifts
  - Slider UI component mapped to a timestamp range
  - Query `readings` by `sensor_id` and `timestamp` window
  - Re-colour IFC spaces on each slider position change

## Power Monitoring
- Monitor energy usage per socket and whole flat
- Look at Shelly smart plugs — WiFi, API accessible, no hub needed
- Possible to correlate power spikes with sensor anomalies
- Could extend the compliance spec to include wattage thresholds