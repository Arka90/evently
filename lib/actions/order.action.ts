"use server";

import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { redirect } from "next/navigation";

import Stripe from "stripe";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";

export const checkOutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const price = order.isFree ? 0 : Number(order.price);

  const customer = await stripe.customers.create({
    name: "Jenny Rosen",
    address: {
      line1: "510 Townsend St",
      postal_code: "98140",
      city: "San Francisco",
      state: "CA",
      country: "US",
    },
  });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },

          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      customer_email: "skarka90@gmail.com",
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },

      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();
    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};
