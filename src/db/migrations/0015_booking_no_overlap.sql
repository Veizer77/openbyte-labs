-- PRD 3.5 / Lampiran F.7: last-resort guard against double booking.
-- Migration 0005 already creates this constraint. Keep this later migration
-- safe for databases that have already applied 0005 as well as databases that
-- need the constraint added. The half-open range allows adjacent bookings.
-- Custom SQL: intentionally not emitted by drizzle-kit generate.
DO $migration$
BEGIN
  IF to_regclass('public.consultation_bookings') IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conrelid = 'public.consultation_bookings'::regclass
        AND conname = 'consultation_bookings_no_overlap'
        AND contype = 'x'
    )
  THEN
    ALTER TABLE public.consultation_bookings
      ADD CONSTRAINT consultation_bookings_no_overlap
      EXCLUDE USING gist (
        tstzrange(slot_start, slot_end, '[)') WITH &&
      )
      WHERE (status IN ('pending', 'confirmed'));
  END IF;
END;
$migration$;
