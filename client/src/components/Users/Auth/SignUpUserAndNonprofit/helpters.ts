import { FormData } from './FormData';

export const toUser = (
  formData: FormData,
): { email: string; password: string; firstName: string; lastName: string } => {
  const { email, password, firstName, lastName } = formData;
  return {
    email,
    password,
    firstName,
    lastName,
  };
};

export const toOrg = (
  formData: FormData,
): {
  name: string;
  doing_business_as: string;
  description: string;
  website: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  ein: string;
  nonprofit_classification: string;
} => {
  const {
    name,
    doing_business_as,
    description,
    website,
    address,
    phone,
    city,
    state,
    ein,
    nonprofit_classification,
  } = formData;
  return {
    name,
    doing_business_as,
    description,
    website,
    address,
    phone,
    city,
    state,
    ein,
    nonprofit_classification,
  };
};
