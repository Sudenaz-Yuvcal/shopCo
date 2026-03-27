export interface ICheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  expiryDate: string;
  cardName: string;
  cardNumber: string;
  cvc: string;
  saveAddress?: boolean;
}
