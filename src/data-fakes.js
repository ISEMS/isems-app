import { DateTime } from "luxon";

/**
 * Generates 24 hours of simulated solar battery data for Berlin
 * @param {DateTime} startDate - The start date/time
 * @returns {Array} Array of data points with timestamps and battery metrics
 */
function generateSolarBatteryData(startDate) {
  const data = [];
  const intervalMinutes = 0.5; // 30 seconds
  const totalPoints = (24 * 60) / intervalMinutes; // 2880 points

  // Berlin summer sunrise ~5:30, sunset ~21:30 (approximate)
  const sunriseHour = 5.5;
  const sunsetHour = 21.5;
  const solarPeakHour = 13.5; // 1:30 PM

  for (let i = 0; i < totalPoints; i++) {
    const currentTime = startDate.plus({ minutes: i * intervalMinutes });
    const hourOfDay = currentTime.hour + currentTime.minute / 60;

    // Calculate solar irradiance (0-1) based on time of day
    let solarIrradiance = 0;
    if (hourOfDay >= sunriseHour && hourOfDay <= sunsetHour) {
      // Bell curve for solar irradiance
      const dayProgress =
        (hourOfDay - sunriseHour) / (sunsetHour - sunriseHour);
      solarIrradiance = Math.sin(dayProgress * Math.PI);

      // Peak enhancement around solar noon
      const peakFactor =
        1 + 0.3 * Math.exp(-Math.pow((hourOfDay - solarPeakHour) / 2, 2));
      solarIrradiance *= peakFactor;

      // Add some realistic cloud variations
      const cloudNoise =
        0.95 + 0.1 * Math.sin(hourOfDay * 3.7) * Math.cos(hourOfDay * 1.3);
      solarIrradiance *= Math.max(0.3, cloudNoise);
    }

    // Battery charge estimate (20% to 100%)
    // Charges during day, slowly discharges at night
    let batteryChargeEstimate;
    if (solarIrradiance > 0.1) {
      // Charging during solar hours
      const baseCharge = 30 + solarIrradiance * 65; // 30-95%
      const timeDecay = Math.max(0, 1 - (i / totalPoints) * 0.3); // Slight decline over day
      batteryChargeEstimate = Math.min(100, baseCharge * timeDecay);
    } else {
      // Discharging at night (exponential decay)
      const nightProgress = Math.abs(hourOfDay - 12) / 12;
      batteryChargeEstimate = 85 * Math.exp(-nightProgress * 0.8) + 15;
    }

    // Add small random variations
    batteryChargeEstimate += (Math.random() - 0.5) * 2;
    batteryChargeEstimate = Math.max(15, Math.min(100, batteryChargeEstimate));

    // Battery voltage (11.5V to 14.4V for 12V system)
    // Higher voltage when charging, lower when discharging
    const baseVoltage = 11.5 + (batteryChargeEstimate / 100) * 2.9;
    const chargingBoost = solarIrradiance > 0.2 ? solarIrradiance * 0.5 : 0;
    let batteryVoltage = baseVoltage + chargingBoost;
    batteryVoltage += (Math.random() - 0.5) * 0.1; // Small noise
    batteryVoltage = Math.max(11.0, Math.min(14.8, batteryVoltage));

    // MPPT voltage (0V to 22V)
    // Follows solar irradiance closely
    let mppVoltage = solarIrradiance * 18 + 2; // 2-20V range
    if (solarIrradiance < 0.05) mppVoltage = 0; // No output at night
    mppVoltage += (Math.random() - 0.5) * 0.5; // Small variations
    mppVoltage = Math.max(0, Math.min(22, mppVoltage));

    // Open circuit voltage (0V to 24V)
    // Always slightly higher than MPP voltage when there's sun
    let openCircuitVoltage =
      mppVoltage > 0 ? mppVoltage + 2 + solarIrradiance * 2 : 0;
    openCircuitVoltage += (Math.random() - 0.5) * 0.3;
    openCircuitVoltage = Math.max(0, Math.min(24, openCircuitVoltage));

    // Battery temperature (5°C to 35°C)
    // Warmer during day, cooler at night, affected by charging
    const ambientTemp = 18 + Math.sin(((hourOfDay - 6) / 24) * 2 * Math.PI) * 8; // 10-26°C ambient
    const chargingHeat = solarIrradiance * 5; // Up to 5°C from charging
    const thermalMass = Math.sin((i / totalPoints) * 2 * Math.PI) * 2; // Thermal inertia
    let batteryTemperature = ambientTemp + chargingHeat + thermalMass;
    batteryTemperature += (Math.random() - 0.5) * 1; // Small variations
    batteryTemperature = Math.max(5, Math.min(35, batteryTemperature));

    data.push({
      timestamp: currentTime.toISO(),
      epochTime: currentTime.toMillis(),
      batteryChargeEstimate: Math.round(batteryChargeEstimate * 10) / 10,
      batteryVoltage: Math.round(batteryVoltage * 100) / 100,
      mppVoltage: Math.round(mppVoltage * 100) / 100,
      openCircuitVoltage: Math.round(openCircuitVoltage * 100) / 100,
      batteryTemperature: Math.round(batteryTemperature * 10) / 10,
      solarIrradiance: Math.round(solarIrradiance * 1000) / 1000, // For debugging/reference
    });
  }

  return data;
}

export { generateSolarBatteryData };
