export interface ICheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;

  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;

  saveAddress?: boolean;
}
