import * as yup from 'yup';

export const passwordValidationSchema = yup.object().shape({
  password: yup.string().required(),
  length: yup.number().integer().required(),
  complexity: yup.string().required(),
  user_id: yup.string().nullable(),
});
