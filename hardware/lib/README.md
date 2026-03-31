# hardware/lib

This directory is reserved for private, project-specific libraries that are **not** available via the PlatformIO Library Registry.

For all third-party dependencies, add them to `platformio.ini` under `lib_deps`.

## Current Dependencies (managed via platformio.ini)

| Library | Purpose | Registry |
|---------|---------|----------|
| autowp/MCP2515 | CAN Bus communication | PlatformIO Registry |
| adafruit/RTClib | DS3231 RTC driver | PlatformIO Registry |
| bblanchon/ArduinoJson | JSON serialization/deserialization | PlatformIO Registry |
| arduino-libraries/SD | MicroSD card read/write | PlatformIO Registry |
