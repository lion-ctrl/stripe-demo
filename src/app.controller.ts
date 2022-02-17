import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Stripe } from 'stripe';

@Controller()
export class AppController {
  private readonly stripe = new Stripe(
    'sk_test_51KTqhMEUSFQoEddUgXNsa9tRsgrt8OEuOIFYeGwwmq5InO3gqxWu7UmyTOXCQA9VbPNkUrhIwJd3lZYPlF9llkNN001CZhUjHm',
    { apiVersion: '2020-08-27' },
  );

  @Get()
  @Render('index')
  root() {
    return {
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      price: '30',
    };
  }

  @Post('/checkout')
  async checkout(@Body() body: any, @Res() res: Response) {
    const charge = await this.stripe.charges.create({
      amount: 3000,
      currency: 'usd',
      source: body.token.id,
      description: 'Sound',
    });
    // orden de compra

    res.status(200).json({ chargeId: charge.id });
    // id de compra finalizada
  }

  @Get('/success')
  @Render('success')
  success(@Query() query: any) {
    console.log(query);
    return { id: query.chargeid };
  }

  @Post('/refund')
  @Redirect('/')
  async refund(@Body() body: any) {
    const refund = await this.stripe.refunds.create({
      charge: body.charge_id,
    });
    console.log(refund);
  }
}
