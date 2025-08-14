-- Search outbox triggers for listings insert/update/delete

CREATE OR REPLACE FUNCTION public.fn_enqueue_listing_event()
RETURNS TRIGGER AS $$
DECLARE
  v_event text;
  v_entity jsonb;
  v_listing record;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    v_event := 'listing.created';
    v_listing := NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    v_event := 'listing.updated';
    v_listing := NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    v_event := 'listing.deleted';
    v_listing := OLD;
  END IF;

  v_entity := jsonb_build_object(
    'id', v_listing.id,
    'title', v_listing.title,
    'description', v_listing.description,
    'categoryId', v_listing."categoryId",
    'price', v_listing.price,
    'currency', v_listing.currency,
    'status', v_listing.status,
    'location', jsonb_build_object('lat', v_listing.latitude, 'lon', v_listing.longitude),
    'attributes', v_listing.attributes,
    'createdAt', v_listing."createdAt"
  );

  INSERT INTO "SearchOutbox" ("eventType", "entityType", "entityId", payload, "createdAt")
  VALUES (v_event, 'listing', v_listing.id, v_entity, now());

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enqueue_listing_event ON "Listing";
CREATE TRIGGER trg_enqueue_listing_event
AFTER INSERT OR UPDATE OR DELETE ON "Listing"
FOR EACH ROW EXECUTE FUNCTION public.fn_enqueue_listing_event();
