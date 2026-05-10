# TODO

## Done
- [x] Express REST API with 4 endpoints
- [x] PostgreSQL database (NeonDB)
- [x] AI compliance layer (Anthropic Claude)
- [x] React dashboard with dark mode
- [x] Colour-coded compliance cards (red/green)
- [x] Historical charts with spec reference lines
- [x] AI report button
- [x] JWT authentication (login form + protected routes)
- [x] Deploy API to Render
- [x] Deploy dashboard to Vercel

## Phase 3 — Auth & Multi-Tenancy
- [ ] Replace JWT login with Google OAuth via Clerk
- [ ] Add `users` table — one account per user
- [ ] Add `user_id` foreign key to `readings` table
- [ ] Filter all queries by `user_id` (row-level data ownership)
- [ ] Admin role — only admin can upload IFC models

## Phase 4 — IFC Viewer
- [ ] Admin-only IFC file upload (multer + Cloudflare R2 or S3)
- [ ] Render IFC model in browser (`@thatopen/components`)
- [ ] Map `sensor_id` to IFC space GUIDs (stored in DB)
- [ ] Colour rooms red/green based on live compliance
- [ ] Click room → see readings and AI report
- [ ] Time slicer — scrub through history, watch rooms change colour

## Phase 5 — Hardware Expansion
- [ ] Wire MCP3008 ADC + MQ-135 air quality sensor
- [ ] ESP32 modules for additional rooms
- [ ] Bedroom sensor with tighter spec (temp max 19°C)

## Phase 6 — Advanced
- [ ] Replace HTTP POST with Azure IoT Hub telemetry
- [ ] Azure Digital Twins integration
- [ ] MQTT instead of REST for sensor data
- [ ] Anomaly detection via AI
- [ ] Energy monitoring via Shelly smart plugs
