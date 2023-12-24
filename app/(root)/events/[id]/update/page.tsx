import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";

import { auth } from "@clerk/nextjs";
import React from "react";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;

  const event = await getEventById(id);

  return (
    <>
      <section className="bg-priary-50 bg-dotted-pattern bg-cover bg-center ">
        <h3 className="wrapper h3-bold text-center sm:text-left py-5 md:py-10">
          Update Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm
          event={event}
          eventId={event._id}
          type="Update"
          userId={userId}
        />
      </div>
    </>
  );
};

export default UpdateEvent;
