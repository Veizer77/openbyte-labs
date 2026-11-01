-- Half-open ranges allow adjacent slots; cancelled/completed bookings do not block.
ALTER TABLE "consultation_bookings"
  ADD CONSTRAINT "consultation_bookings_no_overlap"
  EXCLUDE USING gist (tstzrange("slot_start", "slot_end", '[)') WITH &&)
  WHERE ("status" IN ('pending', 'confirmed'));
