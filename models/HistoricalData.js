const { pool } = require("../config/database");

const HistoricalData = {
  // Get all historical data
  findAll: async () => {
    const eventsQuery = "SELECT * FROM historical_events ORDER BY year DESC";
    const placesQuery = "SELECT * FROM historical_places ORDER BY place_name";

    const [eventsResult, placesResult] = await Promise.all([
      pool.query(eventsQuery),
      pool.query(placesQuery),
    ]);

    return {
      events: eventsResult.rows.map((row) => ({
        id: row.id,
        year: row.year,
        eventName: row.event_name,
        additionalInfo: row.additional_info,
      })),
      places: placesResult.rows.map((row) => ({
        id: row.id,
        placeName: row.place_name,
        placeInfo: row.place_info,
        image: row.image,
      })),
    };
  },

  // Save all historical data
  saveAll: async (events, places) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Process events with upsert
      const eventPromises = (events || []).map(async (event) => {
        let result;
        if (event.id) {
          // Update existing event
          const updateQuery = `
            UPDATE historical_events
            SET year = $1, event_name = $2, additional_info = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
          `;
          result = await client.query(updateQuery, [
            event.year,
            event.eventName,
            event.additionalInfo || null,
            event.id,
          ]);
        } else {
          // Insert new event
          const insertQuery = `
            INSERT INTO historical_events (year, event_name, additional_info)
            VALUES ($1, $2, $3)
            RETURNING *
          `;
          result = await client.query(insertQuery, [
            event.year,
            event.eventName,
            event.additionalInfo || null,
          ]);
        }
        return result;
      });

      // Process places with upsert
      const placePromises = (places || []).map(async (place) => {
        let result;
        if (place.id) {
          // Update existing place
          const updateQuery = `
            UPDATE historical_places
            SET place_name = $1, place_info = $2, image = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
          `;
          result = await client.query(updateQuery, [
            place.placeName,
            place.placeInfo || null,
            place.image || null,
            place.id,
          ]);
        } else {
          // Insert new place
          const insertQuery = `
            INSERT INTO historical_places (place_name, place_info, image)
            VALUES ($1, $2, $3)
            RETURNING *
          `;
          result = await client.query(insertQuery, [
            place.placeName,
            place.placeInfo || null,
            place.image || null,
          ]);
        }
        return result;
      });

      const [eventResults, placeResults] = await Promise.all([
        Promise.all(eventPromises),
        Promise.all(placePromises),
      ]);

      await client.query("COMMIT");

      return {
        events: eventResults.map((r) => ({
          id: r.rows[0].id,
          year: r.rows[0].year,
          eventName: r.rows[0].event_name,
          additionalInfo: r.rows[0].additional_info,
        })),
        places: placeResults.map((r) => ({
          id: r.rows[0].id,
          placeName: r.rows[0].place_name,
          placeInfo: r.rows[0].place_info,
          image: r.rows[0].image,
        })),
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = HistoricalData;
